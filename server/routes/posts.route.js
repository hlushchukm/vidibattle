const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");

//read
router.get("/feed", postsController.getFeed);
router.get("/timeline/:id", postsController.getTimeline);

//create
router.post("/", postsController.create);

//update
// router.put("/:id", postsController.update);

//delete
// router.delete("/:id", postsController.delete);

module.exports = router;