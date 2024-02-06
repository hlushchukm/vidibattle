const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { User } = require("../../models/user.model");
const { Competition } = require("../../models/competition.model");

// generate feed for a user
module.exports.feed = async function ({
  lastDate,
  lastPostId,
  pageSize,
  currentUser,
  competitionId,
  allPosts, // get posts from followings list or from any person
  lastLikesCount,
  round,
}) {
  let query = {
    is_deleted: false,
  }; // undeleted posts

  if (currentUser) {
    // posts by unblocked people
    query.$and = [
      { author: { $nin: currentUser.blocked_users } },
      { author: { $nin: currentUser.blocked_by } },
    ];
  }

  if (competitionId) {
    query.competition = competitionId;
    const competition = await Competition.findById(competitionId);
    if (
      competition &&
      (competition.status === "scheduled" ||
        (round && parseInt(round) > competition.current_round))
    ) {
      // if the competition or the round is not started yet, show the user only his/her posts
      query.author = currentUser?._id;
    }

    if (round) {
      query.round = round;
    } else {
      query.round = { $lte: competition.current_round };
    }
  } else {
    // exclude posts in active competition from the feed
    const activeCompetitions = await Competition.find(
      {
        status: { $in: ["scheduled", "started"] },
      },
      "_id"
    );
    query.competition = { $nin: activeCompetitions };
  }

  if (!allPosts && currentUser) {
    const unblockedFollowings = [];

    currentUser.following.map((f) => {
      if (
        !currentUser?.blocked_users?.includes(f._id) &&
        !currentUser?.blocked_by?.includes(f._id)
      ) {
        unblockedFollowings.push(f._id);
      }
    });

    if (unblockedFollowings.length > 0) {
      unblockedFollowings.push(currentUser._id);
      query.author = { $in: unblockedFollowings };
    }
  }

  if (lastDate) {
    if (!competitionId) {
      query.$or = [
        { createdAt: { $lt: new Date(lastDate) } },
        {
          $and: [
            { createdAt: new Date(lastDate) },
            { _id: { $lt: new mongoose.Types.ObjectId(lastPostId) } },
          ],
        },
      ];
    } else {
      query.$or = [
        { likes_count: { $lt: lastLikesCount } },
        {
          $and: [
            { likes_count: { $eq: lastLikesCount } },
            { createdAt: { $lt: new Date(lastDate) } },
          ],
        },
        {
          $and: [
            { likes_count: { $eq: lastLikesCount } },
            { createdAt: new Date(lastDate) },
            { _id: { $lt: new mongoose.Types.ObjectId(lastPostId) } },
          ],
        },
      ];
    }
  }

  return this.find(
    query,
    "caption media likes_count comments_count competition round createdAt updatedAt"
  )
    .sort(
      competitionId
        ? round
          ? { round: -1, likes_count: -1, createdAt: -1, _id: -1 }
          : { likes_count: -1, createdAt: -1, _id: -1 }
        : { createdAt: -1, _id: -1 }
    )
    .limit(parseInt(pageSize))
    .populate("author", "first_name last_name profile_img username address")
    .populate({
      path: "media",
      populate: {
        path: "thumbnail",
      },
    })
    .populate({
      path: "likes",
      match: { _id: currentUser?._id },
      select: "_id",
    })
    .populate("competition")
    .populate("sticker");
};

// generate a timeline for a user
module.exports.timeline = async function ({
  author,
  lastDate,
  lastPostId,
  pageSize,
}) {
  const authorId = await User.findOne({ username: author });
  let query = { is_deleted: false, author: authorId };
  if (lastDate) {
    query.$or = [
      { createdAt: { $lt: new Date(lastDate) } },
      {
        $and: [
          { createdAt: new Date(lastDate) },
          { _id: { $lt: new mongoose.Types.ObjectId(lastPostId) } },
        ],
      },
    ];
  }

  return this.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(parseInt(pageSize))
    .populate({
      path: "media",
      populate: {
        path: "thumbnail",
      },
    })
    .populate("competition");
};

// like post
module.exports.like = async function (userId, postId) {
  const post = await this.findById(postId).populate("competition");
  if (!post) {
    throw createHttpError(404, "post not found");
  }

  if (post.competition && post.competition.status === "scheduled") {
    throw createHttpError(
      400,
      "can't like this post before the competition is started"
    );
  }

  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
    post.likes_count += 1;
    return post.save();
  } else {
    return;
  }
};

// unlike post
module.exports.unlike = async function (userId, postId) {
  const post = await this.findById(postId);
  if (!post) {
    throw createHttpError(404, "post not found");
  }

  const likeIndex = post.likes.indexOf(userId);
  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1);
    post.likes_count -= 1;
    return post.save();
  } else {
    return;
  }
};
