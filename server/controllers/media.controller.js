const { default: mongoose } = require("mongoose");
const Grid = require("gridfs-stream");
const request = require("request");
const crypto = require("crypto");
const Ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const createHttpError = require("http-errors");
const { getPathToTempFolder, deleteFile } = require("../services/file");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
Ffmpeg.setFfmpegPath(ffmpegPath);

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
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;
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
  const stickerStream = gridfsBucket.openDownloadStreamByName(sticker.image);
  const videoStream = gridfsBucket.openDownloadStreamByName(videoName);

  // get filetypes
  const videoExtension = videoName.split(".")?.[1];
  const stickerExtension = sticker.image.split(".")?.[1];

  // save the sticker to a temp file because ffmpeg doesn't support two imput streams
  const stickerPath = getPathToTempFolder("temp_sticker." + stickerExtension);
  const stickerWriteStream = fs.createWriteStream(stickerPath);
  await new Promise((resolve, reject) => {
    stickerStream.pipe(stickerWriteStream);

    stickerWriteStream.on("finish", () => {
      resolve();
    });

    stickerWriteStream.on("error", (e) => {
      console.log("Error while downloading sticker", e);
      reject(createHttpError("Error while downloading sticker"));
    });
  });
  stickerWriteStream.end();

  const outputPath = getPathToTempFolder("output." + videoExtension);

  return new Promise((resolve, reject) => {
    // Add sticker to video using ffmpeg
    Ffmpeg(videoStream)
      .input(stickerPath)
      .complexFilter(this.getStickerPostitionCommand(sticker.position))
      .output(outputPath)
      .on("end", () => {
        deleteFile(stickerPath); // remove sticker file
        resolve(outputPath);
      })
      .on("error", (err) => {
        deleteFile(stickerPath); // remove sticker file
        console.error("Error adding sticker to video:", err);
        reject(createHttpError(500, "Error adding sticker to video"));
      })
      .run();
  });
};

module.exports.getStickerPostitionCommand = (position) => {
  switch (position) {
    case "top-right":
      return "[1:v]scale=100:-1 [sticker]; [0:v][sticker]overlay=W-w-10:10";
    case "bottom-left":
      return "[1:v]scale=100:-1 [sticker]; [0:v][sticker]overlay=10:H-h-10";
    case "bottom-right":
      return "[1:v]scale=100:-1 [sticker]; [0:v][sticker]overlay=W-w-10:H-h-10";
    case "top":
      return "[1:v]scale=-1:100 [sticker]; [0:v][sticker]overlay=(W-w)/2:0";
    case "bottom":
      return "[1:v]scale=-1:100 [sticker]; [0:v][sticker]overlay=(W-w)/2:H-h-0";
    case "top-left":
    default:
      return "[1:v]scale=100:-1 [sticker]; [0:v][sticker]overlay=10:10";
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
    });

    writestream.on("error", (uploadError) => {
      console.log("upload error: ", uploadError);
      reject(createHttpError("Error while uploading file"));
    });
  });
};
