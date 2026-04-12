const multer = require("multer");

// Use memory storage (file stored in buffer, not disk)
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
    storage,

    // Limit file size to 2MB
    limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;