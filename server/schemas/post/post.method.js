const { default: mongoose } = require("mongoose");

// generate feed for a user
module.exports.feed = function ({ lastDate, lastPostId, pageSize }) {
  let query = { hidden: false };

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

  return this.find(query, "caption media likes_count createdAt updatedAt")
    .sort({ createdAt: -1, _id: -1 })
    .limit(parseInt(pageSize))
    .populate("author", "first_name last_name profile_img");
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
