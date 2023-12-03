const express = require("express");
const {
  createAdminAccount,
  getProfileInfo,
  updateAdminProfile,
  changePassword,
} = require("../controllers/admin.controller");
const { upload } = require("../services/storage");

const router = express.Router();

// get
router.get("/info", getProfileInfo);

// post
// router.post("/create", createAdminAccount);
router.post("/password", changePassword);

// put
router.put("/", upload.single("file"), updateAdminProfile);

module.exports = router;
