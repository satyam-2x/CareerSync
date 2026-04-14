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

const app = express();
app.set('trust proxy', 1);

// --- INITIAL SETUP ---

connectDB();
seedAdmin();

const PORT = process.env.PORT || 5000;


// --- MIDDLEWARE ---

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://career-sync-psi.vercel.app",
    ],
    credentials: true
}));

app.use(express.json());

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
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