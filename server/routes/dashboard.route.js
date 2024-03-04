const express = require("express");
const { dashboardAPI } = require("../controllers/dashboard.controller");
const router = express.Router();

// get
router.get("/", dashboardAPI);

module.exports = router;
