const express = require("express");
const {
  getCompetitionInfo,
  createCompetition,
  startCompetition,
  endCompetition,
  getCompetitionsList,
  getCompetitionPosts,
  cancelCompetition,
  removeFromCompetition,
  advanceCompetitionRound,
  getRounds,
} = require("../controllers/competition.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const { upload } = require("../services/storage");
const router = express.Router();

// get
router.get("/info/:id", authGuard, getCompetitionInfo);
router.get("/list/", authGuard, getCompetitionsList);
router.get("/admin/list", adminAuthGuard, getCompetitionsList);
router.get("/post/list/:id", adminAuthGuard, getCompetitionPosts);
router.get("/rounds/:id", authGuard, getRounds);
router.get("/admin/rounds/:id", adminAuthGuard, getRounds);

// post
router.post(
  "/create",
  adminAuthGuard,
  upload.single("file"),
  createCompetition
);
router.post("/start/:id", adminAuthGuard, startCompetition);
router.post("/end/:id", adminAuthGuard, endCompetition);
router.post("/cancel/:id", adminAuthGuard, cancelCompetition);
router.post("/advance/:id", adminAuthGuard, advanceCompetitionRound);
router.post("/:competition/leave/:user", authGuard, removeFromCompetition);
router.post(
  "/:competition/remove/:user",
  adminAuthGuard,
  removeFromCompetition
);

module.exports = router;
