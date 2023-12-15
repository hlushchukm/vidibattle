const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const configurationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports.configurationSchema = configurationSchema;
