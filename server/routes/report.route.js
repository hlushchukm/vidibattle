const express = require("express");
const {
  getReports,
  createReport,
} = require("../controllers/report.controller");
const router = express.Router();

// get
router.get("/", getReports);

// post
router.post("/", createReport);

module.exports = router;
