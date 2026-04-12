import API from "../api";

// --- Jobs ---

// Fetch all jobs (with optional search)
export const getJobs = (search) => API.get(`/api/jobs?search=${search}`);

// Fetch a single job by ID
export const getJobById = (id) => API.get(`/api/jobs/${id}`);

// Apply to a job
export const applyJob = (id, token) =>
    API.post(`/api/jobs/${id}/apply`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// --- Applications ---

// Fetch logged-in user's applications
export const getMyApplications = (token) =>
    API.get("/api/jobs/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });