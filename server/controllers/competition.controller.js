const {
  Competition,
  Round,
  CompetingUser,
} = require("../models/competition.model");
const { Post } = require("../models/post.model");
const { Sticker } = require("../models/sticker.model");
const { User } = require("../models/user.model");
const { Wallet } = require("../models/wallet.model");
const { stringDateToUTC, dateToUTC } = require("../services/date");
const { deleteFile } = require("./media.controller");
const { deletePostsFromCompetition } = require("./post.controller");
const {
  createMultipleStickers,
  updateMultipleStickers,
} = require("./sticker.controller");
const { refundCompetitionPayment, pay } = require("./wallet.controller");

module.exports.updateCompetitionStartsForToday = async () => {
  const currentDate = new Date();
  const startOfHour = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  startOfHour.setHours(currentDate.getHours(), 0, 0, 0);
  const endOfHour = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  endOfHour.setHours(currentDate.getHours() + 1, 0, 0, 0);

  try {
    let changes = 0;

    const rounds = await Round.find({
      start_date: { $gte: startOfHour.getTime(), $lt: endOfHour.getTime() },
    }).populate("competition");

    for (const round of rounds) {
      if (
        !round.competition ||
        (round.competition?.status !== "started" &&
          round.competition?.status !== "scheduled")
      )
        continue;

      const competition = await Competition.findById(round.competition);

      if (
        competition &&
        (competition.current_round === 1 ||
          competition.current_round < round.number)
      ) {
        competition.status = "started";
        competition.current_round = round.number;
        await competition.save();

        if (!round.is_first_round) {
          const prevRound = await Round.findOne({
            competition: competition._id,
            number: round.number - 1,
          });
          if (prevRound) await advanceUsersToNextRound(competition, prevRound);
        }

        changes++;
      }
    }

    if (changes > 0) {
      console.log(changes + " competition rounds started in this hour.");
    } else {
      console.log("No competition rounds start this hour.");
    }
  } catch (error) {
    console.error("Error starting competition rounds:", error);
  }
};

module.exports.updateCompetitionEndsForToday = async () => {
  const currentDate = new Date();
  const startOfHour = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  startOfHour.setHours(currentDate.getHours(), 0, 0, 0);

  try {
    const rounds = await Round.find({
      end_date: { $lte: startOfHour.getTime() },
    }).populate("competition");

    let changes = 0;

    for (const round of rounds) {
      if (
        round.competition &&
        round.competition.status === "started" &&
        round.competition.current_round === round.number
      ) {
        const competition = await Competition.findById(round.competition._id);

        if (!competition) continue;

        if (round.is_last_round) {
          const winners = await getCompetitionWinners(competition, round);
          competition.status = "ended"; // update status
          competition.winners = winners;
          await competition.save();
        } else {
          competition.status = "started";
          competition.current_round = round.number + 1;
          await competition.save();
          await advanceUsersToNextRound(competition, round);
        }

        changes++;
      }
    }

    if (changes > 0) {
      console.log(changes + " competition rounds ended this hour.");
    } else {
      console.log("No competition rounds end this hour.");
    }
  } catch (error) {
    console.error("Error ending competition rounds:", error);
  }
};

