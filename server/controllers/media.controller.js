const { default: mongoose } = require("mongoose");
const Grid = require("gridfs-stream");

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
