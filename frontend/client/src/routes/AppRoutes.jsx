
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import Footer from "../components/Footer";
import Home from "../components/Home";

// ---------- Auth Pages ----------
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp";

// ---------- Jobs (Student) ----------
import Jobs from "../pages/Jobs/Jobs";
import JobDetails from "../pages/Jobs/JobDetails";
import MyApplications from "../pages/Jobs/MyApplication"; 

// ---------- Profile ----------
import Profile from "../pages/Profile/Profile";
import UpdateProfile from "../pages/Profile/UpdateProfile";
import ChangePassword from "../pages/Profile/ChangePassword";
import DeleteAccount from "../pages/Profile/DeleteAccount";

// ---------- Recruiter ----------
import CreateJob from "../pages/Recruiter/CreateJob";
import MyJobs from "../pages/Recruiter/MyJobs";
import EditJob from "../pages/Recruiter/EditJobs";
import Applicants from "../pages/Recruiter/Applicants";

// ---------- Admin (TPO) ----------
import AdminDashboard from "../pages/TPO/AdminDashboard";
import Students from "../pages/TPO/Students";
import StudentDetails from "../pages/TPO/StudentDetails";
import Recruiters from "../pages/TPO/Recruiters";
import RecruiterDetails from "../pages/TPO/RecruiterDetails";
import AdminJobs from "../pages/TPO/AdminJobs";
import AdminJobDetails from "../pages/TPO/AdminJobDetails";
import Stats from "../pages/TPO/Stats";

// Main routing component
function AppRoutes() {
  return (
    <BrowserRouter>
      
      
      <div className="flex flex-col min-h-screen">

        <Navbar />

      
        <main className="flex-grow">
          <Routes>
            {/* ---------- Public Routes ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* ---------- Auth Routes ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* ---------- Student Routes ---------- */}
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute role="student">
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            {/* ---------- Profile Routes ---------- */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/delete-account"
              element={
                <ProtectedRoute>
                  <DeleteAccount />
                </ProtectedRoute>
              }
            />

            {/* ---------- Recruiter Routes ---------- */}
            <Route
              path="/create-job"
              element={
                <ProtectedRoute role="recruiter">
                  <CreateJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-jobs"
              element={
                <ProtectedRoute role="recruiter">
                  <MyJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-job/:id"
              element={
                <ProtectedRoute role="recruiter">
                  <EditJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs/:id/applicants"
              element={
                <ProtectedRoute role="recruiter">
                  <Applicants />
                </ProtectedRoute>
              }
            />

            {/* ---------- Admin Routes --------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/students"
              element={
                <ProtectedRoute role="admin">
                  <Students />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/students/:id"
              element={
                <ProtectedRoute role="admin">
                  <StudentDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/recruiters"
              element={
                <ProtectedRoute role="admin">
                  <Recruiters />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/recruiters/:id"
              element={
                <ProtectedRoute role="admin">
                  <RecruiterDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute role="admin">
                  <AdminJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/jobs/:id"
              element={
                <ProtectedRoute role="admin">
                  <AdminJobDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute role="admin">
                  <Stats />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default AppRoutes;