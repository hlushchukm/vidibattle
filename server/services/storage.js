const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

// Create Storage Engine
const storage = new GridFsStorage({
  url: process.env.ATLAS_URI ?? "",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      console.log("inside multer file upload")
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "media",
        };
        console.log("file info to be uploaded is ", fileInfo)
        resolve(fileInfo);
      });
    });
  },
});

module.exports.upload = multer({ storage });
