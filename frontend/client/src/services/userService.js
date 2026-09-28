import API from "../api";

// --- Profile ---

// Fetch user profile
export const getProfile = () =>
    API.get("/users/profile");

// Update user profile
export const updateProfile = (data) =>
    API.put("/users/profile", data);

export const uploadImage = (formData) =>
    API.post("/users/profile-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const removeImage = () =>
    API.delete("/users/profile-image");

// --- Resume ---

// Upload user resume
export const uploadResume = (formData) =>
    API.post("/users/upload-resume", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

// --- Account ---

// Delete user account
export const deleteAccount = (data) =>
    API.delete("/users/profile", data);

// Change user password
export const changePassword = (data) =>
    API.put("/users/change-password", data);