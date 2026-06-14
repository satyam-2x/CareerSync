import API from "../api";

// --- Profile ---

// Fetch user profile
export const getProfile = (token) =>
    API.get("/users/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

// Update user profile
export const updateProfile = (data, token) =>
    API.put("/users/profile", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// --- Resume ---

// Upload user resume
export const uploadResume = (formData, token) =>
    API.post("/users/upload-resume", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });

// --- Account ---

// Delete user account
export const deleteAccount = (data, token) =>
    API.delete("/users/profile", {
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// Change user password
export const changePassword = (data, token) =>
    API.put("/users/change-password", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });