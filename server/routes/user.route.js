const express = require("express");
const {
  getBasicUserInfo,
  getAuthenticatedUser,
  follow,
  unfollow,
} = require("../controllers/user.controller");
const { authGuard } = require("../services/authGuard");
const router = express.Router();

// get
router.get("/basicInfo/:id", authGuard, getBasicUserInfo);
router.get("/authenticated", getAuthenticatedUser);

// post
router.post("/follow", authGuard, follow);
router.post("/unfollow", authGuard, unfollow);

module.exports = router;
