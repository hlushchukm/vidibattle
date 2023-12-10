const express = require("express");
const {
  getStickersList,
  createSticker,
  deleteSticker,
} = require("../controllers/sticker.controller");
const { upload } = require("../services/storage");
const router = express.Router();

// get
router.get("/list", getStickersList);

// post
router.post("/", upload.single("file"), createSticker);

// delete
router.delete("/:id", deleteSticker);

module.exports = router;
