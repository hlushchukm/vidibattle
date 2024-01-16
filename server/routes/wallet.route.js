const express = require("express");
const {
  getWalletInfo,
  createOrder,
  verifyPayment,
} = require("../controllers/wallet.controller");
const router = express.Router();

// get
router.get("/:userId/info", getWalletInfo);

// post
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;
