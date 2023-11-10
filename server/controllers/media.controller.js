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

    const readStream = gridfsBucket.openDownloadStreamByName(filename);
    readStream.pipe(res);
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
    const writestream = gridfsBucket.openUploadStream(filename);

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
    throw e;
  }
};
