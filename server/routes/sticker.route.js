const express = require("express");
const {
  getStickersList,
  createSticker,
  deleteSticker,
} = require("../controllers/sticker.controller");
const router = express.Router();

// get
router.get("/list", getStickersList);

// post
router.post("/", createSticker);

// delete
router.delete("/:id", deleteSticker);

module.exports = router;
