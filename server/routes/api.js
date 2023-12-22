const express = require("express");
const router = express.Router();
const { authGuard, adminAuthGuard } = require("../services/authGuard");
const authRouter = require("./auth.route");
const postRouter = require("./post.route");
const mediaRouter = require("./media.route");
const chatRouter = require("./chat.route");
const userRouter = require("./user.route");
const commentRouter = require("./comment.route");
const reportRouter = require("./report.route");
const staticPageRouter = require("./static-page.route");
const competitionRouter = require("./competition.route");
const walletRouter = require("./wallet.route");
const adminRouter = require("./admin.route");
const stickerRouter = require("./sticker.route");
const configurationRouter = require("./configuration.route");

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/media", mediaRouter);
router.use("/chat", authGuard, chatRouter);
router.use("/user", userRouter);
router.use("/comment", commentRouter);
router.use("/report", reportRouter);
router.use("/static-pages", staticPageRouter);
router.use("/competition", competitionRouter);
router.use("/wallet", walletRouter); // TODO: add authguard
router.use("/admin", adminAuthGuard, adminRouter);
router.use("/sticker", adminAuthGuard, stickerRouter);
router.use("/configuration", configurationRouter);

module.exports = router;
