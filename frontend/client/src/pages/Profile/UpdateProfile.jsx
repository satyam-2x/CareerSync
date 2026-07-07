import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  uploadResume as uploadResumeAPI,
  uploadImage,
  removeImage,
} from "../../services/userService";

const CustomInput = ({
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  readOnly,
  min,
  max,
  step,
}) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value || ""}
    onChange={onChange}
    readOnly={readOnly}
    min={min}
    max={max}
    step={step}
    className={`w-full border px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? "bg-gray-50 cursor-default" : ""
      }`}
  />
);

function UpdateProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // State management
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);

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
    const { name, value } = e.target;

    if (name === "semester" && (value < 1 || value > 8)) return;

    if (
      name === "branch" &&
      !/^[A-Za-z\s.&-]*$/.test(value)
    ) {
      return;
    }

    if (
      name === "course" &&
      !/^[A-Za-z\s.&-]*$/.test(value)
    ) {
      return;
    }

    if (name === "branch" && !/^[A-Za-z\s]*$/.test(value)) return;

    if (
      name === "prn" &&
      (!/^\d*$/.test(value) || value.length > 12)
    ) {
      return;
    }

    if (
      name === "contactNumber" &&
      (!/^\d*$/.test(value) || value.length > 10)
    ) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };


  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    handleUploadImage(file);
  };


  // Upload image
  const handleUploadImage = async (file) => {
    if (!file) {
      setMessage("Please select an image");
      setType("error");
      return;
    }

    try {
      setImageUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadImage(formData, token);

      setForm((prev) => ({
        ...prev,
        profileImage: res.data.image,
      }));

      setMessage(res.data.message);
      setType("success");

    } catch (error) {
      setMessage("Image upload falied");
      setType("error");

    } finally {
      setImageUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = async () => {
    try {
      setImageUploading(true);

      const res = await removeImage(token);

      setForm((prev) => ({
        ...prev,
        profileImage: null,
      }));

      setMessage(res.data.message || "Image removed");
      setType("success");

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to remove image");
      setType("error");

    } finally {
      setImageUploading(false);
    }
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
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}>
            {message}
          </div>
        )}

        <div className="flex flex-col items-center mt-4 mb-4">

          {form.profileImage ? (
            <img
              src={form.profileImage}
              onClick={() => setShowImageMenu(true)}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div
              onClick={() => setShowImageMenu(true)}
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              No Image
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImage}
          />

          {showImageMenu && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="bg-white rounded-2xl w-80 overflow-hidden shadow-xl">

                <h2 className="text-xl font-semibold text-center py-5 border-b">
                  Change Profile Photo
                </h2>

                <button
                  className="w-full py-4 text-blue-600 font-semibold border-b hover:bg-gray-100"
                  onClick={() => {
                    fileInputRef.current.click();
                    setShowImageMenu(false);
                  }}
                >
                  Upload Photo
                </button>

                <button
                  className="w-full py-4 text-red-600 font-semibold border-b hover:bg-gray-100"
                  onClick={async () => {
                    await handleRemoveImage();
                    setShowImageMenu(false);
                  }}
                >
                  Remove Current Photo
                </button>

                <button
                  className="w-full py-4 hover:bg-gray-100"
                  onClick={() => setShowImageMenu(false)}
                >
                  Cancel
                </button>

              </div>

            </div>
          )}
        </div>

        <div className="mt-4">
          <CustomInput name="name" value={form.name} readOnly />
          <CustomInput name="email" value={form.email} readOnly />
        </div>

        {user.role === "student" && (
          <div className="mt-4">
            <CustomInput name="prn" placeholder="PRN *" value={form.prn} onChange={handleChange} />
            <CustomInput name="course" placeholder="Course *" value={form.course} onChange={handleChange} />
            <CustomInput name="branch" placeholder="Branch *" value={form.branch} onChange={handleChange} />

            <CustomInput
              name="semester"
              type="number"
              placeholder="Semester"
              min="1"
              max="8"
              step="1"
              value={form.semester}
              onChange={handleChange} />

            <CustomInput
              name="cgpa"
              type="number"
              placeholder="CGPA *"
              min="0"
              max="10"
              step="0.01"
              value={form.cgpa}
              onChange={handleChange} />

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