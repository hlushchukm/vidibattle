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

module.exports.getProfileInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    let requestingUserId;
    if (req.user) {
      requestingUserId = req.user;
    }

    const user = await User.findById(
      id,
      "first_name last_name profile_img bio posts_count followers_count following_count followers blocked_users"
    );

    // if user doesn't exist or has blocked the person making the request
    if (
      !user ||
      (requestingUserId && user.blocked_users?.includes(requestingUserId))
    ) {
      return res.status(404).json({ message: "user profile not found" });
    }

    let is_followed = false;
    let is_blocked = false;

    if (requestingUserId) {
      is_followed = user.followers.includes(requestingUserId);

      const requesingUser = await User.findById(requestingUserId);

      if (!requesingUser) {
        return res.status(404).json({ message: "requesting user not found" });
      }

      is_blocked = requesingUser.blocked_users?.includes(user._id);
    }
    const response = { ...user.toObject(), is_followed, is_blocked };
    delete response.followers;
    delete response.blocked_users;

    res.json({ data: response });
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

module.exports.getFollowersAndFollowing = async (req, res, next) => {
  try {
    // TODO: add pagination
    const { id } = req.params;
    let requestingUserId;
    if (req.user) {
      requestingUserId = req.user;
    }

    // if requesting user is blocked by the requested user, return not found
    const user = await User.findById(
      id,
      "first_name last_name profile_img followers followers_count following following_count followers blocked_users"
    );

    if (
      !user ||
      (requestingUserId && user.blocked_users?.includes(requestingUserId))
    ) {
      return res.status(404).json({ message: "user profile not found" });
    }

    await user.populate([
      {
        path: "followers",
        select: "first_name last_name profile_img",
      },
      {
        path: "following",
        select: "first_name last_name profile_img",
      },
    ]);

    const responseUsers = user.toObject();
    delete responseUsers.blocked_users;

    res.status(200).json({ data: responseUsers });
  } catch (e) {
    next(e);
  }
};

module.exports.getBlockedUsers = async (req, res, next) => {
  try {
    const { _id: requestingUserId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    // Find the requesting user
    const requestingUser = await User.findById(
      requestingUserId,
      "first_name last_name blocked_users"
    );

    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the paginated list of blocked users
    const blockedUsers = await User.find({
      _id: { $in: requestingUser.blocked_users },
    })
      .select("first_name last_name profile_img")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Count the total number of blocked users
    const totalBlockedUsers = requestingUser.blocked_users.length;

    // Prepare the response object
    const response = {
      requesting_user: {
        first_name: requestingUser.first_name,
        last_name: requestingUser.last_name,
      },
      blocked_users: blockedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalBlockedUsers,
        totalPages: Math.ceil(totalBlockedUsers / limit),
      },
    };

    res.status(200).json({ data: response });
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
      $addToSet: { blocked_users: blockedId },
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
