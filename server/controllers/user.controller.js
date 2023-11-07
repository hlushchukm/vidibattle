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
      requestingUserId = req.user._id;
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
      requestingUserId = req.user._id;
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

    res.status(200).json({
      data: blockedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalBlockedUsers,
        totalPages: Math.ceil(totalBlockedUsers / limit),
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports.getUsersList = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      first_name,
      last_name,
      email,
      whatsapp,
      provider,
      is_complete,
      status,
      createdAt,
    } = req.query;

    // Construct the filter query based on the provided filter parameters
    const filter = {};
    if (first_name) filter.first_name = { $regex: first_name, $options: "i" };
    if (last_name) filter.last_name = { $regex: last_name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (whatsapp) filter.whatsapp = { $regex: whatsapp, $options: "i" };
    if (provider) filter.provider = provider;
    if (is_complete) filter.is_complete = is_complete === "true";
    if (status) filter.status = status;
    if (createdAt) {
      // Assuming createdAt is a valid date string in ISO format
      const startDate = new Date(createdAt);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1); // Add 1 day to include the entire day
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Count the total number of matching documents for pagination
    const total = await User.countDocuments(filter);

    // Apply pagination, sorting, and retrieve the users
    const selectedFields =
      "first_name last_name profile_img email whatsapp provider is_complete status createdAt";
    const users = await User.find(filter, selectedFields)
      .sort({ first_name: 1, last_name: 1, createdAt: -1 }) // Sort by name and createdAt
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: users,
    });
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

    await User.findByIdAndUpdate(blockedId, {
      $addToSet: { blocked_by: userId },
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

    await User.findByIdAndUpdate(blockedId, {
      $pull: { blocked_by: userId },
    });

    res.status(200).json({ message: "user unblocked successfully" });
  } catch (e) {
    next(e);
  }
};
