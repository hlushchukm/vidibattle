const { default: mongoose } = require("mongoose");
const Grid = require("gridfs-stream");
const request = require("request");
const crypto = require("crypto");

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

downloadImageFromURL = (url) => {
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

storeImageInGridFS = (imageData, contentType) => {
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

module.exports.deleteProfileImg = async (filename) => {
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
