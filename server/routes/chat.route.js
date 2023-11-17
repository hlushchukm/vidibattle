const express = require("express");
const {
  getChatList,
  getMessages,
  sendMessage,
} = require("../controllers/chat.controller");
const router = express.Router();

// get
router.get("/list", getChatList);
router.get("/messages/:username", getMessages);

// create
router.post("/send", sendMessage);

module.exports = router;
