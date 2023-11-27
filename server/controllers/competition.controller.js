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
      $and: [
        { start_date: { $gte: startOfDay, $lt: endOfDay } },
        {
          $or: [
            { "competition.status": "scheduled" },
            { "competition.status": "started" },
          ],
        },
      ],
    });

    for (const round of rounds) {
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
      $and: [
        { end_date: { $lt: endOfDay } },
        { "competition.status": "started" },
      ],
    }).populate("competition");

    for (const round of rounds) {
      if (
        round.competition &&
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
    const { name, description, is_paid, amount, type, rounds } = data;

    const imageFile = req.file;

    if (!name || !type || rounds.length === 0) {
      return res.status(400).json({
        message: "missing field. name, type, and rounds are required",
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

    const competitionData = {
      name,
      description,
      status: "scheduled",
      type,
      rounds_count: rounds.length,
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

    // create rounds
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];

      if (!round.start_date || !round.end_date) {
        return res
          .status(400)
          .json({ message: "found a round without start or end date" });
      }

      const start_date = new Date(round.start_date);
      const end_date = new Date(round.end_date);

      if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
        return res
          .status(400)
          .json({ error: "Invalid date format found in rounds" });
      }

      // Validate start and end dates
      if (start_date >= end_date) {
        return res
          .status(400)
          .json({ error: "End date must be greater than start date" });
      }

      if (start_date <= new Date()) {
        newCompetition.status = "started";
        newCompetition.current_round = round.number;
        await newCompetition.save();
      }

      const newRound = new Round({
        number: round.number || i,
        start_date,
        end_date,
        min_likes: round.min_likes,
        is_first_round: i === 0,
        is_last_round: i + 1 >= rounds.length,
        competition: newCompetition._id,
      });

      await newRound.save();
    }

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
      path: "winners",
      select: "first_name last_name username profile_img",
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
      competition.current_round = competition.current_round + 1;
      await competition.save();
      await advanceUsersToNextRound(competition);
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

    const competition = await Competition.findOne({ id });

    if (
      !competition ||
      competition.status === "ended" ||
      competition.status === "cancelled"
    ) {
      return res.status(404).json({ message: "competition not found" });
    }

    competition.status = "cancelled";
    await competition.save();

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

    for (const post of posts) {
      const competator = await CompetingUser.findOne({
        user: post.author,
        competition: competition._id,
        current_round: round.number,
        status: "playing",
      });

      if (post.likes_count < maxLikes || post.likes_count < round.min_likes) {
        competator.status = "lost";
      } else {
        winners.push(post.author);
        competator.status = "won";
      }
      await competator.save();
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

  for (const competator of competingUsers) {
    const post = await Post.findOne({
      author: competator._id,
      competition: competition._id,
      round: prevRound.number,
    });

    if (!post) {
      continue;
    }

    if (post.likes_count >= prevRound.min_likes) {
      competator.current_round = competition.current_round;
    } else {
      competator.status = "lost";
    }
    await competator.save();
  }
};

module.exports.getCompetitionsList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "scheduled" } = req.query;

    const total = await Competition.countDocuments({ status });
    const competitions = await Competition.find({ status })
      .sort({ createdAt: -1 })
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

module.exports.getCompetitorUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, round } = req.query;
    const { id } = req.params;

    const query = { competition: id };
    if (round !== undefined) {
      query.number = round;
    }

    const users = await CompetingUser.distinct("user", query)
      .populate("user", "first_name last_name profile_img username")
      .sort({ likes_count: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CompetingUser.distinct("user", query).count();

    for (const user of users) {
      const q = { competition: id, is_deleted: false };
      if (round !== undefined) {
        q.round = round;
      }

      const post = await Post.find(q).populate(
        "author",
        "first_name last_name profile_img username"
      );

      user.post = post;
    }

    res.status(200).json({
      data: users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (e) {
    next(e);
  }
};

module.exports.leaveCompetition = async (req, res, next) => {
  try {
    const { competition, user } = req.params;

    const competator = await CompetingUser.findOne({
      user,
      competition,
      status: "playing",
    });

    if (!competator) {
      return res
        .status(404)
        .json({ message: "user is not in the given competition" });
    }

    competator.status = "left";
    await competator.save();

    res.status(200).json({ message: "competition left" });
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

    const competator = await CompetingUser.findOne({
      competition,
      user,
      status: "playing",
    });

    if (!competator) {
      return res
        .status(404)
        .json({ message: "user is not in the given competition" });
    }

    competator.status = "removed";
    competator.removed_reason = reason;
    await competator.save();

    res.status(200).json({ message: "user removed from competition" });
  } catch (e) {
    next(e);
  }
};

module.exports.getRounds = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rounds = await Round.find({ competition: id }).sort({ number: 1 });

    res.status(200).json({ data: rounds });
  } catch (e) {
    next(e);
  }
};
