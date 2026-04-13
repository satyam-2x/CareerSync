const express = require("express");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const tpoRoutes = require("./routes/tpoRoutes");

// Config
const connectDB = require("./config/db");
const seedAdmin = require("./utils/seedAdmin");

app.set('trust proxy', 1);

const app = express();

// --- INITIAL SETUP ---

// Connect database
connectDB();

// Seed admin (runs once if not exists)
seedAdmin();

const PORT = process.env.PORT || 5000;


// --- MIDDLEWARE ---

// allow frontend access
app.use(cors({
    origin: "https://career-sync-psi.vercel.app",
    credentials: true
}));

// Parse JSON
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests, try again later"
});

app.use("/api", limiter);


// --- ROUTES ---

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", tpoRoutes);


// --- SERVER ---

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});