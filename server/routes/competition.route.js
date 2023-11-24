const express = require("express");
const {
  getCompetitionInfo,
  createCompetition,
  startCompetition,
  endCompetition,
  getCompetitionsList,
  getCompetitionPosts,
} = require("../controllers/competition.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const { upload } = require("../services/storage");
const router = express.Router();

// get
router.get("/info/:id", authGuard, getCompetitionInfo);
router.get("/list/", authGuard, getCompetitionsList);
router.get("/admin/list", adminAuthGuard, getCompetitionsList);
router.get("/post/list/:id", adminAuthGuard, getCompetitionPosts);

// post
router.post(
  "/create",
  adminAuthGuard,
  upload.single("file"),
  createCompetition
);
router.post("/start/:id", adminAuthGuard, startCompetition);
router.post("/end/:id", adminAuthGuard, endCompetition);

module.exports = router;
