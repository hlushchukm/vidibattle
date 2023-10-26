const { Post } = require("../models/post.model");
const { Media } = require("../models/media.model");
const { User } = require("../models/user.model");

module.exports.getFeed = async (req, res, next) => {
  const { userId, pageSize, lastDate, lastPostId } = req.query;

  try {
    const posts = await Post.feed({ lastDate, lastPostId, pageSize });

    let updatedLastDate = lastDate;
    let updatedLastPostId = lastPostId;

    if (posts.length > 0) {
      updatedLastDate = posts[posts.length - 1].createdAt.toISOString();
      updatedLastPostId = posts[posts.length - 1]._id.toString();
    }

    // TODO: determine if current user has liked a media
    res.status(200).json({
      data: posts,
      pageSize,
      lastDate: updatedLastDate,
      lastPostId: updatedLastPostId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getTimeline = async (req, res, next) => {
  const { userId } = req.params;
  const { pageSize, lastDate, lastPostId } = req.query;

  try {
    const posts = await Post.timeline({
      author: userId,
      lastDate,
      lastPostId,
      pageSize,
    });

    let updatedLastDate = lastDate;
    let updatedLastPostId = lastPostId;

    if (posts.length > 0) {
      updatedLastDate = posts[posts.length - 1].createdAt.toISOString();
      updatedLastPostId = posts[posts.length - 1]._id.toString();
    }

    res.status(200).json({
      data: posts,
      pageSize,
      lastDate: updatedLastDate,
      lastPostId: updatedLastPostId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.create = async (req, res, next) => {
  // TODO: match author with the person making the request
  const { caption, author } = req.body;
  const { filename, contentType } = req.file;

  try {
    // create the media document
    const media = new Media({
      filename,
      contentType,
      type: "video",
      owner: author,
    });
    // TODO: store thumbnail

    await media.save();

    const post = new Post({
      caption,
      media: [media._id],
      author,
    });

    // update the user's post array
    await User.addPost(author, post._id);

    await post.save();

    res.status(201).json({ message: "post created successfully", data: post });
  } catch (error) {
    next(error);
  }
};
