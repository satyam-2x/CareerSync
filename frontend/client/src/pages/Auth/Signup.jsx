import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../services/authService";

function Signup() {
  const navigate = useNavigate();

  // State management
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    companyEmail: "",
  });

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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    if (name === "password") {
      if (value.length < 8) {
        setPasswordStrength("Weak");
      } else if (
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)
      ) {
        setPasswordStrength("Strong");
      } else {
        setPasswordStrength("Medium");
      }
    }

    setForm({ ...form, [name]: value });
  };

  // Handle signup submission
  const handleSubmit = async () => {
    if (loading) return;

    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(form.name)) {
      setMessage("Name can contain only letters");
      setType("error");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(form.email)) {
      setMessage("Please enter a valid email");
      setType("error");
      return;
    }

    if (
      form.role === "recruiter" &&
      !emailRegex.test(form.companyEmail)
    ) {
      setMessage("Please enter a valid company email");
      setType("error");
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters");
      setType("error");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password)) {
      setMessage("Password must contain uppercase, lowercase, number and symbol");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await signup(form);

      setMessage(res.data.message);
      setType("success");

      // Redirect to OTP verification
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email: form.email },
        });
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
      setType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Signup
        </h2>

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

        <input
          className="w-full border px-4 py-2 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          className="w-full border px-4 py-2 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="w-full border px-4 py-2 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <p
          className={`text-sm mt-1 ${passwordStrength === "Weak"
              ? "text-red-500"
              : passwordStrength === "Medium"
                ? "text-yellow-500"
                : "text-green-600"
            }`}
        >
          {passwordStrength && `Password Strength: ${passwordStrength}`}
        </p>

        <select
          name="role"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg mt-3"
        >
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {form.role === "recruiter" && (
          <input
            className="w-full border px-4 py-2 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="companyEmail"
            type="email"
            placeholder="Company Email"
            onChange={handleChange}
          />
        )}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition disabled:opacity-50"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;