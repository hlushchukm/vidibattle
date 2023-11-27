const { default: mongoose } = require("mongoose");
const {
  competitionSchema,
  roundSchema,
  competingUserSchema,
} = require("../schemas/competition.schema");

module.exports.Competition = mongoose.model("Competition", competitionSchema);
module.exports.Round = mongoose.model("Round", roundSchema);
module.exports.CompetingUser = mongoose.model(
  "CompetingUser",
  competingUserSchema
);
