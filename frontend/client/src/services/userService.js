import API from "../api";

// --- Profile ---

// Fetch user profile
export const getProfile = (token) =>
    API.get("/api/users/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

// Update user profile
export const updateProfile = (data, token) =>
    API.put("/api/users/profile", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// --- Resume ---

// Upload user resume
export const uploadResume = (formData, token) =>
    API.post("/api/users/upload-resume", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });

// --- Account ---

// Delete user account
export const deleteAccount = (data, token) =>
    API.delete("/api/users/profile", {
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// Change user password
export const changePassword = (data, token) =>
    API.put("/api/users/change-password", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });