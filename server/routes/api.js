const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const postRouter = require("./posts.route")

router.use("/auth", authRouter);
router.use("/post", postRouter);

// TODO: Delete me later
router.get("/", (req, res, next) => {
  res.send("works");
});

module.exports = router;
