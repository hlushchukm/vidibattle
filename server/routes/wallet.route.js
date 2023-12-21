const express = require("express");
const {
  getWalletInfo,
  loadToWallet,
  loadToWalletCallback,
  loadToWallet1,
} = require("../controllers/wallet.controller");
const router = express.Router();

// get
router.get("/:userId/info", getWalletInfo);
router.get("/load/test", loadToWallet1); // TODO: delete later

// post
router.post("/load", loadToWallet);
router.post("/load/callback", loadToWalletCallback);

module.exports = router;
