const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  id: { type: String },
  profileId: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  profileImg: { type: String },
  provider: {
    type: String,
    enum: ["google", "instagram", "facebook"],
    required: true,
  },
});

module.exports.userSchema = userSchema;
