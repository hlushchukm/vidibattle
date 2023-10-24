const mongoose = require("mongoose");
const { postSchema } = require("../schemas/post.schema");

module.exports.Post = mongoose.model("Post", postSchema);