module.exports.createCompetition = async (req, res, next) => {
  try {
    const { data: strData } = req.body;
    const data = JSON.parse(strData);
    const {
      name,
      description,
      is_paid,
      amount,
      type,
      result_date,
      has_sticker,
      rounds,
      stickers = [],
    } = data;

    const {
      image = [],
      image_long = [],
      stickers: stickerImages = [],
    } = req.files;

    if (!name || !type || rounds.length === 0 || !result_date) {
      return res.status(400).json({
        message:
          "missing field. name, type, result date and rounds are required",
      });
    }

    if (is_paid && !amount) {
      return res
        .status(400)
        .json({ message: "payment amount is needed for paid competitions" });
    }

    if (type !== "video" && type !== "image" && type !== "any") {
      return res
        .status(400)
        .json({ message: "invalid competition type given" });
    }

    const UTCResultDate = dateToUTC(result_date);
    const competitionData = {
      name,
      description,
      status: "scheduled",
      type,
      current_round: 1,
      rounds_count: rounds.length,
      result_date: UTCResultDate,
      has_sticker,
    };

    if (is_paid) {
      competitionData.is_paid = is_paid;
      competitionData.amount = amount;
    }

    if (image[0]) {
      competitionData.image = image[0].filename;
    }

    if (image_long[0]) {
      competitionData.image_long = image_long[0].filename;
    }

    const newCompetition = new Competition(competitionData);

    // create rounds
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];

      if (!round.start_date || !round.end_date) {
        return res
          .status(400)
          .json({ message: "found a round without start or end date" });
      }

      if (!round.percentage_to_advance && i < rounds.length - 1) {
        return res.status(400).json({
          message: "found a round without a percentage value to advance users",
        });
      }

      let start_date = null;
      let end_date = null;
      try {
        start_date = dateToUTC(round.start_date);
        end_date = dateToUTC(round.end_date);

        if (!start_date || !end_date) {
          return res
            .status(400)
            .json({ message: "Invalid date format found in rounds." });
        }

        // Validate start and end dates
        if (start_date > end_date) {
          return res
            .status(400)
            .json({ message: "End date must be greater than start date" });
        }
      } catch (e) {
        console.log(e);
        return res
          .status(400)
          .json({ message: "Invalid date format found in rounds" });
      }

      const newRound = new Round({
        name: round.name,
        number: i + 1,
        start_date,
        end_date,
        min_likes: round.min_likes,
        percentage_to_advance: round.percentage_to_advance,
        is_first_round: i === 0,
        is_last_round: i + 1 >= rounds.length,
        competition: newCompetition._id,
      });

      await newRound.save();

      if (newRound.is_first_round) {
        newCompetition.start_date = newRound.start_date;
      }

      if (newRound.is_last_round) {
        newCompetition.end_date = newRound.end_date;
      }

      let today = dateToUTC(new Date());
      if (start_date <= today) {
        newCompetition.status = "started";
        newCompetition.current_round = i + 1;
      }
    }

    const competitionMatches = await Competition.find({
      name: newCompetition.name,
      start_date: newCompetition.start_date,
      end_date: newCompetition.end_date,
    });

    if (competitionMatches.length > 0) {
      return res.status(400).json({
        message:
          "a competition with the same name, start date and end date found",
      });
    }

    await newCompetition.save();

    if (newCompetition.has_sticker) {
      await createMultipleStickers(stickers, stickerImages, newCompetition._id);
    }

    res.status(201).json({
      message: "competition created successfully",
      data: newCompetition,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.editCompetition = async (req, res, next) => {
  try {
    const { data: strData } = req.body;
    const data = JSON.parse(strData);
    const {
      _id,
      name,
      description,
      is_paid,
      amount,
      type,
      result_date,
      rounds,
      has_sticker,
      stickers = [],
    } = data;

    const {
      image = [],
      image_long = [],
      stickers: stickerImages = [],
    } = req.files;

    const oldCompetition = await Competition.findOne({
      _id,
      status: { $in: ["started", "scheduled"] },
    });

    if (!oldCompetition) {
      return res.status(404).json({ message: "competition not found" });
    }

    if (!name || !type || rounds.length === 0 || !result_date) {
      return res.status(400).json({
        message:
          "missing field. name, type, result date and rounds are required",
      });
    }

    if (is_paid && !amount) {
      return res
        .status(400)
        .json({ message: "payment amount is needed for paid competitions" });
    }

    if (type !== "video" && type !== "image" && type !== "any") {
      return res
        .status(400)
        .json({ message: "invalid competition type given" });
    }

    const UTCResultDate = dateToUTC(result_date);
    const competitionData = {
      name,
      description,
      type,
      rounds_count: rounds.length,
      result_date: UTCResultDate,
      has_sticker,
    };

    if (is_paid) {
      competitionData.is_paid = is_paid;
      competitionData.amount = amount;
    } else {
      competitionData.is_paid = false;
      competitionData.amount = 0;
    }

    // set image and delete the old one
    if (image.length > 0) {
      competitionData.image = image[0].filename;
      if (oldCompetition.image) {
        await deleteFile(oldCompetition.image);
      }
    }
    if (image_long.length > 0) {
      competitionData.image_long = image_long[0].filename;
      if (oldCompetition.image_long) {
        await deleteFile(oldCompetition.image_long);
      }
    }

    // rounds to delete
    const roundsDifference = rounds.length - oldCompetition.rounds_count;
    if (roundsDifference < 0) {
      await Round.deleteMany({
        number: { $gt: rounds.length },
        competition: oldCompetition._id,
      });
    }

    // update competition fields
    for (const key in competitionData) {
      oldCompetition[key] = competitionData[key];
    }

    // create rounds
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];

      if (!round.start_date || !round.end_date) {
        return res
          .status(400)
          .json({ message: "found a round without start or end date" });
      }

      if (!round.percentage_to_advance && i < rounds.length - 1) {
        return res.status(400).json({
          message: "found a round without a percentage value to advance users",
        });
      }

      let start_date = null;
      let end_date = null;

      try {
        start_date = dateToUTC(round.start_date);
        end_date = dateToUTC(round.end_date);

        if (!start_date || !end_date) {
          return res
            .status(400)
            .json({ message: "Invalid date format found in rounds" });
        }

        // Validate start and end dates
        if (start_date > end_date) {
          return res
            .status(400)
            .json({ message: "End date must be greater than start date" });
        }
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Invalid date format found in rounds" });
      }

      const roundData = {
        name: round.name,
        number: i + 1,
        start_date,
        end_date,
        min_likes: round.min_likes,
        percentage_to_advance: round.percentage_to_advance,
        is_first_round: i === 0,
        is_last_round: i + 1 >= rounds.length,
      };
      let editedRound = null;

      if (round._id) {
        // edit existing round
        editedRound = await Round.findById(round._id);

        for (const key in roundData) {
          editedRound[key] = roundData[key];
        }
      } else {
        // create a new round
        editedRound = new Round({
          ...roundData,
          competition: oldCompetition._id,
        });
      }
      await editedRound.save();

      if (editedRound.is_first_round) {
        oldCompetition.start_date = editedRound.start_date;
      } else if (editedRound.is_last_round) {
        oldCompetition.end_date = editedRound.end_date;
      }

      let today = dateToUTC(new Date());
      if (start_date <= today) {
        oldCompetition.status = "started";
        oldCompetition.current_round = i + 1;
      }
    }

    const competitionMatches = await Competition.find({
      name: oldCompetition.name,
      _id: { $ne: oldCompetition._id },
      start_date: oldCompetition.start_date,
      end_date: oldCompetition.end_date,
    });

    if (competitionMatches.length > 0) {
      return res.status(400).json({
        message:
          "a competition with the same name, start date and end date found",
      });
    }

    await oldCompetition.save();

    if (oldCompetition.has_sticker) {
      const newStickers = [];
      const editStickers = [];
      for (const sticker of stickers) {
        if (sticker._id) {
          editStickers.push(sticker);
        } else {
          newStickers.push(sticker);
        }
      }

      if (editStickers.length > 0)
        await updateMultipleStickers(editStickers, stickerImages);

      if (newStickers.length > 0)
        await createMultipleStickers(
          newStickers,
          stickerImages,
          oldCompetition._id
        );
    }

    res.status(201).json({
      message: "competition updated successfully",
      data: oldCompetition,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.getCompetitionInfo = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { start_date, end_date } = req.query;

    const query = { name };
    if (start_date) query.start_date = start_date;
    if (end_date) query.end_date = end_date;

    let competition = await Competition.findOne(query).populate(
      "winners",
      "first_name last_name username profile_img"
    );

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    if (!req.user?.is_admin) {
      competition = competition.toObject();
      const user = req.user?._id;

      // get competing user info
      if (user) {
        const competitor = await CompetingUser.findOne({
          competition: competition._id,
          user,
        });

        competition.competingUser = competitor;
      }

      // get rounds
      const rounds = await Round.find({ competition: competition._id });
      competition.rounds = rounds;

      // determine if the user has posted anything in the current round
      const post = await Post.findOne({
        competition: competition._id,
        round: competition.current_round,
        is_deleted: false,
        author: user,
      });

      competition.post = post;
    }

    res.status(200).json({ data: competition });
  } catch (e) {
    next(e);
  }
};

module.exports.getCompetitionInfoForEdit = async (req, res, next) => {
  try {
    const { id } = req.params;

    let competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // get rounds
    const rounds = await Round.find({ competition: competition._id }).sort(
      "number"
    );

    const competitionData = competition.toObject();
    competitionData.rounds = rounds;

    // get stickers
    if (competition.has_sticker) {
      const stickers = await Sticker.find({ competition: competition._id });
      competitionData.stickers = stickers;
    }

    res.status(200).json({ data: competitionData });
  } catch (e) {
    next(e);
  }
};

module.exports.startCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findOne({
      _id: id,
      status: "scheduled",
    });

    if (!competition) {
      return res.status(404).json({ message: "competition not found" });
    }

    competition.status = "started";
    await competition.save();

    return res.status(200).json({ message: "competition started" });
  } catch (e) {
    next(e);
  }
};

