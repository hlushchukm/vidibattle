const { default: mongoose } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const configurationSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    value: { type: Schema.Types.Mixed, required: true },
    unit: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

configurationSchema.plugin(uniqueValidator);

module.exports.configurationSchema = configurationSchema;
