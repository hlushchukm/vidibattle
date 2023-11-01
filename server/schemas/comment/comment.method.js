const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");

// like comment
module.exports.like = async function (userId, commentId) {
  const comment = await this.findById(commentId);
  if (!comment) {
    throw createHttpError(404, "comment not found");
  }

  if (!comment.likes.includes(userId)) {
    comment.likes.push(userId);
    comment.likes_count += 1;
    return comment.save();
  } else {
    return;
  }
};

// unlike comment
module.exports.unlike = async function (userId, commentId) {
  const comment = await this.findById(commentId);
  if (!comment) {
    throw createHttpError(404, "comment not found");
  }

  const likeIndex = comment.likes.indexOf(userId);
  if (likeIndex > -1) {
    comment.likes.splice(likeIndex, 1);
    comment.likes_count -= 1;
    return comment.save();
  } else {
    return;
  }
};

// get limited number of comments
module.exports.getComments = async function (
  comment_for,
  parent,
  lastDate,
  lastCommentId,
  pageSize,
  userId
) {
  let query = {};
  if (comment_for === "post") {
    query = { comment_for: "post", parent_post: parent };
  } else if (comment_for === "comment") {
    query = { comment_for: "comment", parent_comment: parent };
  } else {
    throw createHttpError(400, "invalid comment_for value provided");
  }

  if (lastDate) {
    query.$or = [
      { createdAt: { $lt: new Date(lastDate) } },
      {
        $and: [
          { createdAt: new Date(lastDate) },
          { _id: { $lt: new mongoose.Types.ObjectId(lastCommentId) } },
        ],
      },
    ];
  }

  return this.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(parseInt(pageSize))
    .populate("reply_for", "first_name last_name")
    .populate("author", "first_name last_name profile_img")
    .populate({
      // get if the current user has liked the comment
      path: "likes",
      match: { _id: userId }, // Match the user ID
      select: "_id", // Only select the user ID
    });
};
