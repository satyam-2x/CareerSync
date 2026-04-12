const jwt = require("jsonwebtoken");

// --- AUTH MIDDLEWARE ---
exports.isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if token is provided
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};