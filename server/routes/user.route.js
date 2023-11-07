const express = require("express");
const {
  getBasicUserInfo,
  getAuthenticatedUser,
  follow,
  unfollow,
  block,
  unblock,
  getProfileInfo,
  getFollowersAndFollowing,
  getBlockedUsers,
  getUsersList,
} = require("../controllers/user.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const router = express.Router();

// get
router.get("/basicInfo/:id", authGuard, getBasicUserInfo);
router.get("/profileInfo/:id", getProfileInfo);
router.get("/authenticated", getAuthenticatedUser);
router.get("/followers-following/:id", getFollowersAndFollowing);
router.get("/blocked", authGuard, getBlockedUsers);
router.get("/list", getUsersList); // TODO: add admin auth guard

// post
router.post("/follow/:followedId", authGuard, follow);
router.post("/unfollow/:followedId", authGuard, unfollow);
router.post("/block/:blockedId", authGuard, block);
router.post("/unblock/:blockedId", authGuard, unblock);

module.exports = router;
