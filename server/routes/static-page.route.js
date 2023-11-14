const express = require("express");
const {
  getPage,
  createPage,
} = require("../controllers/static-page.controller");
const { adminAuthGuard } = require("../services/authGuard");

const router = express.Router();

// get
router.get("/:pagename", getPage);

// post
router.post("/create", adminAuthGuard, createPage);

module.exports = router;
