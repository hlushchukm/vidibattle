const mongoose = require("mongoose");
const { userSchema } = require("../schemas/user/user.schema");

module.exports.User = mongoose.model("User", userSchema);
