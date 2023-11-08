const { Post } = require("../models/post.model");
const { Media } = require("../models/media.model");
const { User } = require("../models/user.model");

module.exports.getFeed = async (req, res, next) => {
  try {
    let { pageSize, lastDate, lastPostId } = req.query;
    const { _id: userId } = req.user;

    if (!pageSize) pageSize = 10;

    const currentUser = await User.findById(userId);
    if (!currentUser)
      return res.status(400).json({ message: "user not found" });

    const posts = await Post.feed({
      lastDate,
      lastPostId,
      pageSize,
      currentUser,
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

module.exports.getTimeline = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let { pageSize, lastDate, lastPostId } = req.query;

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

module.exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    let requestingUserId;
    if (req.user) {
      requestingUserId = req.user._id;
    }

    const post = await Post.findOne({ _id: postId, is_deleted: false });

    if (!post) {
      return res.status(404).json({ message: "post not found!" });
    }

    let is_liked = false;

    if (requestingUserId && !req.user.is_admin) {
      const requestingUser = await User.findById(requestingUserId);
      const author_is_blocked =
        requestingUser?.blocked_users?.includes(requestingUserId);
      const requesting_user_is_blocked = requestingUser?.blocked_by?.includes(
        post.author
      );

      if (author_is_blocked || requesting_user_is_blocked) {
        return res.status(403).json({ message: "can't access this post" });
      }

      is_liked = post.likes?.includes(requestingUserId);
    }

    await post.populate([
      {
        path: "author",
        select: "first_name last_name profile_img",
      },
      {
        path: "media",
        populate: {
          path: "thumbnail",
        },
      },
    ]);
    console.log(post);

    const responsePost = { ...post.toObject(), is_liked };

    res.status(200).json({ data: responsePost });
  } catch (e) {
    next(e);
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

module.exports.removePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findOneAndUpdate({ _id: id }, { is_deleted: true });

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    res.status(204).json({ message: "post removed" });
  } catch (e) {
    next(e);
  }
};
