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

// add follower
module.exports.addFollower = function (userId, followerId) {
  return this.findByIdAndUpdate(userId, {
    $push: { followers: followerId },
    $inc: { followers_count: 1 },
  });
};

// remove follower
module.exports.removeFollower = function (userId, followerId) {
  return this.findByIdAndUpdate(userId, {
    $push: { followers: followerId },
    $inc: { followers_count: -1 },
  });
};

// add following
module.exports.addFollowing = function (userId, followedId) {
  return this.findByIdAndUpdate(userId, {
    $push: { following: followedId },
    $inc: { following_count: 1 },
  });
};

// remove following
module.exports.removeFollowing = function (userId, followedId) {
  return this.findByIdAndUpdate(userId, {
    $push: { following: followedId },
    $inc: { following_count: -1 },
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
    $push: { chats: chatId },
    $inc: { chats_count: -1 },
  });
};
