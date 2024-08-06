const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authGuard } = require("../services/authGuard");

//get
router.get("/unseen", authGuard, notificationController.getUnseenNotificationsTotal);
router.get("/", authGuard, notificationController.getNotifications);


//post
router.post("/", authGuard, notificationController.sendNotification);

router.put("/:id", authGuard, notificationController.markNotification);

module.exports = router;
