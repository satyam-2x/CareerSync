const express = require("express");
const router = express.Router();

const { chatController } = require("../controllers/chatController");
const { optionalAuth } = require("../middlewares/roleMiddleware");

// AI chat route
router.post("/", optionalAuth, chatController);

module.exports = router;