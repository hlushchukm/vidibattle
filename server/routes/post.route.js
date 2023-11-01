const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const { upload } = require("../services/storage");
const { authGuard } = require("../services/authGuard");

//get
router.get("/feed", authGuard, postsController.getFeed);
router.get("/timeline/:userId", authGuard, postsController.getTimeline);

//post
router.post("/", authGuard, upload.single("file"), postsController.create);
router.post("/like/:postId", authGuard, postsController.likePost);
router.post("/unlike/:postId", authGuard, postsController.unlikePost);

//update
// router.put("/:id", postsController.update);

//delete
// router.delete("/:id", postsController.delete);

module.exports = router;
