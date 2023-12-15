const express = require("express");
const { adminAuthGuard, authGuard } = require("../services/authGuard");
const {
  updateConfiguration,
  getConfigurations,
} = require("../controllers/configuration.controller");
const router = express.Router();

// get
router.get("/all", adminAuthGuard, getConfigurations);
router.get("/", authGuard, getConfigurations);

// post
router.post("/", adminAuthGuard, updateConfiguration);

module.exports = router;
