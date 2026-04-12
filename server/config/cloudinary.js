const cloudinary = require("cloudinary").v2;

// ---- Configure Cloudinary using environment variables ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // --- your cloud name ---
    api_key: process.env.CLOUDINARY_API_KEY, // --- API key for authentication ---
    api_secret: process.env.CLOUDINARY_API_SECRET // --- API secret for secure access ---
});

// --- Export configured instance to use in other files ---
module.exports = cloudinary;