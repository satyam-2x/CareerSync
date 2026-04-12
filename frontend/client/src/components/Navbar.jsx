import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  const navRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const closeMenu = () => setActiveMenu(null);

  const handleLogout = () => {
    localStorage.clear();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav
      ref={navRef}
      className="flex items-center justify-between px-6 py-3 bg-blue-700 shadow-md sticky top-0 z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-xl font-bold text-white">
          CareerSync
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6 text-white text-sm font-medium">

        <Link to="/" onClick={closeMenu} className="hover:text-blue-200">
          Home
        </Link>

        {!user && (
          <div className="relative">
            <button onClick={() => toggleMenu("auth")}>
              Account ▼
            </button>

            {activeMenu === "auth" && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-md text-gray-800">
                <Link to="/login" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                <Link to="/signup" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">Signup</Link>
                <Link to="/forgot-password" onClick={closeMenu} className="block px-4 py-2 text-sm border-t">Forgot Password</Link>
              </div>
            )}
          </div>
        )}

        {user?.role === "student" && (
          <div className="relative">
            <button onClick={() => toggleMenu("jobs")}>
              Jobs ▼
            </button>

            {activeMenu === "jobs" && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-md text-gray-800">
                <Link to="/jobs" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">Browse Jobs</Link>
                <Link to="/my-applications" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">My Applications</Link>
              </div>
            )}
          </div>
        )}

        {user?.role === "recruiter" && (
          <div className="relative">
            <button onClick={() => toggleMenu("recruiter")}>
              Recruiter ▼
            </button>

            {activeMenu === "recruiter" && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-md text-gray-800">
                <Link to="/create-job" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">Post Job</Link>
                <Link to="/my-jobs" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">My Jobs</Link>
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="relative">
            <button onClick={() => toggleMenu("profile")}>
              Profile ▼
            </button>

            {activeMenu === "profile" && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md text-gray-800">

                <div className="px-4 py-2 border-b text-sm font-semibold">
                  {user.name}
                </div>

                <Link to="/profile" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">Profile</Link>

                {user.role !== "admin" && (
                  <Link to="/update-profile" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">Edit Profile</Link>
                )}

                <Link to="/change-password" onClick={closeMenu} className="block px-4 py-2 hover:bg-gray-100">Change Password</Link>

                {user.role !== "admin" && (
                  <Link to="/delete-account" onClick={closeMenu} className="block px-4 py-2 text-red-600 hover:bg-red-50">Delete Account</Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 border-t text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" className="bg-white/20 px-3 py-1 rounded">
            Admin
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;