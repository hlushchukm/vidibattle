const { default: mongoose } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    is_admin: { type: Boolean, default: true, required: true },
    password: { type: String },
    profile_img: { type: String },
  },
  { timestamps: true }
);

adminSchema.plugin(uniqueValidator);

module.exports.adminSchema = adminSchema;
