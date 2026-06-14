import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;

  // State management
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: emailFromState || "",
    otp: "",
    password: ""
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

    if (name === "otp" && !/^\d*$/.test(value)) {
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

  // Handle reset password
  const handleSubmit = async () => {
    if (!form.otp || !form.password) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    if (!/^\d{6}$/.test(form.otp)) {
      setMessage("Please enter a valid 6-digit OTP");
      setType("error");
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters");
      setType("error");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password)
    ) {
      setMessage(
        "Password must contain uppercase, lowercase, number and symbol"
      );
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword(form);

      setMessage(res.data.message || "Password reset successful");
      setType("success");

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error");
      setType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {message && (
          <p className={`mb-3 text-sm text-center ${type === "error" ? "text-red-500" : "text-green-600"
            }`}>
            {message}
          </p>
        )}

        <input
          type="email"
          value={form.email}
          readOnly
          className="w-full border p-2 rounded mb-3 bg-gray-100"
        />

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          maxLength={6}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <p
          className={`text-sm mt-1 mb-3 ${passwordStrength === "Weak"
            ? "text-red-500"
            : passwordStrength === "Medium"
              ? "text-yellow-500"
              : "text-green-600"
            }`}
        >
          {passwordStrength && `Password Strength: ${passwordStrength}`}
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;