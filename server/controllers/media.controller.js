const { default: mongoose } = require("mongoose");
const Grid = require("gridfs-stream");
const request = require("request");
const crypto = require("crypto");
const Ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const createHttpError = require("http-errors");
const { getPathToTempFolder, deleteFile } = require("../services/file");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);

// Init stream
const conn = mongoose.connection;

let gfs, gridfsBucket;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "media",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("media");
});

module.exports.getMedia = async (req, res, next) => {
  const { filename } = req.params;
  try {
    const file = await gfs.files.findOne({
      filename,
    });

    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }

    const range = req.headers.range;
    if (range && typeof range === "string") {
      // Create response headers
      const videoSize = file.length;

      // const start = Number(range.replace(/\D/g, ""));
      // const end = videoSize - 1;

      // get start and end of the request from the range
      let [start, end] = range.replace(/bytes=/, "").split("-");
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : videoSize - 1;

      // if 'end' doesnot have a value, set it to the end of the file
      if (!isNaN(start) && isNaN(end)) {
        start = start;
        end = videoSize - 1;
      }

      // if 'start' doesn't have a value, move 'end' to the end of the file and set 'start' to 'videosize - end'
      if (isNaN(start) && !isNaN(end)) {
        start = videoSize - end;
        end = videoSize - 1;
      }

      // handle request out of range
      if (start >= videoSize || end >= videoSize) {
        res.writeHead(416, { "Content-Range": `bytes */${videoSize}` });
        return res.end();
      }

      const contentLength = end - start + 1;

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": file.contentType,
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      const readStream = gridfsBucket.openDownloadStreamByName(filename, {
        start,
        end: end + 1,
      });

      readStream.on("error", (err) => {
        console.log("error while streaming", err);
        res.end();
      });

      readStream.pipe(res);
    } else {
      const readStream = gridfsBucket.openDownloadStreamByName(filename);
      res.setHeader("Content-Length", file.length);
      res.setHeader("Content-Type", file.contentType);
      readStream.pipe(res);
    }
  } catch (e) {
    next(e);
  }
};

const downloadImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    request({ url, encoding: null }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve({ body, contentType: response.headers["content-type"] });
      } else {
        reject(error);
      }
    });
  });
};

const storeImageInGridFS = (imageData, contentType) => {
  return new Promise((resolve, reject) => {
    const filename =
      crypto.randomBytes(16).toString("hex") + "." + contentType.split("/")[1];
    const writestream = gridfsBucket.openUploadStream(filename, {
      contentType,
    });

    writestream.on("finish", (file) => {
      resolve(file);
    });

    writestream.write(imageData);
    writestream.end();

    writestream.on("error", (uploadError) => {
      reject(uploadError);
    });
  });
};

