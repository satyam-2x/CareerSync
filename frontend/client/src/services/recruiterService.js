import API from "../api";


// --- Jobs Management ---

// Fetch recruiter's jobs
export const getMyJobs = (token, search, status, jobType) =>
    API.get("/recruiter/jobs", {
        params: {
            search,
            status,
            jobType
        },
        headers: { Authorization: `Bearer ${token}` },
    });

// Create a new job
export const createJob = (data, token) =>
    API.post("/recruiter/jobs", data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Update an existing job
export const updateJob = (id, data, token) =>
    API.put(`/recruiter/jobs/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Delete a job
export const deleteJob = (id, token) =>
    API.delete(`/recruiter/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// --- Applications ---

// Fetch applicants for a specific job
export const getApplicants = (id, token) =>
    API.get(`/recruiter/jobs/${id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Update application status
export const updateApplicationStatus = (appId, data, token) =>
    API.put(`/recruiter/applications/${appId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Edit particular job by id
export const getRecruiterJobById = (id, token) =>
    API.get(`/recruiter/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });