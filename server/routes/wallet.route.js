const express = require("express");
const { authGuard } = require("../services/authGuard");
const { getWalletInfo } = require("../controllers/wallet.controller");
const router = express.Router();

// get
router.get("/:userId/info", authGuard, getWalletInfo);

// post
// router.post("/recharge");