module.exports.storeProfile = async (url) => {
  try {
    const { body, contentType } = await downloadImageFromURL(url);
    const file = await storeImageInGridFS(body, contentType);

    return file.filename;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.deleteFile = async (filename) => {
  try {
    const file = await gfs.files.findOne({
      filename,
    });

    if (file) {
      await gridfsBucket.delete(file._id);
    }
  } catch (e) {
    throw new Error(e);
  }
};

// add a sticker from a video by retrieving both the video and the sticker from GridFS, saving the sticker locally, processing the video using Ffmpeg and saving the processed video locally
module.exports.addStickerToVideo = async (videoName, sticker) => {
  // get filetypes
  const videoExtension = videoName.split(".")?.[1];

  // Create the temp directory if it doesn't exist
  const directoryPath = getPathToTempFolder("");
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const stickerPath = getPathToTempFolder(sticker.image);
  await this.downloadFileFromGridFs(sticker.image, stickerPath);

  const videoPath = getPathToTempFolder(videoName);
  await this.downloadFileFromGridFs(videoName, videoPath);

  // Check if files exist before proceeding to ffmpeg
  if (!fs.existsSync(stickerPath)) {
    console.log("Sticker file was not downloaded. Aborting operation");
    throw new Error("Sticker file was not downloaded. Aborting operation");
  }

  if (!fs.existsSync(videoPath)) {
    console.log("Video file was not downloaded. Aborting operation");
    throw new Error("Video file was not downloaded. Aborting operation");
  }

  const outputPath = getPathToTempFolder(
    videoName + "_" + sticker.image + "." + videoExtension
  );

  return new Promise((resolve, reject) => {
    // Add sticker to video using ffmpeg
    Ffmpeg(videoPath)
      .input(stickerPath)
      .complexFilter(this.getStickerPostitionCommand(sticker.position))
      .output(outputPath)
      .on("end", () => {
        deleteFile(stickerPath); // remove sticker file
        deleteFile(videoPath); // remove video file
        resolve(outputPath);
      })
      .on("error", (err) => {
        deleteFile(stickerPath); // remove sticker file
        deleteFile(videoPath); // remove video file
        console.error("Error adding sticker to video:", err);
        reject(createHttpError(500, "Error adding sticker to video"));
      })
      .on("codecData", (data) => {
        console.log(
          "Ffmpeg input is " +
            data.audio +
            " audio " +
            "with " +
            data.video +
            " video. File extension is " +
            videoExtension
        );
      })
      .run();
  });
};

module.exports.getStickerPostitionCommand = (position) => {
  // [0:v] is the first input which is the video
  // [1:v] is the second input which is the sticker
  switch (position) {
    case "top-right":
      return "[1:v]scale=100:-1 [sticker]; [0:v]scale=-2:720 [base]; [base][sticker]overlay=W-w-10:10";
    case "bottom-left":
      return "[1:v]scale=100:-1 [sticker]; [0:v]scale=-2:720 [base]; [base][sticker]overlay=10:H-h-10";
    case "bottom-right":
      return "[1:v]scale=100:-1 [sticker]; [0:v]scale=-2:720 [base]; [base][sticker]overlay=W-w-10:H-h-10";
    case "top":
      return "[1:v]scale=-1:100 [sticker]; [0:v]scale=-2:720 [base]; [base][sticker]overlay=(W-w)/2:0";
    case "bottom":
      return "[1:v]scale=-1:100 [sticker]; [0:v]scale=-2:720 [base]; [base][sticker]overlay=(W-w)/2:H-h-0";
    case "top-left":
    default:
      return "[1:v]scale=100:-1 [sticker]; [0:v]scale=-2:720 [base]; [base][sticker]overlay=10:10";
  }
};

module.exports.storeFileFromLocalToGridFS = (
  sourcePath,
  filename,
  contentType
) => {
  return new Promise((resolve, reject) => {
    // open upload stream to gridfs
    const writestream = gridfsBucket.openUploadStream(filename, {
      contentType,
    });

    // read from the local file
    const readStream = fs.createReadStream(sourcePath);
    readStream.pipe(writestream); // save to GridFs

    readStream.on("end", () => {
      writestream.end();
    });

    writestream.on("finish", (file) => {
      deleteFile(sourcePath);
      resolve(file);
      console.log("finished uploading ", sourcePath);
    });

    writestream.on("error", (uploadError) => {
      console.log("upload error: ", uploadError);
      reject(createHttpError("Error while uploading file"));
    });
  });
};

module.exports.downloadFileFromGridFs = async (filename, filePath) => {
  const downloadStream = await this.getReadStreamFromGridFS(filename);
  const writeStream = fs.createWriteStream(filePath);

  await new Promise((resolve, reject) => {
    downloadStream.pipe(writeStream);

    writeStream.on("finish", () => {
      resolve();
    });

    writeStream.on("error", (e) => {
      console.log("Error while downloading " + filePath, e);
      reject(createHttpError("Error while downloading " + filePath));
    });
  });
  writeStream.end();
};

module.exports.getReadStreamFromGridFS = async (filename) => {
  const file = await gfs.files.findOne({ filename });

  if (!file) {
    console.log("file not found. reschedule file download");
    throw new Error("file not found");
  }

  // save the video to a temp folder
  const downloadStream = gridfsBucket.openDownloadStreamByName(filename);
  return downloadStream;
};

module.exports.renameFile = async (originalName, newName) => {
  const file = await gfs.files.findOne({ filename: originalName });

  if (!file) {
    throw new Error(
      `file ${originalName} was not found. Couldn't rename file. Operation Aborted`
    );
  }

  await gridfsBucket.rename(file._id, newName);
};

module.exports.isProcessableVideo = async (filename) => {
  const videoPath = getPathToTempFolder("codec_check_" + filename);
  try {
    // need to download the file because giving a readStream for ffprobe was generating EOF error for some video files
    await this.downloadFileFromGridFs(filename, videoPath);
    const metadata = await new Promise((resolve, reject) => {
      Ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata);
        }
      });
    });

    const videoStream = metadata.streams[0];
    const codec = videoStream.codec_name;

    console.log("the codec of the file " + filename + " is: " + codec);

    const supportedCodecs = ["h264", "mpeg2", "aac"];

    deleteFile(videoPath);

    // Check if the codec is supported
    if (supportedCodecs.includes(codec)) {
      console.log("supported video codec: " + codec);
      return true;
    } else {
      console.log("Unsupported video codec detected: " + codec);
      return false;
    }
  } catch (error) {
    console.error("Error while getting the codec info of a video:", error);
    deleteFile(videoPath);
    return false;
  }
};

