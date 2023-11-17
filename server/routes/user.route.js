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
  searchUsers,
  getSuggestedUsersToFollow,
} = require("../controllers/user.controller");
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const { upload } = require("../services/storage");
const router = express.Router();

// get
router.get("/basicInfo/:id", authGuard, getBasicUserInfo);
router.get("/profileInfo/:username", getProfileInfo);
router.get("/selfInfo", authGuard, getSelfInfo);
router.get("/authenticated", authGuard, getAuthenticatedUser);
router.get("/followers-following/:id", getFollowersAndFollowing);
router.get("/followers/:username", getFollowers);
router.get("/following/:username", getFollowing);
router.get("/blocked", authGuard, getBlockedUsers);
router.get("/list", adminAuthGuard, getUsersList);
router.get("/search", authGuard, searchUsers);
router.get("/suggestion", authGuard, getSuggestedUsersToFollow);

// post
router.post("/follow/:followedId", authGuard, follow);
router.post("/unfollow/:followedId", authGuard, unfollow);
router.post("/block/:blockedId", authGuard, block);
router.post("/unblock/:blockedId", authGuard, unblock);
router.post("/status", adminAuthGuard, changeUserStatus);

// put
router.put("/", authGuard, upload.single("file"), updateSelfProfile);

module.exports = router;
