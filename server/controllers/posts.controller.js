module.exports.getFeed = async (req, res, next) => {
    next(new Error("HEllo"))
//   res.end("get feed works");
};

module.exports.getTimeline = async (req, res, next) => {
  res.end("get timeline works");
};

module.exports.create = async (req, res, next) => {
  res.end("create works");
};
