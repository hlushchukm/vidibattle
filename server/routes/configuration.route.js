const express = require("express");
const { adminAuthGuard, authGuard } = require("../services/authGuard");
const {
  updateConfiguration,
  getConfigurations,
} = require("../controllers/configuration.controller");
const { upload } = require("../services/storage");
const router = express.Router();

// get
router.get("/all", adminAuthGuard, getConfigurations);
router.get("/", getConfigurations);

// post
router.post(
  "/",
  adminAuthGuard,
  upload.fields([
    { name: "loading_screen_image" },
    { name: "home_bgd_desktop" },
    { name: "home_bgd_mobile" },
  ]),
  updateConfiguration
);

module.exports = router;