module.exports.advanceCompetitionRound = async (req, res, next) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findOne({
      _id: id,
      status: "started",
    });

    if (!competition) {
      return res.status(404).json({ message: "competition not found" });
    }

    const round = await Round.findOne({
      number: competition.current_round,
      competition: competition._id,
    });

    if (!round) {
      return res.status(404).json({ message: "current round not found" });
    }

    if (round.is_last_round) {
      const winners = await getCompetitionWinners(competition, round);
      competition.status = "ended";
      competition.winners = winners;
      await competition.save();
    } else {
      const prevRound = await Round.findOne({
        competition: competition.id,
        number: competition.current_round,
      });
      competition.current_round = competition.current_round + 1;
      await competition.save();
      await advanceUsersToNextRound(competition, prevRound);
    }

    return res.status(200).json({ message: "competition started" });
  } catch (e) {
    next(e);
  }
};

module.exports.showCompetitionResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { result_date } = req.body;

    const competition = await Competition.findOne({
      _id: id,
      status: "ended",
    });

    if (!competition) {
      return res.status(404).json({ message: "competition not found" });
    }

    competition.result_date = stringDateToUTC(result_date);
    await competition.save();

    return res.status(200).json({ message: "competition result date updated" });
  } catch (e) {
    next(e);
  }
};

