import API from "../api";


// --- Jobs Management ---

// Fetch recruiter's jobs
export const getMyJobs = (search, status, jobType) =>
    API.get("/recruiter/jobs", {
        params: {
            search,
            status,
            jobType
        }
    });

// Create a new job
export const createJob = (data) =>
    API.post("/recruiter/jobs", data);

// Update an existing job
export const updateJob = (id, data) =>
    API.put(`/recruiter/jobs/${id}`, data);

// Delete a job
export const deleteJob = (id) =>
    API.delete(`/recruiter/jobs/${id}`);

// --- Applications ---

// Fetch applicants for a specific job
export const getApplicants = (id) =>
    API.get(`/recruiter/jobs/${id}/applicants`);

// Update application status
export const updateApplicationStatus = (appId, data) =>
    API.put(`/recruiter/applications/${appId}`, data);

// Edit particular job by id
export const getRecruiterJobById = (id) =>
    API.get(`/recruiter/jobs/${id}`);