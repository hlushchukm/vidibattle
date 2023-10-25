const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const postRouter = require("./posts.route");
const mediaRouter = require("./media.route");

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/media", mediaRouter);

module.exports = router;
