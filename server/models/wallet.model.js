const { default: mongoose } = require("mongoose");
const { walletSchema } = require("../schemas/wallet.schema");

module.exports.Wallet = mongoose.model("Wallet", walletSchema);
