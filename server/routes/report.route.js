const express = require("express");
const {
  getReports,
  createReport,
  resolveReport,
  ignoreReport,
} = require("../controllers/report.controller");
const { adminAuthGuard, authGuard } = require("../services/authGuard");
const router = express.Router();

// get
router.get("/", adminAuthGuard, getReports);

// post
router.post("/", authGuard, createReport);
router.post("/remove/:reportId", adminAuthGuard, resolveReport);
router.post("/ignore/:reportId", adminAuthGuard, ignoreReport);

module.exports = router;
