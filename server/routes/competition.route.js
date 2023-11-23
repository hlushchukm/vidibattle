const express = require("express");
const {
  getCompetitionInfo,
  createCompetition,
  startCompetition,
  endCompetition,
  getCompetitionsList,
} = require("../controllers/competition.controller");
const router = express.Router();

// TODO: add auth guards
// get
router.get("/info", getCompetitionInfo);
router.get("/list/", getCompetitionsList);// use client authguard here
router.get("/admin/list", getCompetitionsList);// use admin authguard here

// post
router.post("/create", createCompetition);
router.post("/start", startCompetition);
router.post("/end", endCompetition);

module.exports = router;
