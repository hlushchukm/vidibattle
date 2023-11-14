const { default: mongoose } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const staticPageSchema = new Schema(
  {
    pagename: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

staticPageSchema.plugin(uniqueValidator);

module.exports.staticPageSchema = staticPageSchema;
