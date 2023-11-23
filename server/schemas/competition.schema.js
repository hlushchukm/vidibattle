const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const competitionSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "started", "ended"],
      default: "scheduled",
    },
    winning_posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    is_paid: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports.competitionSchema = competitionSchema;
