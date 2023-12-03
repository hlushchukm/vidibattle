const express = require("express");
const {
  createAdminAccount,
  getProfileInfo,
  updateAdminProfile,
} = require("../controllers/admin.controller");
const { upload } = require("../services/storage");

const router = express.Router();

// get
router.get("/info", getProfileInfo);

// post
// router.post("/create", createAdminAccount);

// put
router.put("/", upload.single("file"), updateAdminProfile);

module.exports = router;
