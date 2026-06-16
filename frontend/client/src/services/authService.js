import API from "../api";

// --- Authentication ---

// Register a new user
export const signup = (data) => API.post("/auth/signup", data);

// Login user
export const login = (data) => API.post("/auth/login", data);

// Send otp
export const sendOtp = (email) => API.post("/auth/send-otp", {
  email
});

// Verify OTP
export const verifyOtp = (email, otp) => API.post("/auth/verify-otp", {
  email,
  otp
});

// send logout request to backend
export const logoutUser = (token) =>
  API.post("/auth/logout", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// --- Password Management ---

// Request password reset (send OTP/email)
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);

// Reset user password
export const resetPassword = (data) => API.post("/auth/reset-password", data);