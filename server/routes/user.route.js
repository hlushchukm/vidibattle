const express = require("express");
const { getBasicUserInfo } = require("../controllers/user.controller");
const router = express.Router();

// get
router.get("/basicInfo/:id", getBasicUserInfo);

module.exports = router;
