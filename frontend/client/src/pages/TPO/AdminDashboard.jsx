import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Admin Dashboard
        </h2>

        {/* Manage Users */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-blue-600 mb-2">
            Manage Users
          </h3>

          <div className="space-y-2">
            <Link
              to="/admin/students"
              className="block bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
            >
              View Students
            </Link>

            <Link
              to="/admin/recruiters"
              className="block bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
            >
              View Recruiters
            </Link>
          </div>
        </div>

        {/* Manage Jobs */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-blue-600 mb-2">
            Manage Jobs
          </h3>

          <Link
            to="/admin/jobs"
            className="block bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
          >
            All Jobs
          </Link>
        </div>

        {/* Analytics */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-blue-600 mb-2">
            Analytics
          </h3>

          <Link
            to="/admin/stats"
            className="block bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
          >
            View Stats
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;