
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/userService";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(localStorage.getItem("token"));
        setUser(res.data.user);
  
      } catch {
        setMessage("Error loading profile");
        setType("error");
      }
    };

    fetchProfile();
  }, []);

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading profile...
      </p>
    );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-800">{value || "Not set"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">

      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          My Profile
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm text-center ${type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {message}
          </div>
        )}

        {/* Basic Info */}
        <div className="mt-6 space-y-1">
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={user.role} />
        </div>

        {/* Student */}
        {user.role === "student" && (
          <div className="mt-6 space-y-1">
            <InfoRow label="PRN" value={user.prn} />
            <InfoRow label="Course" value={user.course} />
            <InfoRow label="Branch" value={user.branch} />
            <InfoRow label="Semester" value={user.semester} />
            <InfoRow label="CGPA" value={user.cgpa} />
          </div>
        )}

        {/* Recruiter */}
        {user.role === "recruiter" && (
          <div className="mt-6 space-y-1">
            <InfoRow label="Company" value={user.companyName} />
            <InfoRow label="Email" value={user.companyEmail} />
            <InfoRow label="Website" value={user.companyWebsite} />
            <InfoRow label="Contact" value={user.contactNumber} />
          </div>
        )}




        {user.role !== "admin" && (
          <button
            onClick={() => navigate("/update-profile")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6 hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        )}


        <button
          onClick={() => navigate("/change-password")}
          className="w-full text-sm text-gray-500 mt-3 hover:underline"
        >
          Change Password
        </button>


        {user.role !== "admin" && (
          <button
            onClick={() => navigate("/delete-account")}
            className="w-full text-sm text-red-500 mt-2 hover:underline"
          >
            Delete Account
          </button>
        )}

      </div>
    </div>
  );
}

export default Profile;