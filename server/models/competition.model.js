const { default: mongoose } = require("mongoose");
const { competitionSchema } = require("../schemas/competition.schema");

module.exports.Competition = mongoose.model("Competition", competitionSchema);