module.exports.endCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findOne({
      _id: id,
      status: "started",
    });

    if (!competition) {
      return res.status(404).json({ message: "competition not found" });
    }

    competition.status = "ended";
    competition.winners = await getCompetitionWinners(
      competition._id,
      competition.current_round
    );
    await competition.save();

    return res.status(200).json({ message: "competition ended" });
  } catch (e) {
    next(e);
  }
};

module.exports.cancelCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findOne({ _id: id });

    if (
      !competition ||
      competition.status === "ended" ||
      competition.status === "cancelled"
    ) {
      return res.status(404).json({ message: "competition not found" });
    }

    if (competition.is_paid && competition.amount > 0) {
      const competitors = await CompetingUser.find({ competition });
      for (const competitor of competitors) {
        await refundCompetitionPayment(competition.amount, competitor.user);
        competitor.paid_amount = competitor.paid_amount - competition.amount;
        await competitor.save();
      }
    }
    competition.status = "cancelled";
    await competition.save();

    const competitors = await CompetingUser.find({ competition: id });
    for (const competitor of competitors) {
      deletePostsFromCompetition(
        id,
        competitor.user,
        competition.current_round + 1
      );
    }

    return res.status(200).json({ message: "competition cancelled" });
  } catch (e) {
    next(e);
  }
};

