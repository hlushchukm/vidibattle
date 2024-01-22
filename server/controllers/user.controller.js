const { User } = require("../models/user.model");
const { deleteFile } = require("./media.controller");

module.exports.getBasicUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(
      id,
      "first_name last_name profile_img username"
    );

    res.json({ data: user });
  } catch (e) {
    next(e);
  }
};

module.exports.getProfileInfo = async (req, res, next) => {
  try {
    const { username } = req.params;
    let requestingUserId;
    if (req.user) {
      requestingUserId = req.user._id;
    }

    let excludeFields = "-following -chats -blocked_by -posts";

    const user = await User.findOne({ username }, excludeFields);

    // if user doesn't exist or has blocked the person making the request
    if (
      !user ||
      (requestingUserId && user.blocked_users?.includes(requestingUserId))
    ) {
      return res.status(404).json({ message: "user profile not found" });
    }

    let is_followed = false;
    let is_blocked = false;

    if (requestingUserId && !req.user.is_admin) {
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
    const { _id } = req.user;

    const user = await User.findById(
      _id,
      "first_name last_name username profile_img is_complete status"
    );

    res.json({
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.getFollowersAndFollowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    let requestingUserId;
    if (req.user) {
      requestingUserId = req.user._id;
    }

    // if requesting user is blocked by the requested user, return not found
    const user = await User.findById(
      id,
      "first_name last_name profile_img followers followers_count following following_count followers blocked_users username"
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
        select: "first_name last_name profile_img username",
        options: {
          skip: (page - 1) * limit,
          limit,
        },
      },
      {
        path: "following",
        select: "first_name last_name profile_img username",
        options: {
          skip: (page - 1) * limit,
          limit,
        },
      },
    ]);

    const responseUsers = user.toObject();
    delete responseUsers.blocked_users;

    res.status(200).json({ data: responseUsers, page, limit });
  } catch (e) {
    next(e);
  }
};

module.exports.getFollowers = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;
    let requestingUserId;
    if (req.user) {
      requestingUserId = req.user._id;
    }

    const user = await User.findOne({ username });
    const blockedUsers = [...user.blocked_users, ...user.blocked_by];

    await user.populate({
      path: "followers",
      match: {
        _id: { $nin: blockedUsers },
        status: { $ne: "deleted" },
      },
      options: {
        skip: (page - 1) * limit,
        limit,
      },
      select: "first_name last_name profile_img username",
    });

    if (
      !user ||
      (requestingUserId && user.blocked_users?.includes(requestingUserId))
    ) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ data: user.followers, page, limit });
  } catch (e) {
    next(e);
  }
};

module.exports.getFollowing = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;
    let requestingUserId;
    if (req.user) {
      requestingUserId = req.user._id;
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(200).json({ data: [], page, limit });

    const blockedUsers = [...user.blocked_users, ...user.blocked_by];

    await user.populate({
      path: "following",
      match: {
        _id: { $nin: blockedUsers },
        status: { $ne: "deleted" },
      },
      options: {
        skip: (page - 1) * limit,
        limit,
      },
      select: "first_name last_name profile_img username",
    });

    if (requestingUserId && user.blocked_users?.includes(requestingUserId)) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ data: user.following, page, limit });
  } catch (e) {
    next(e);
  }
};

module.exports.getSuggestedUsersToFollow = async (req, res, next) => {
  try {
    const { _id: requesterId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({ message: "user not found" });
    }

    const query = User.aggregate([
      { $match: { _id: { $ne: requester._id } } },
      { $match: { _id: { $nin: requester.blocked_by } } },
      { $match: { _id: { $nin: requester.blocked_users } } },
      { $match: { _id: { $nin: requester.following } } },
      { $match: { status: { $ne: "deleted" } } },
      { $sort: { followers_count: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          username: 1,
          profile_img: 1,
          followers_count: 1,
        },
      },
    ]);

    const results = await query.exec();
    return res.status(200).json({ data: results, page, limit });
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
      "first_name last_name blocked_users username"
    );

    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the paginated list of blocked users
    const blockedUsers = await User.find({
      _id: { $in: requestingUser.blocked_users },
    })
      .select("first_name last_name profile_img username")
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
      username,
      email,
      contact_no,
      provider,
      is_complete,
      status,
      createdAt,
    } = req.query;

    // Construct the filter query based on the provided filter parameters
    const filter = {};
    if (username) filter.username = { $regex: username, $options: "i" };
    if (first_name) filter.first_name = { $regex: first_name, $options: "i" };
    if (last_name) filter.last_name = { $regex: last_name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (contact_no) filter.contact_no = { $regex: contact_no, $options: "i" };
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
      "first_name last_name profile_img email contact_no provider is_complete status createdAt username";
    const users = await User.find(filter, selectedFields)
      .setOptions({ includeDeleted: true })
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

module.exports.changeUserStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    const allowedStatuses = ["active", "under review", "suspended", "deleted"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "invalid status type" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({ message: "user status changed", data: user });
  } catch (e) {
    next(e);
  }
};

