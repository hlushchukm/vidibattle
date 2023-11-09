const express = require("express");
const {
  getChatList,
  getMessages,
  sendMessage,
} = require("../controllers/chat.controller");
const router = express.Router();

// get
router.get("/list/:userId", getChatList);
router.get("/messages/:userId", getMessages);

// create
router.post("/send", sendMessage);

module.exports = router;
