import API from "../api";

// --- Students ---

// Fetch all students
export const getStudents = (token) =>
    API.get("/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
    });

// Fetch a single student by ID
export const getStudentById = (id, token) =>
    API.get(`/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Verify a student account
export const verifyStudent = (id, token) =>
    API.put(`/admin/students/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });

// --- Recruiters ---

// Fetch all recruiters
export const getRecruiters = (token) =>
    API.get("/admin/recruiters", {
        headers: { Authorization: `Bearer ${token}` },
    });

// Fetch a single recruiter by ID
export const getRecruiterById = (id, token) =>
    API.get(`/admin/recruiters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Verify a recruiter account
export const verifyRecruiter = (id, token) =>
    API.put(`/admin/recruiters/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });

// --- Jobs ---

// Fetch jobs (optionally filtered by recruiter)
export const getAdminJobs = (query, token) =>
    API.get(`/admin/jobs${query ? `?recruiterId=${query}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Fetch a single job by ID
export const getAdminJobById = (id, token) =>
    API.get(`/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Approve a job posting
export const approveJob = (id, token) =>
    API.patch(`/admin/jobs/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });

// --- Stats ---

// Fetch dashboard statistics
export const getStats = (token) =>
    API.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
    });