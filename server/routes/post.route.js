const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const { upload } = require("../services/storage");
const { authGuard, adminAuthGuard } = require("../services/authGuard");

//get
router.get("/feed", authGuard, postsController.getFeed);
router.get("/timeline/:userId", authGuard, postsController.getTimeline);
router.get("/userPosts/:userId", adminAuthGuard, postsController.getTimeline);
router.get("/:postId", postsController.getPost);

//post
router.post(
  "/",
  authGuard,
  upload.fields([{ name: "file" }, { name: "thumbnail" }]),
  postsController.create
);
router.post("/like/:postId", authGuard, postsController.likePost);
router.post("/unlike/:postId", authGuard, postsController.unlikePost);

//delete
router.delete("/remove/:id", adminAuthGuard, postsController.removePost);

module.exports = router;
