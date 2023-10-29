const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const { upload } = require("../services/storage");
const { authGuard } = require("../services/authGuard");

//read
router.get("/feed", authGuard, postsController.getFeed);
router.get("/timeline/:userId", postsController.getTimeline);

//create
router.post("/", authGuard, upload.single("file"), postsController.create);

//update
// router.put("/:id", postsController.update);

//delete
// router.delete("/:id", postsController.delete);

module.exports = router;
