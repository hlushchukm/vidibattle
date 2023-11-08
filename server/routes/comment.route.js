const express = require("express");
const {
  createComment,
  likeComment,
  unlikeComment,
  getComments,
  removeComment,
} = require("../controllers/comment.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const router = express.Router();

// get
router.get("/get/:parentId", getComments);

// post
router.post("/create", authGuard, createComment);
router.post("/like/:commentId", authGuard, likeComment);
router.post("/unlike/:commentId", authGuard, unlikeComment);

// delete
router.delete("/remove/:postId/:commentId", adminAuthGuard, removeComment);


module.exports = router;
