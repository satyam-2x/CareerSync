import API from "../api";

// --- Jobs ---

// Fetch all jobs (with optional search)
export const getJobs = (search) => API.get(`/jobs?search=${search}`);

// Fetch a single job by ID
export const getJobById = (id) => API.get(`/jobs/${id}`);

// Apply to a job
export const applyJob = (id) =>
    API.post(`/jobs/${id}/apply`, {});

// --- Applications ---

// Fetch logged-in user's applications
export const getMyApplications = () =>
    API.get("/jobs/me");