module.exports.getSelfInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ data: user });
  } catch (e) {
    next(e);
  }
};

module.exports.updateSelfProfile = async (req, res, next) => {
  try {
    const { data: strData } = req.body;
    const data = JSON.parse(strData);

    const { _id } = req.user;
    const profileImg = req.file;

    if (!data.first_name) {
      return res.status(400).json({ message: "first name is required" });
    }

    if (!data.last_name) {
      return res.status(400).json({ message: "last name is required" });
    }

    if (!data.username) {
      return res.status(400).json({ message: "user name is required" });
    }

    if (!data.bio) {
      return res.status(400).json({ message: "bio is required" });
    }

    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ message: "invalid email pattern" });
    }

    let contactNoRegex = /^[0-9]{7,15}$/;
    if (
      data.contact_no &&
      data.contact_no.length > 0 &&
      !contactNoRegex.test(data.contact_no)
    ) {
      return res.status(400).json({ message: "invalid contact number length" });
    }

    const usernameMatch = await User.countDocuments({
      username: data.username,
      _id: { $ne: _id },
    });
    if (usernameMatch > 0) {
      return res.status(400).json({ message: "username is already taken" });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (profileImg) {
      // change profile pic
      await deleteFile(user.profile_img);
      user.profile_img = profileImg.filename;
    }

    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.email = data.email;
    user.username = data.username;
    user.contact_no = data.contact_no;
    user.bio = data.bio;
    user.interested_to_earn = data.interested_to_earn;
    user.address = data.address;
    user.social_links = data.social_links;
    if (
      data.first_name &&
      data.last_name &&
      data.username &&
      data.bio &&
      user.profile_img
    ) {
      user.is_complete = true;
    } else {
      user.is_complete = false;
    }

    await user.save();

    res.status(200).json({ message: "user data updated", data: user });
  } catch (e) {
    next(e);
  }
};

module.exports.searchUsers = async (req, res) => {
  try {
    let {
      name = "",
      page = 1,
      limit = 10,
      excludeFollowing = false,
    } = req.query;
    const requesterId = req.user._id;

    const requester = await User.findById(requesterId);
    if (!requester) {
      return res.status(404).json({ message: "user not found" });
    }

    if (name?.[0] === "@") {
      name = name.slice(1);
    }

    const splittedName = name.split(" ");
    const regex1 = new RegExp(
      splittedName[0].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "i"
    );

    let regex2;
    if (splittedName[1]) {
      regex2 = new RegExp(
        splittedName[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
        "i"
      );
    }

    // Query to exclude blocked users
    let excludeList = [
      requesterId, // Exclude the requester
      ...requester.blocked_users, // Exclude users blocked by the requester
      ...requester.blocked_by, // Exclude users who blocked the requester
    ];

    if (excludeFollowing) {
      excludeList = [...excludeList, ...requester.following];
    }

    const query = {
      $or: [
        { first_name: regex1 },
        { last_name: regex2 ? regex2 : regex1 },
        { username: regex1 },
      ],
      _id: {
        $nin: excludeList,
      },
    };

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const usersList = [];
    // check if there is any follower/following relationship with a user and the requester
    for (const user of users) {
      const userCopy = user.toObject();

      if (requester.following.includes(userCopy._id)) {
        userCopy.is_following = true;
      } else {
        userCopy.is_following = false;
      }

      if (requester.followers.includes(userCopy._id)) {
        userCopy.is_follower = true;
      } else {
        userCopy.is_follower = false;
      }

      usersList.push(userCopy);
    }

    res.json({
      data: usersList,
      page: parseInt(page),
      totalPages,
      totalCount,
    });
  } catch (e) {
    next(e);
  }
};
