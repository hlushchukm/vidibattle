const createHttpError = require("http-errors");
const { User } = require("../models/user.model");
const { Wallet } = require("../models/wallet.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");

module.exports.createWallet = async (userId, balance = 0) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  const wallet = new Wallet({
    user: userId,
    balance,
  });

  await wallet.save();
  return wallet.populate(
    "user",
    "first_name last_name username profile_img email contact_no"
  );
};

module.exports.updateBalance = async (userId, balance) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  let wallet = await Wallet.findOne({ user: userId }).populate(
    "user",
    "first_name last_name username profile_img email contact_no"
  );

  if (!wallet) {
    wallet = await this.createWallet(userId);
  }

  wallet.balance = wallet.balance + balance;

  await wallet.save();

  return wallet;
};

module.exports.pay = async (userId, amount) => {
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw createHttpError(404, "wallet not found");
  } else if (wallet.balance < amount) {
    throw createHttpError(400, "insufficient wallet balance");
  }

  let owner = await Wallet.findOne({ isOwner: true });
  if (!owner) {
    owner = new Wallet({ isOwner: true, balance: 0 });
    await owner.save();
  }

  wallet.balance = wallet.balance - amount;
  owner.balance = owner.balance + amount;

  await wallet.save();
  await owner.save();

  return true;
};

module.exports.refundCompetitionPayment = async (amount, userId) => {
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw createHttpError(404, "wallet not found");
  }

  let owner = await Wallet.findOne({ isOwner: true });
  if (!owner) {
    owner = new Wallet({ isOwner: true, balance: 0 });
    await owner.save();
  }

  wallet.balance = wallet.balance + amount;
  owner.balance = owner.balance - amount;

  await wallet.save();
  await owner.save();

  return wallet;
};

module.exports.getWalletInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const wallet = await Wallet.findOne({ user: userId }).populate(
      "user",
      "first_name last_name username profile_img email contact_no"
    );

    if (!wallet) {
      return res.status(404).json({ message: "wallet not found" });
    }

    res.status(200).json({ data: wallet });
  } catch (e) {
    next(e);
  }
};

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log("Order error", error);
        return res.status(500).json({ message: "error while creating order!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (e) {
    next(e);
  }
};

module.exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      userId,
    } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const resultSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature == resultSign) {
      const wallet = await this.updateBalance(userId, amount);
      return res
        .status(200)
        .json({ message: "Payment verified successfully", data: wallet });
    }
  } catch (e) {
    next(e);
  }
};
