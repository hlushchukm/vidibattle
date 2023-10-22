const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");

router.use("/auth", authRoutes);

// TODO: Delete me later
router.get("/", (req, res, next) => {
  res.send("works");
});

module.exports = router;
