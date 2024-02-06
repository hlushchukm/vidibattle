const createHttpError = require("http-errors");

// add post
module.exports.addPost = function (userId, postId) {
  return this.findByIdAndUpdate(userId, {
    $push: { posts: postId },
    $inc: { posts_count: 1 },
  });
};

// remove post
module.exports.removePost = function (userId, postId) {
  return this.findByIdAndUpdate(userId, {
    $pull: { posts: postId },
    $inc: { posts_count: -1 },
  });
};

module.exports.removePosts = function (userId, posts) {
  return this.findByIdAndUpdate(userId, {
    $pull: { posts: { $in: posts } },
    $inc: { posts_count: -posts.length },
  });
};

// add follower
module.exports.addFollower = function (userId, followerId) {
  return this.findById(userId).then((user) => {
    if (!user) {
      throw createHttpError(404, "user not found");
    }

    if (!user.followers.includes(followerId)) {
      user.followers.push(followerId);
      user.followers_count = user.followers.length;
      return user.save();
    } else {
      throw createHttpError(400, "user is already a follower");
    }
  });
};

// remove follower
module.exports.removeFollower = function (userId, followerId) {
  return this.findById(userId).then((user) => {
    if (!user) {
      throw createHttpError(404, "user not found");
    }

    const followerIndex = user.followers.indexOf(followerId);
    if (followerIndex > -1) {
      user.followers.splice(followerIndex, 1);
      user.followers_count = user.followers.length;
      return user.save();
    } else {
      throw createHttpError(400, "user is not a follower");
    }
  });
};

// add following
module.exports.addFollowing = function (userId, followedId) {
  return this.findById(userId).then((user) => {
    if (!user.following.includes(followedId)) {
      user.following.push(followedId);
      user.following_count += 1;
      return user.save();
    } else {
      throw createHttpError(400, "user is already follwed by the given person");
    }
  });
};

// remove following
module.exports.removeFollowing = function (userId, followedId) {
  return this.findById(userId).then((user) => {
    const followedIndex = user.following.indexOf(followedId);
    if (followedIndex > -1) {
      user.following.splice(followedIndex, 1);
      user.following_count -= 1;
      return user.save();
    } else {
      throw createHttpError(400, "user is not followed by the given person");
    }
  });
};

// add chat
module.exports.addChat = function (userId, chatId) {
  return this.findByIdAndUpdate(userId, {
    $push: { chats: chatId },
    $inc: { chats_count: 1 },
  });
};

// remove chat
module.exports.removeChat = function (userId, chatId) {
  return this.findByIdAndUpdate(userId, {
    $pull: { chats: chatId },
    $inc: { chats_count: -1 },
  });
};
