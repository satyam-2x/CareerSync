// --- ROLE AUTHORIZATION ---

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // Check if role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied for role: ${req.user.role}`
            });
        }

        next();
    };
};


// --- STUDENT ONLY ---
exports.isStudent = (req, res, next) => {

    if (!req.user || req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students allowed"
        });
    }

    next();
};


// --- RECRUITER ONLY ---
exports.isRecruiter = (req, res, next) => {

    if (!req.user || req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters allowed"
        });
    }

    next();
};


// --- ADMIN ONLY ---
exports.isAdmin = (req, res, next) => {

    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Only admin allowed"
        });
    }

    next();
};