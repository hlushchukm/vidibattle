const express = require("express");
const {
  createComment,
  likeComment,
  unlikeComment,
  getComments,
} = require("../controllers/comment.controller");
const router = express.Router();

// get
router.get("/get/:parentId", getComments);

// post
router.post("/create", createComment);
router.post("/like/:commentId", likeComment);
router.post("/unlike/:commentId", unlikeComment);

module.exports = router;
