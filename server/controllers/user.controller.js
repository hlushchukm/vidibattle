const { User } = require("../models/user.model");

module.exports.searchUser = async (req, res, next) => {};

module.exports.getBasicUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "first_name last_name profile_img");

    res.json({ data: user });
  } catch (e) {
    next(e);
  }
};

module.exports.getAuthenticatedUser = async (req, res, next) => {
  try {
    const { _id, first_name, last_name, profile_img } = req.user;
    res.json({ data: { _id, first_name, last_name, profile_img } });
  } catch (e) {
    next(e);
  }
};

module.exports.follow = async (req, res, next) => {
  try {
    const followerId = req.user._id;
    const { followedId } = req.params;

    if (!followerId || !followedId) {
      return res.status(400).json({ message: "incomplete data" });
    } else if (followerId === followedId) {
      return res
        .status(400)
        .json({ message: "follower and followed users can't be the same" });
    }

    await User.addFollower(followedId, followerId);
    await User.addFollowing(followerId, followedId);

    res.status(200).json({ message: "user data updated successfully" });
  } catch (e) {
    next(e);
  }
};

module.exports.unfollow = async (req, res, next) => {
  try {
    const followerId = req.user._id;
    const { followedId } = req.params;

    if (!followerId || !followedId) {
      return res.status(400).json({ message: "incomplete data" });
    } else if (followerId === followedId) {
      return res
        .status(400)
        .json({ message: "follower and followed can't be the same" });
    }

    await User.removeFollower(followedId, followerId);
    await User.removeFollowing(followerId, followedId);

    res.status(200).json({ message: "user data updated successfully" });
  } catch (e) {
    next(e);
  }
};

module.exports.block = async (req, res, next) => {
  try {
    const { blockedId } = req.params;
    const { _id: userId } = req.user;

    if (userId === blockedId) {
      return res
        .status(400)
        .json({ message: "blocked and blocking person cannot be the same" });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { blocked_users: blockedId },
    });

    res.status(200).json({ message: "user blocked successfully" });
  } catch (e) {
    next(e);
  }
};

module.exports.unblock = async (req, res, next) => {
  try {
    const { blockedId } = req.params;
    const { _id: userId } = req.user;

    if (userId === blockedId) {
      return res
        .status(400)
        .json({ message: "blocked and blocking person cannot be the same" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { blocked_users: blockedId },
    });

    res.status(200).json({ message: "user unblocked successfully" });
  } catch (e) {
    next(e);
  }
};
