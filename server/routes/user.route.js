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
  changeUserStatus,
  getSelfInfo,
  updateSelfProfile,
  getFollowers,
  getFollowing,
} = require("../controllers/user.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const router = express.Router();

// get
router.get("/basicInfo/:id", authGuard, getBasicUserInfo);
router.get("/profileInfo/:id", getProfileInfo);
router.get("/selfInfo", authGuard, getSelfInfo);
router.get("/authenticated", getAuthenticatedUser);
router.get("/followers-following/:id", getFollowersAndFollowing);
router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.get("/blocked", authGuard, getBlockedUsers);
router.get("/list", adminAuthGuard, getUsersList);

// post
router.post("/follow/:followedId", authGuard, follow);
router.post("/unfollow/:followedId", authGuard, unfollow);
router.post("/block/:blockedId", authGuard, block);
router.post("/unblock/:blockedId", authGuard, unblock);
router.post("/status", adminAuthGuard, changeUserStatus);

// put
router.put("/", authGuard, updateSelfProfile)

module.exports = router;
