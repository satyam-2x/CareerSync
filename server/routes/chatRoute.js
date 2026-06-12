const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/chatController");
const { optionalAuth } = require("../middlewares/roleMiddleware");

// AI chat route
router.post("/", optionalAuth, chat);

module.exports = router;