const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    reported_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String },
    status: {
      type: String,
      enum: ["resolved", "pending", "ignored"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports.reportSchema = reportSchema;