const getCompetitionWinners = async (competition, round) => {
  // find posts
  const posts = await Post.find({
    competition: competition._id,
    round: round.number,
    is_deleted: false,
  })
    .sort("-likes_count")
    .exec();

  const winners = [];

  if (posts.length > 0) {
    // set winner
    const maxLikes = posts[0].likes_count;
    let rank = 0;
    let last_like = -1;

    for (const post of posts) {
      const competitor = await CompetingUser.findOne({
        user: post.author,
        competition: competition._id,
        current_round: round.number,
        status: "playing",
      });

      if (!competitor) {
        continue;
      }

      if (post.likes_count < maxLikes || post.likes_count === 0) {
        competitor.status = "lost";
        last_like !== post.likes_count ? rank++ : null;
        competitor.rank = rank;
        last_like = post.likes_count;
      } else {
        winners.push(post.author);
        competitor.status = "won";
        last_like !== post.likes_count ? rank++ : null;
        competitor.rank = rank;
        last_like = post.likes_count;
      }
      await competitor.save();
    }
  }

  return winners;
};

const advanceUsersToNextRound = async (competition, prevRound) => {
  const competingUsers = await CompetingUser.find({
    competition: competition._id,
    status: "playing",
    current_round: prevRound.number,
  });

  const lostCompetitorsAndPosts = [];
  const advancedCompetitors = [];

  for (const competitor of competingUsers) {
    const post = await Post.findOne({
      author: competitor.user?._id,
      competition: competition._id,
      round: prevRound.number,
    });

    if (!post) {
      competitor.status = "lost";
      await competitor.save();
      deletePostsFromCompetition(
        competition._id,
        competitor.user?._id,
        competition.current_round
      );
      continue;
    }

    if (post.likes_count >= prevRound.min_likes) {
      competitor.current_round = competition.current_round;
      advancedCompetitors.push(competitor);
    } else {
      lostCompetitorsAndPosts.push({ competitor, post });
      competitor.status = "lost";
    }
    await competitor.save();
  }

  if (advancedCompetitors.length === 0 && lostCompetitorsAndPosts.length > 0) {
    // if no user got the sufficient number of likes to advance, then advance those users who got the most likes based on the percentage specified on the round
    this.advanceUsersBasedOnPercentage(
      lostCompetitorsAndPosts,
      competition,
      prevRound
    );
  } else {
    for (const { competitor } of lostCompetitorsAndPosts) {
      deletePostsFromCompetition(
        competition._id,
        competitor.user?._id,
        competition.current_round
      );
      await competitor.save();
    }
  }
};

