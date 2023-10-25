const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const { upload } = require("../services/storage");

//read
router.get("/feed", postsController.getFeed);
router.get("/timeline/:userId", postsController.getTimeline);

//create
router.post("/", upload.single("file"), postsController.create);

//update
// router.put("/:id", postsController.update);

//delete
// router.delete("/:id", postsController.delete);

module.exports = router;
