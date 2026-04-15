const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ role: "admin" });

        if (!adminExists) {

            // Hash admin password (use env variable for security)
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

            // Create admin user
            await User.create({
                name: "Mr. Satyam",
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: "admin",
                isVerified: true,
                verified: true
            });

            console.log("Admin account created successfully!");
        } else {
            console.log("Admin already exists, skipping creation.");
        }

    } catch (error) {
        console.error("Error while seeding admin:", error);
    }
};

module.exports = seedAdmin;