module.exports.getVideoDimensions = async (videoBuffer) => {
  const probeData = await probe(videoBuffer);
  return probeData.streams[0].width && probeData.streams[0].height
    ? {
        width: probeData.streams[0].width,
        height: probeData.streams[0].height,
        codecName: probeData.streams[0].codec_name,
      }
    : {};
};

module.exports.resizeStickerForVideo = async (videoBuffer, imageBuffer) => {
  // to get buffer
  // fs.readFileSync(filePath);

  // Get video dimensions and codec
  const videoInfo = await this.getVideoDimensions(videoBuffer);
  const {
    width: videoWidth,
    height: videoHeight,
    codecName: videoCodec,
  } = videoInfo;

  // Process the image using Jimp
  // do npm i jimp
  const image = await Jimp.read(imageBuffer);

  // Get image dimensions
  let { width: imageWidth, height: imageHeight } = image.bitmap;

  const margin = 10; // margin for sticker

  // Calculate minimum and maximum image dimensions based on video dimensions and constraints
  const minWidth = Math.floor(videoWidth * 0.05); // Minimum width: 5% of video width
  const minHeight = Math.floor(videoHeight * 0.05); // Minimum height: 5% of video height
  const maxWidth = Math.floor(videoWidth * 0.9); // Maximum width: 90% of video width
  const maxHeight = Math.floor(videoHeight * 0.1); // Maximum height: 10% of video height

  let scaleFactor = 0;

  // scale the width if it is not within the maxWidth and minWidth constraint
  if (imageWidth > maxWidth) {
    scaleFactor = maxWidth / imageWidth;
  } else if (imageWidth < minWidth) {
    scaleFactor = minWidth / imageWidth;
  }

  if (scaleFactor !== 0) {
    image.resize(imageWidth * scaleFactor, imageHeight * scaleFactor);
    imageWidth = image.bitmap.width;
    imageHeight = image.bitmap.height;
  }

  scaleFactor = 0;
  // scale the height if it is not within the maxHeight and minHeight constraint
  if (imageHeight > maxHeight) {
    scaleFactor = maxHeight / imageHeight;
  } else if (imageHeight < minHeight) {
    scaleFactor = minHeight / imageHeight;
  }

  if (scaleFactor !== 0) {
    image.resize(imageWidth * scaleFactor, imageHeight * scaleFactor);
    imageWidth = image.bitmap.width;
    imageHeight = image.bitmap.height;
  }
};

module.exports.getStickerPostitionCoordinates = (
  position,
  { videoWidth, videoHeight },
  { imageWidth, imageHeight }
) => {
  const margin = 10; // margin for the sticker on the video
  let x, y;
  switch (position) {
    case "top":
      x = Math.floor((videoWidth - imageWidth) / 2);
      y = margin;
      break;
    case "top-left":
      x = margin;
      y = margin;
      break;
    case "top-right":
      x = videoWidth - imageWidth - margin;
      y = margin;
      break;
    case "bottom":
      x = Math.floor((videoWidth - imageWidth) / 2);
      y = videoHeight - imageHeight - margin;
      break;
    case "bottom-left":
      x = margin;
      y = videoHeight - imageHeight - margin;
      break;
    case "bottom-right":
      x = videoWidth - imageWidth - margin;
      y = videoHeight - imageHeight - margin;
      break;
    default:
      // Handle the case if user enters an invalid position
      console.error(
        "Invalid sticker position specified. Defaulting to top-left"
      );
      x = margin;
      y = margin;
  }

  return { x, y };
};
