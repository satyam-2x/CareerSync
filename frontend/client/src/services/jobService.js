import API from "../api";

// --- Jobs ---

// Fetch all jobs (with optional search)
export const getJobs = (search) => API.get(`/jobs?search=${search}`);

// Fetch a single job by ID
export const getJobById = (id) => API.get(`/jobs/${id}`);

// Apply to a job
export const applyJob = (id, token) =>
    API.post(`/jobs/${id}/apply`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// --- Applications ---

// Fetch logged-in user's applications
export const getMyApplications = (token) =>
    API.get("/jobs/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });