const { Competition } = require("../models/competition.model");
const { User } = require("../models/user.model");
const { Wallet } = require("../models/wallet.model");

module.exports.dashboardAPI = async (req, res, next) => {
  try {
    const query = req.query;

    const response = {};

    if (query.usersCount) {
      response.usersCount = (await usersCount()) ?? 0;
    }

    if (query.competitionsCount) {
      response.competitionsCount = (await competitionsCount()) ?? 0;
    }

    if (query.totalRevenue) {
      response.totalRevenue = (await totalRevenue()) ?? 0;
    }

    if (query.last5Competitios) {
      response.last5Competitios = await last_x_competitions(5);
    }

    if (query.top50Users) {
      response.top50Users = await top_x_users(50);
    }

    return res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
};

const usersCount = async () => {
  return await User.count({});
};

const competitionsCount = async () => {
  return Competition.count({});
};

const totalRevenue = async () => {
  const owner = await Wallet.findOne({ isOwner: true });
  return owner ? owner.balance ?? 0 : 0;
};

const last_x_competitions = async (limit = 5) => {
  const scheduled = await Competition.find({ status: "scheduled" })
    .sort({ updatedAt: -1 })
    .limit(limit);

  const started = await Competition.find({ status: "started" })
    .sort({ updatedAt: -1 })
    .limit(limit);

  const ended = await Competition.find({ status: "ended" })
    .sort({ updatedAt: -1 })
    .limit(limit);

  const cancelled = await Competition.find({ status: "cancelled" })
    .sort({ updatedAt: -1 })
    .limit(limit);

  return { scheduled, started, ended, cancelled };
};

const top_x_users = async (limit = 50) => {
  return User.find(
    { status: { $ne: "deleted" } },
    "first_name last_name username profile_img followers_count posts_count"
  )
    .sort({ followers_count: -1 })
    .limit(limit);
};