module.exports.advanceUsersBasedOnPercentage = async (
  competitors_posts, // {post: {}, competitor: {}}
  competition,
  round
) => {
  competitors_posts = competitors_posts.sort(
    (a, b) => b.post.likes_count - a.post.likes_count
  );

  const percentage = round?.percentage_to_advance;
  if (!percentage) {
    // if no percentage is given, every competitor will fail
    for (const { competitor } of competitors_posts) {
      deletePostsFromCompetition(
        competition._id,
        competitor.user?._id,
        competition.current_round
      );
      competitor.status = "lost";
      await competitor.save();
    }
    return;
  }

  const noOfUsersToAdvance = this.getNumberOfUsersToAdvance(
    percentage,
    competition.rounds_count
  );

  let advancedUsers = 0;
  let i = 0;
  while (
    advancedUsers < noOfUsersToAdvance &&
    competitors_posts.length > 0 &&
    i < competitors_posts.length
  ) {
    /** if the number of people with the same likes count exceeds the number of allowed users to advance,
     * we still need to advance all of them in order to not discriminate */
    let competitor = competitors_posts[i]?.competitor;
    let post = competitors_posts[i]?.post;
    const postLikesCount = post?.likes_count;
    do {
      if (!competitor) {
        i++;
        competitor = competitors_posts[i]?.competitor;
        post = competitors_posts[i]?.post;
        continue;
      }

      if (!post) {
        competitor.status = "lost";
        await competitor.save();
        deletePostsFromCompetition(
          competition._id,
          competitor.user?._id,
          competition.current_round
        );
        i++;
        competitor = competitors_posts[i]?.competitor;
        post = competitors_posts[i]?.post;
        continue;
      }

      competitor.status = "playing";
      competitor.current_round = competition.current_round;
      await competitor.save();
      advancedUsers++;
      i++;

      competitor = competitors_posts[i]?.competitor;
      post = competitors_posts[i]?.post;
    } while (
      post?.likes_count === postLikesCount &&
      i < competitors_posts.length
    );
  }

  // delete the posts of the users who didn't advance
  while (i < competitors_posts.length) {
    deletePostsFromCompetition(
      competition._id,
      competitors_posts[i]?.competitor?.user?._id,
      competition.current_round
    );
    i++;
  }
};

module.exports.getNumberOfUsersToAdvance = (percentage, rounds_count) => {
  percentage = percentage / 100;
  const noOfUsers = Math.ceil(rounds_count * percentage);
  return noOfUsers;
};

