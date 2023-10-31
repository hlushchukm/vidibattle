const { default: mongoose } = require("mongoose");
const { reportSchema } = require("../schemas/report.schema");

module.exports.Report = mongoose.model("Report", reportSchema);
