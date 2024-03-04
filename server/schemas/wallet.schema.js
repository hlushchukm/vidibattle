const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const walletSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isOwner: { type: Boolean, default: false },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports.walletSchema = walletSchema;
