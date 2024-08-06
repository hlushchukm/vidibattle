const express = require("express");
const {
  getChatList,
  getMessages,
  sendMessage,
  uploadChatImage,
  getMedia,
  chatMessageSeenStatusUpdate
} = require("../controllers/chat.controller");
const router = express.Router();
const { upload } = require("../services/storage");

// get
router.get("/list", getChatList);
router.get("/messages/:username", getMessages);

// create
router.post("/send", sendMessage);

// chat
router.post(
  "/image",
  upload.fields([{ name: "chat_files" }]),
  uploadChatImage
);
router.get("/:filename", getMedia);

// Route to mark a message as seen
router.post('/seen', chatMessageSeenStatusUpdate);

module.exports = router;
