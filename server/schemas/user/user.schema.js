const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const {
  addPost,
  removePost,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
  addChat,
  removeChat,
  removePosts,
} = require("./user.method");

//define schema
const Schema = mongoose.Schema;

// address schema
const addressSchema = Schema({
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address_line: { type: String },
  zip_code: { type: String },
});

// social media links schema
const socialMediaLinksSchema = Schema({
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  snapchat: { type: String },
  whatsapp: { type: String },
});

const userSchema = Schema(
  {
    profile_id: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    username: {
      type: String,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    contact_no: { type: String },
    bio: { type: String },
    password: { type: String },
    profile_img: { type: String },
    status: {
      type: String,
      enum: ["active", "suspended", "under review", "deleted"],
      default: "active",
    },
    provider: {
      type: String,
      enum: ["google", "instagram", "facebook"],
      required: true,
    },
    followers_count: { type: Number, default: 0 },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following_count: { type: Number, default: 0 },
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts_count: { type: Number, default: 0 },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    chats_count: { type: Number, default: 0 },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    blocked_users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blocked_by: [{ type: Schema.Types.ObjectId, ref: "User" }],
    is_complete: { type: Boolean, default: false },
    address: { type: addressSchema },
    social_links: { type: socialMediaLinksSchema },
    interested_to_earn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.pre("find", function () {
  if (!this.getOptions().includeDeleted) {
    this.where({ status: { $ne: "deleted" } });
  }
});

userSchema.pre("findById", function () {
  this.where({ status: { $ne: "deleted" } });
});

userSchema.pre("findOne", function () {
  this.where({ status: { $ne: "deleted" } });
});

// Methods
userSchema.statics.addPost = addPost;
userSchema.statics.removePost = removePost;
userSchema.statics.removePosts = removePosts;
userSchema.statics.addFollower = addFollower;
userSchema.statics.removeFollower = removeFollower;
userSchema.statics.addFollowing = addFollowing;
userSchema.statics.removeFollowing = removeFollowing;
userSchema.statics.addChat = addChat;
userSchema.statics.removeChat = removeChat;

module.exports.userSchema = userSchema;
