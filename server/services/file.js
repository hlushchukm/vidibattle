const fs = require("fs");

module.exports.getPathToTempFolder = (filename) => {
  const tempPath = "temp/";
  return tempPath + filename;
};

module.exports.deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Error! couldn't delete file " + filePath);
        console.log(err);
      } else {
        console.log(filePath + " file deleted successfully");
      }
    });
  }
};

module.exports.deleteMultipleFiles = (filePaths = []) => {
  filePaths.forEach((file) => {
    this.deleteFile(file);
  });
};
