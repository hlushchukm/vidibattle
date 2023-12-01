const createHttpError = require("http-errors");
const { User } = require("../models/user.model");
const { Wallet } = require("../models/wallet.model");

module.exports.createWallet = async (userId, balance = 0) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  const wallet = new Wallet({
    user: userId,
    balance,
  });

  return wallet.save();
};

module.exports.getWalletInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const wallet = await Wallet.findOne({ user: userId }).populate(
      "user",
      "first_name last_name username profile_img"
    );

    if (!wallet) {
      return res.status(404).json({ message: "wallet not found" });
    }

    res.status(200).json({ data: wallet });
  } catch (e) {
    next(e);
  }
};

module.exports.rechargeWallet = async (walletId, amount) => {
  const wallet = await Wallet.findById(walletId);

  if (!wallet) {
    throw createHttpError(404, "wallet not found");
  }

  wallet.balance = wallet.balance + amount;
  return wallet.save();
};