module.exports.getCompetitionsList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "scheduled" } = req.query;

    const total = await Competition.countDocuments({ status });
    let competitions = await Competition.find({ status })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!req.user?.is_admin) {
      const user = req.user?._id;

      if (user) {
        for (let i = 0; i < competitions.length; i++) {
          competitions[i] = competitions[i].toObject();
          const competitor = await CompetingUser.findOne({
            competition: competitions[i]._id,
            user,
          });

          competitions[i].competingUser = competitor;
        }
      }
    }

    res.status(200).json({
      data: competitions,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.getCompetitorUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, round = 1 } = req.query;
    const { id } = req.params;

    const query = {
      competition: id,
      $or: [
        { current_round: { $gte: round } },
        { $and: [{ status: "playing" }, { current_round: { $lte: round } }] },
      ],
    };

    const total = await CompetingUser.find(query).count();

    let competitors = await CompetingUser.find(query)
      .populate("competition")
      .populate("user", "first_name last_name profile_img username")
      .sort({ likes_count: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const competitorsList = [];
    for (const competitor of competitors) {
      const competitorCopy = competitor.toObject();

      const q = {
        competition: id,
        round: { $gte: round },
        author: competitorCopy.user?._id,
        is_deleted: false,
      };

      const post = await Post.findOne(q, "likes_count");

      if (post) {
        competitorCopy.post = post;
      }
      competitorsList.push(competitorCopy);
    }

    res.status(200).json({
      data: competitorsList,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (e) {
    next(e);
  }
};

module.exports.joinCompetition = async (req, res, next) => {
  try {
    const { competition } = req.params;
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else if (!user.is_complete) {
      return res.status(400).json({ message: "user account not complete" });
    }

    const selectedCompetition = await Competition.findById(competition);

    if (!selectedCompetition) {
      return res.status(404).json({ message: "competition not found" });
    } else if (selectedCompetition.status !== "scheduled") {
      return res.status(400).json({ message: "can't join this competition" });
    }

    const existingCompetitor = await CompetingUser.findOne({
      user: _id,
      competition,
    });

    let competitor;

    if (existingCompetitor) {
      if (existingCompetitor.status === "left") {
        existingCompetitor.status = "playing";
        await existingCompetitor.save();
        competitor = existingCompetitor;
      } else {
        return res.status(400).join({ message: "competition join failed" });
      }
    } else {
      competitor = new CompetingUser({
        user: user._id,
        competition: selectedCompetition._id,
        current_round: selectedCompetition.current_round,
        status: "playing",
      });
    }

    await competitor.save();

    // handle payment
    if (
      selectedCompetition.is_paid &&
      (!competitor.paid_amount ||
        competitor.paid_amount < selectedCompetition.amount)
    ) {
      let paymentAmount = selectedCompetition.amount;
      if (competitor.paid_amount) {
        paymentAmount = paymentAmount - competitor.paid_amount;
      }

      await pay(user._id, paymentAmount);

      competitor.paid_amount = selectedCompetition.amount;
      await competitor.save();
    }

    res.status(200).json({ message: "competition joined", data: competitor });
  } catch (e) {
    next(e);
  }
};

module.exports.leaveCompetition = async (req, res, next) => {
  try {
    const { competition: competitionId } = req.params;
    const { _id } = req.user;

    const competitor = await CompetingUser.findOne({
      user: _id,
      competition: competitionId,
      status: "playing",
    });

    if (!competitor) {
      return res
        .status(404)
        .json({ message: "user is not in the given competition" });
    }

    let has_refund = false;
    const competition = await Competition.findById(competitionId);
    if (
      competition &&
      competition.is_paid &&
      competition.status === "scheduled"
    ) {
      await refundCompetitionPayment(competition.amount, _id);
      competitor.paid_amount = competitor.paid_amount - competition.amount;
      has_refund = true;
    }

    competitor.status = "left";
    await competitor.save();

    deletePostsFromCompetition(competitionId, _id, competitor.current_round);

    res.status(200).json({
      message: has_refund
        ? "competition left, money refunded to wallet"
        : "competition left",
      data: competitor,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.removeFromCompetition = async (req, res, next) => {
  try {
    const { competition, user } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "reason field is required" });
    }

    const competitor = await CompetingUser.findOne({
      competition,
      user,
      status: "playing",
    });

    if (!competitor) {
      return res
        .status(404)
        .json({ message: "user is not in the given competition" });
    }

    competitor.status = "removed";
    competitor.removed_reason = reason;
    await competitor.save();

    deletePostsFromCompetition(competition, user, competitor.current_round);

    res.status(200).json({ message: "user removed from competition" });
  } catch (e) {
    next(e);
  }
};

module.exports.getRounds = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rounds = await Round.find({ competition: id })
      .populate("competition")
      .sort({ number: 1 });

    res.status(200).json({ data: rounds });
  } catch (e) {
    next(e);
  }
};

module.exports.getTopParticipants = async (req, res, next) => {
  try {
    const { competition, round } = req.params;

    const top3 = await CompetingUser.find({
      competition,
      current_round: round,
      status: { $nin: ["left", "removed", "lost"] },
      rank: { $gte: 1, $lte: 3 },
    })
      .populate("user", "first_name last_name username profile_img")
      .sort("rank");

    const top10 = await CompetingUser.find({
      competition,
      current_round: round,
      status: { $nin: ["left", "removed", "won"] },
      rank: { $gte: 1, $lte: 10 },
    })
      .populate("user", "first_name last_name username profile_img")
      .sort("rank")
      .limit(10);

    res.status(200).json({ top3: top3, top10: top10 });
  } catch (e) {
    next(e);
  }
};

module.exports.searchCompetition = async (req, res, next) => {
  try {
    const { text, page = 1, limit = 10 } = req.query;

    const regex = new RegExp(text, "i");

    const query = { name: { $regex: regex } };

    const total = await Competition.countDocuments(query);
    let competitions = await Competition.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!req.user?.is_admin) {
      const user = req.user?._id;

      if (user) {
        // if the searching user has joined/left a competition, add that info to the response
        for (let i = 0; i < competitions.length; i++) {
          competitions[i] = competitions[i].toObject();
          const competitor = await CompetingUser.findOne({
            competition: competitions[i]._id,
            user,
          });

          competitions[i].competingUser = competitor;
        }
      }
    }

    res.status(200).json({
      data: competitions,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    });
  } catch (e) {
    next(e);
  }
};
