const express = require("express");
const {
  getCompetitionInfo,
  createCompetition,
  startCompetition,
  endCompetition,
} = require("../controllers/competition.controller");
const router = express.Router();

// TODO: add auth guards
// get
router.get("/info", getCompetitionInfo);

// post
router.post("/create", createCompetition);
router.post("/start", startCompetition);
router.post("/end", endCompetition);

module.exports = router;
