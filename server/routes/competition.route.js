const express = require("express");
const {
  getCompetitionInfo,
  createCompetition,
  startCompetition,
  endCompetition,
  getCompetitionsList,
  getCompetitorUsers,
  cancelCompetition,
  removeFromCompetition,
  advanceCompetitionRound,
  getRounds,
  leaveCompetition,
  joinCompetition,
} = require("../controllers/competition.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const { upload } = require("../services/storage");
const router = express.Router();

// get
router.get("/info/:name", authGuard, getCompetitionInfo);
router.get("/list/", authGuard, getCompetitionsList);
router.get("/admin/list", adminAuthGuard, getCompetitionsList);
router.get("/user/list/:id", adminAuthGuard, getCompetitorUsers);
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
router.post("/:competition/join", authGuard, joinCompetition);
router.post("/:competition/leave", authGuard, leaveCompetition);
router.post(
  "/:competition/remove/:user",
  adminAuthGuard,
  removeFromCompetition
);

module.exports = router;
