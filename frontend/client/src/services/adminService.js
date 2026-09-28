import API from "../api";

// --- Students ---

// Fetch all students
export const getStudents = () =>
    API.get("/admin/students");

// Fetch a single student by ID
export const getStudentById = (id, ) =>
    API.get(`/admin/students/${id}`);

// Verify a student account
export const verifyStudent = (id, ) =>
    API.put(`/admin/students/${id}/verify`, {});

// --- Recruiters ---

// Fetch all recruiters
export const getRecruiters = () =>
    API.get("/admin/recruiters");

// Fetch a single recruiter by ID
export const getRecruiterById = (id) =>
    API.get(`/admin/recruiters/${id}`);

// Verify a recruiter account
export const verifyRecruiter = (id) =>
    API.put(`/admin/recruiters/${id}/verify`, {});

// --- Jobs ---

// Fetch jobs (optionally filtered by recruiter)
export const getAdminJobs = (query) =>
    API.get(`/admin/jobs${query ? `?recruiterId=${query}` : ""}`);

// Fetch a single job by ID
export const getAdminJobById = (id) =>
    API.get(`/admin/jobs/${id}`);

// Approve a job posting
export const approveJob = (id) =>
    API.patch(`/admin/jobs/${id}/approve`, {});

// --- Stats ---

// Fetch dashboard statistics
export const getStats = () =>
    API.get("/admin/stats");