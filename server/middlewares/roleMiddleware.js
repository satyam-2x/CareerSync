const jwt = require("jsonwebtoken");
// --- ROLE AUTHORIZATION ---

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied for role: ${req.user.role}`
            });
        }

        next();
    };
};


// Optional authentication middleware
exports.optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;
        }

        next();

    } catch (error) {
        next();
    }
};