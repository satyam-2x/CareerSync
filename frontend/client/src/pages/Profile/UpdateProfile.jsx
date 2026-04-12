import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  uploadResume as uploadResumeAPI,
} from "../../services/userService";

const CustomInput = ({
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  readOnly,
}) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value || ""}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full border px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      readOnly ? "bg-gray-50 cursor-default" : ""
    }`}
  />
);

function UpdateProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State management
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        setUser(res.data.user);
        setForm(res.data.user);
      } catch {
        setMessage("Failed to load profile");
        setType("error");
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload resume
  const handleUploadResume = async () => {
    if (!file) {
      setMessage("Please select a PDF");
      setType("error");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadResumeAPI(formData, token);

      setForm((prev) => ({
        ...prev,
        resume: res.data.url,
      }));

      setMessage("Resume uploaded successfully");
      setType("success");

    } catch {
      setMessage("Resume upload failed");
      setType("error");

    } finally {
      setUploading(false);
    }
  };

  // Submit profile update
  const handleSubmit = async () => {
    let data = {};

    if (user.role === "student") {
      if (
        !form.prn ||
        !form.course ||
        !form.branch ||
        !form.cgpa ||
        !form.resume
      ) {
        setMessage("Please fill all required fields & upload resume");
        setType("error");
        return;
      }

      data = {
        prn: form.prn,
        course: form.course,
        branch: form.branch,
        semester: form.semester ? Number(form.semester) : null,
        cgpa: form.cgpa,
        resume: form.resume,
      };
    }

    if (user.role === "recruiter") {
      if (
        !form.companyName ||
        !form.companyEmail ||
        !form.contactNumber
      ) {
        setMessage("Please fill all required company fields");
        setType("error");
        return;
      }

      data = {
        companyName: form.companyName,
        companyEmail: form.companyEmail,
        companyWebsite: form.companyWebsite,
        contactNumber: form.contactNumber,
      };
    }

    try {
      setLoading(true);

      const res = await updateProfile(data, token);

      setMessage(res.data.message || "Profile updated");
      setType("success");

      setTimeout(() => navigate("/profile"), 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
      setType("error");

    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xl">

        <h2 className="text-xl font-semibold text-center text-gray-800">
          Update Profile
        </h2>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-4">
          <CustomInput name="name" value={form.name} readOnly />
          <CustomInput name="email" value={form.email} readOnly />
        </div>

        {user.role === "student" && (
          <div className="mt-4">
            <CustomInput name="prn" placeholder="PRN *" value={form.prn} onChange={handleChange} />
            <CustomInput name="course" placeholder="Course *" value={form.course} onChange={handleChange} />
            <CustomInput name="branch" placeholder="Branch *" value={form.branch} onChange={handleChange} />
            <CustomInput name="semester" type="number" placeholder="Semester" value={form.semester} onChange={handleChange} />
            <CustomInput name="cgpa" placeholder="CGPA *" value={form.cgpa} onChange={handleChange} />

            <input
              type="file"
              accept=".pdf"
              onChange={handleFile}
              className="w-full border px-4 py-2 rounded-lg mt-3"
            />

            <button
              onClick={handleUploadResume}
              disabled={uploading}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>

            {form.resume && (
              <a
                href={form.resume}
                target="_blank"
                rel="noreferrer"
                className="block mt-2 text-blue-600 underline"
              >
                View Resume
              </a>
            )}
          </div>
        )}

        {user.role === "recruiter" && (
          <div className="mt-4">
            <CustomInput name="companyName" placeholder="Company Name *" value={form.companyName} onChange={handleChange} />
            <CustomInput name="companyEmail" placeholder="Company Email *" value={form.companyEmail} onChange={handleChange} />
            <CustomInput name="companyWebsite" placeholder="Website" value={form.companyWebsite} onChange={handleChange} />
            <CustomInput name="contactNumber" placeholder="Contact Number *" value={form.contactNumber} onChange={handleChange} />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || uploading}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {uploading ? "Uploading..." : loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="w-full text-sm text-gray-500 mt-3 hover:underline"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default UpdateProfile;