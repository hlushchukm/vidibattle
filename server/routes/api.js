const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const postRouter = require("./post.route");
const mediaRouter = require("./media.route");
const chatRouter = require("./chat.route");
const userRouter = require("./user.route");

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/media", mediaRouter);
router.use("/chat", chatRouter);
router.use("/user", userRouter);

module.exports = router;
