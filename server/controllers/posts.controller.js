const { Post } = require("../models/post.model");
const { Media } = require("../models/media.model");
const { User } = require("../models/user.model");

module.exports.getFeed = async (req, res, next) => {
  const { userId, pageSize, lastDate, lastPostId } = req.query;

  try {
    if (!pageSize) pageSize = 10;

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
    if (!pageSize) pageSize = 10;

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
  const { caption, author, type } = req.body;
  const { filename, contentType } = req.file;

  const { _id } = req.user;

  // match author with the person making the request
  if (_id !== author) {
    return res
      .status(403)
      .json({ message: "can create a post for the given author" });
  } else if (type !== "image" && type !== "video") {
    return res.status(400).json({ message: "invalid media type" });
  }

  try {
    // create the media document
    const media = new Media({
      filename,
      contentType,
      type,
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

module.exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { _id } = req.user;

    if (!_id || !postId) {
      return res
        .status(400)
        .json({ message: "both userId and postId are required" });
    }

    await Post.like(_id, postId);
    res.status(200).json({ message: "post liked successfully" });
  } catch (e) {
    next(e);
  }
};

module.exports.unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { _id } = req.user;

    if (!_id || !postId) {
      return res
        .status(400)
        .json({ message: "both userId and postId are required" });
    }

    await Post.unlike(_id, postId);
    res.status(200).json({ message: "post unliked successfully" });
  } catch (e) {
    next(e);
  }
};
