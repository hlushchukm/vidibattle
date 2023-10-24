const { default: mongoose } = require("mongoose");

// generate feed for a user
module.exports.feed = function ({ lastDate, lastPostId, pageSize }) {
  let query = {};

  if (lastDate) {
    query.$or = [
      { createdAt: { $lt: new Date(lastDate) } },
      {
        $and: [
          { createdAt: new Date(lastDate) },
          { _id: { $lt: new mongoose.Types.ObjectId(lastPostId) } },
        ],
      },
    ];
  }

  return this.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(parseInt(pageSize));
};

// generate a timeline for a user
module.exports.timeline = function ({
  author,
  lastDate,
  lastPostId,
  pageSize,
}) {
  let query = { author };
  if (lastDate) {
    query.$or = [
      { createdAt: { $lt: new Date(lastDate) } },
      {
        $and: [
          { createdAt: new Date(lastDate) },
          { _id: { $lt: new mongoose.Types.ObjectId(lastPostId) } },
        ],
      },
    ];
  }

  return this.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(parseInt(pageSize));
};
