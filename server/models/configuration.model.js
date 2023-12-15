const { default: mongoose } = require("mongoose");
const { configurationSchema } = require("../schemas/configuration.schema");

module.exports.Configuration = mongoose.model(
  "Configuration",
  configurationSchema
);
