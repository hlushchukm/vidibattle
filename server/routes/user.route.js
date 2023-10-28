const express = require("express");
const {
  getBasicUserInfo,
  getAuthenticatedUser,
} = require("../controllers/user.controller");
const { authGuard } = require("../services/authGuard");
const router = express.Router();

// get
router.get("/basicInfo/:id", authGuard, getBasicUserInfo);
router.get("/authenticated", getAuthenticatedUser);

module.exports = router;
