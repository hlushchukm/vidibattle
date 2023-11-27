const {
  Competition,
  Round,
  CompetingUser,
} = require("../models/competition.model");
const { Post } = require("../models/post.model");

module.exports.updateCompetitionStartsForToday = async () => {
  const currentDate = new Date();
  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  );

  try {
    const rounds = await Round.find({
      start_date: { $gte: startOfDay, $lt: endOfDay },
    });

    for (const round of rounds) {
      const competition = await Competition.find({
        _id: round.competition,
      });

      if (competition) {
        competition.status = "started";
        competition.current_round = round.number;
        await competition.save();
      }
    }

    if (rounds.length > 0) {
      console.log(rounds.length + " competition rounds started for today.");
    } else {
      console.log("No competition rounds start today.");
    }
  } catch (error) {
    console.error("Error starting competition rounds:", error);
  }
};

module.exports.updateCompetitionEndsForToday = async () => {
  const currentDate = new Date();
  const endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  );

  try {
    const rounds = await Round.find({
      end_date: { $lt: endOfDay },
    });

    for (const round of rounds) {
      const competition = await Competition.find({
        _id: round.competition,
      });

      if (competition) {
        if (round.is_last_round) {
          competition.status = "ended"; // update status
          competition.winners = await getCompetitionWinners(competition, round);
          await competition.save();
        } else {
          competition.status = "started";
          competition.current_round = round.number + 1;
          await competition.save();
          await advanceUsersToNextRound(competition);
        }
      }
    }

    if (rounds.length > 0) {
      console.log(rounds.length + " competition rounds ended today.");
    } else {
      console.log("No competition rounds end today.");
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
      start_date: start_date_str,
      end_date: end_date_str,
      is_paid,
      amount,
      type,
    } = data;

    const imageFile = req.file;

    if (!name || !start_date_str || !end_date_str || !type) {
      return res.status(400).json({
        message:
          "missing field. name, type, start date, and end date are required",
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

    const start_date = new Date(start_date_str);
    const end_date = new Date(end_date_str);

    if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Validate start and end dates
    if (start_date >= end_date) {
      return res
        .status(400)
        .json({ error: "End date must be greater than start date" });
    }

    const status = start_date <= new Date() ? "started" : "scheduled";

    const competitionData = {
      name,
      description,
      start_date,
      end_date,
      status,
      type,
    };

    if (is_paid) {
      competitionData.is_paid = is_paid;
      competitionData.amount = amount;
    }

    if (imageFile) {
      competitionData.image = imageFile.filename;
    }

    const newCompetition = new Competition(competitionData);
    await newCompetition.save();

    res.status(201).json({
      message: "competition created successfully",
      data: newCompetition,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.getCompetitionInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id).populate({
      path: "winning_posts",
      populate: {
        path: "author",
        select: "first_name last_name username profile_img",
      },
    });

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.status(200).json({ data: competition });
  } catch (e) {
    next(e);
  }
};

module.exports.startCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id);

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

module.exports.endCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({ message: "competition not found" });
    }

    competition.status = "ended";
    competition.winning_posts = await getCompetitionWinners(competition._id);
    await competition.save();

    return res.status(200).json({ message: "competition ended" });
  } catch (e) {
    next(e);
  }
};

const getCompetitionWinners = async (competition, round) => {
  // find posts
  const posts = await Post.find({
    competition: competition._id,
    round: round.number,
    likes_count: { $gte: round.min_likes },
    is_deleted: false,
  })
    .sort("-likes_count")
    .exec();

  if (posts.length > 0) {
    // set winner
    const maxLikes = posts[0].likes_count;
    const winners = posts
      .filter((post) => post.likes_count === maxLikes)
      .map((post) => post.author);
    return winners;
  }

  // no winner
  return [];
};

const advanceUsersToNextRound = async (competition) => {
  const competingUsers = CompetingUser.find({
    competition: competition._id,
    status: "playing",
  });

  for (const competator of competingUsers) {
    competator.current_round = competition.current_round;
    await competator.save();
  }
};

module.exports.getCompetitionsList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "scheduled" } = req.query;

    const total = await Competition.countDocuments({ status });
    const competitions = await Competition.find({ status })
      .sort({ start_date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

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

module.exports.getCompetitionPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { id } = req.params;

    const total = await Post.countDocuments({ competition: id });
    const posts = await Post.find({ competition: id, is_deleted: false })
      .populate("author", "first_name last_name profile_img username")
      .sort({ likes_count: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: posts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (e) {
    next(e);
  }
};
