const { default: mongoose } = require("mongoose");
const { commentSchema } = require("../schemas/comment/comment.schema");

module.exports.Comment = mongoose.model("Comment", commentSchema);
