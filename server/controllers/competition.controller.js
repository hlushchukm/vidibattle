const {
  Competition,
  Round,
  CompetingUser,
} = require("../models/competition.model");
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { Wallet } = require("../models/wallet.model");

module.exports.updateCompetitionStartsForToday = async () => {
  const currentDate = new Date();
  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  );
  endOfDay.setHours(0, 0, 0, 0);

  try {
    let changes = 0;

    const rounds = await Round.find({
      start_date: { $gte: startOfDay, $lt: endOfDay },
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
      console.log(changes + " competition rounds started for today.");
    } else {
      console.log("No competition rounds start today.");
    }
  } catch (error) {
    console.error("Error starting competition rounds:", error);
  }
};

module.exports.updateCompetitionEndsForToday = async () => {
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
  endOfDay.setHours(0, 0, 0, 0);

  try {
    const rounds = await Round.find({ end_date: { $lt: startOfDay } }).populate(
      "competition"
    );

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
      console.log(changes + " competition rounds ended today.");
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
    const { name, description, is_paid, amount, type, result_date, rounds } =
      data;

    const imageFile = req.file;

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

    const competitionData = {
      name,
      description,
      status: "scheduled",
      type,
      current_round: 1,
      rounds_count: rounds.length,
      result_date,
    };

    if (is_paid) {
      competitionData.is_paid = is_paid;
      competitionData.amount = amount;
    }

    if (imageFile) {
      competitionData.image = imageFile.filename;
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

      const start_date = new Date(round.start_date);
      start_date.setHours(0, 0, 0, 0);
      const end_date = new Date(round.end_date);
      end_date.setHours(0, 0, 0, 0);

      if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
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

      const newRound = new Round({
        name: round.name,
        number: i + 1,
        start_date,
        end_date,
        min_likes: round.min_likes,
        is_first_round: i === 0,
        is_last_round: i + 1 >= rounds.length,
        competition: newCompetition._id,
      });

      await newRound.save();

      if (newRound.is_first_round) {
        newCompetition.start_date = newRound.start_date;
      } else if (newRound.is_last_round) {
        newCompetition.end_date = newRound.end_date;
      }

      if (start_date <= new Date().setHours(0, 0, 0, 0)) {
        newCompetition.status = "started";
        newCompetition.current_round = i + 1;
      }
    }

    const competitionMatches = await Competition.find({
      name: newCompetition.name,
    });

    const start_date_str = new Date(
      newCompetition.start_date
    ).toLocaleDateString();
    const end_date_str = new Date(newCompetition.end_date).toLocaleDateString();

    for (const match of competitionMatches) {
      if (
        match.start_date?.toLocaleDateString()?.includes(start_date_str) &&
        match.end_date?.toLocaleDateString(end_date_str)?.includes()
      ) {
        return res.status(400).json({
          message:
            "a competition with the same name, start date and end date found",
        });
      }
    }

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
    const { name } = req.params;
    const { start_date, end_date } = req.query;

    let competitions = await Competition.find({ name }).populate(
      "winners",
      "first_name last_name username profile_img"
    );
    let competition = null;

    for (const c of competitions) {
      if (
        c.start_date?.toLocaleDateString()?.includes(start_date) &&
        c.end_date?.toLocaleDateString()?.includes(end_date)
      ) {
        competition = c;
        break;
      }
    }

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
    let rank = 0;
    let last_like = -1;

    for (const post of posts) {
      const competitor = await CompetingUser.findOne({
        user: post.author,
        competition: competition._id,
        current_round: round.number,
        status: "playing",
      });

      if (post.likes_count < maxLikes || post.likes_count < round.min_likes) {
        competitor.status = "lost";

        if (post.likes_count >= round.min_likes) {
          last_like !== post.likes_count ? rank++ : null;
          competitor.rank = rank;
          last_like = post.likes_count;
        }
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

  for (const competitor of competingUsers) {
    const post = await Post.findOne({
      author: competitor.user?._id,
      competition: competition._id,
      round: prevRound.number,
    });

    if (!post) {
      competitor.status = "lost";
      await competitor.save();
      continue;
    }

    if (post.likes_count >= prevRound.min_likes) {
      competitor.current_round = competition.current_round;
    } else {
      competitor.status = "lost";
    }
    await competitor.save();
  }
};

module.exports.getCompetitionsList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "scheduled" } = req.query;

    const total = await Competition.countDocuments({ status });
    let competitions = await Competition.find({ status })
      .sort({ createdAt: -1 })
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

    const query = { competition: id, current_round: { $gte: round } };

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
        round: round,
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
    const { payment } = req.body;

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
      if (payment === undefined || payment < selectedCompetition.amount) {
        return res.status(400).json({ message: "payment not sufficient" });
      }

      let paymentAmount = selectedCompetition.amount;
      if (competitor.paid_amount) {
        paymentAmount = paymentAmount - competitor.paid_amount;
      }

      const wallet = await Wallet.findOne({ user: user._id });

      if (!wallet) {
        return res.status(404).json({ message: "wallet not found" });
      } else if (wallet.balance < paymentAmount) {
        return res.status(400).json({ message: "insufficient wallet balance" });
      }

      wallet.balance = wallet.balance - paymentAmount;
      await wallet.save();

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
    const { competition } = req.params;
    const { _id } = req.user;

    const competitor = await CompetingUser.findOne({
      user: _id,
      competition,
      status: "playing",
    });

    if (!competitor) {
      return res
        .status(404)
        .json({ message: "user is not in the given competition" });
    }

    competitor.status = "left";
    await competitor.save();

    res.status(200).json({ message: "competition left", data: competitor });
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
      status: { $nin: ["left", "removed"] },
      rank: { $gte: 1, $lte: 3 },
    })
      .populate("user", "first_name last_name username profile_img")
      .sort("rank");

    const top10 = await CompetingUser.find({
      competition,
      current_round: round,
      status: { $nin: ["left", "removed"] },
      rank: { $gte: 4, $lte: 10 },
    })
      .populate("user", "first_name last_name username profile_img")
      .sort("rank")
      .limit(10);

    const top3List = [];
    for (const competitor of top3) {
      const item = competitor.toObject();
      const post = await Post.findOne(
        {
          competition,
          round,
          author: competitor.user._id,
          is_deleted: false,
        },
        "likes_count"
      );

      if (post) {
        item.likes = post.likes_count;
      }

      top3List.push(item);
    }

    const top10List = [];
    for (const competitor of top10) {
      const item = competitor.toObject();
      const post = await Post.findOne(
        {
          competition,
          round,
          author: competitor.user._id,
          is_deleted: false,
        },
        "likes_count"
      );

      if (post) {
        item.likes = post.likes_count;
      }

      top10List.push(item);
    }

    res.status(200).json({ top3: top3List, top10: top10List });
  } catch (e) {
    next(e);
  }
};
