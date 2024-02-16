const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const competitionSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "started", "ended", "cancelled"],
      default: "scheduled",
    },
    type: { type: String, enum: ["video", "image", "any"], default: "any" },
    winners: [{ type: Schema.Types.ObjectId, ref: "User" }],
    is_paid: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    image: { type: String },
    image_long: { type: String },
    current_round: { type: Number, required: true, default: 1 },
    rounds_count: { type: Number, required: true, default: 0 },
    start_date: { type: Number },
    end_date: { type: Number },
    result_date: { type: Number, required: true },
    has_sticker: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const roundSchema = Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true },
    start_date: { type: Number, required: true },
    end_date: { type: Number, required: true },
    min_likes: { type: Number, required: true, default: 0 },
    percentage_to_advance: { type: Number },
    is_first_round: { type: Boolean, default: false },
    is_last_round: { type: Boolean, default: false },
    competition: { type: Schema.Types.ObjectId, ref: "Competition" },
  },
  { timestamps: true }
);

const competingUserSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    current_round: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["playing", "won", "lost", "removed", "left"],
      default: "playing",
    },
    removed_reason: { type: String },
    paid_amount: { type: Number, default: 0 },
    rank: { type: Number },
  },
  { timestamps: true }
);

module.exports.competitionSchema = competitionSchema;
module.exports.roundSchema = roundSchema;
module.exports.competingUserSchema = competingUserSchema;
