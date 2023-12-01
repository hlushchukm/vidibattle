const express = require("express");
const { getWalletInfo } = require("../controllers/wallet.controller");
const router = express.Router();

// get
router.get("/:userId/info", getWalletInfo);

// post
// router.post("/recharge");

module.exports = router