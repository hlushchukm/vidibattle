const express = require("express");
const router = express.Router();
const { authGuard } = require("../services/authGuard");
const authRouter = require("./auth.route");
const postRouter = require("./post.route");
const mediaRouter = require("./media.route");
const chatRouter = require("./chat.route");
const userRouter = require("./user.route");
const commentRouter = require("./comment.route");
const reportRouter = require("./report.route");
const staticPageRouter = require('./static-page.route')

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/media", mediaRouter);
router.use("/chat", authGuard, chatRouter);
router.use("/user", userRouter);
router.use("/comment", commentRouter);
router.use("/report", reportRouter);
router.use('/static-pages', staticPageRouter)

module.exports = router;
