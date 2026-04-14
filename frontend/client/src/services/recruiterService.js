import API from "../api";


// --- Jobs Management ---

// Fetch recruiter's jobs
export const getMyJobs = (token) =>
    API.get("/api/recruiter/jobs", {
        headers: { Authorization: `Bearer ${token}` },
    });

// Create a new job
export const createJob = (data, token) =>
    API.post("/api/recruiter/jobs", data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Update an existing job
export const updateJob = (id, data, token) =>
    API.put(`/api/recruiter/jobs/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Delete a job
export const deleteJob = (id, token) =>
    API.delete(`/api/recruiter/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// --- Applications ---

// Fetch applicants for a specific job
export const getApplicants = (id, token) =>
    API.get(`/api/recruiter/jobs/${id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Update application status
export const updateApplicationStatus = (appId, data, token) =>
    API.put(`/api/recruiter/applications/${appId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Edit particular job by id
export const getRecruiterJobById = (id, token) =>
    API.get(`/api/recruiter/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });