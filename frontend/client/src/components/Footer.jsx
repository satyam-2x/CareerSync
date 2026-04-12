import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto border-t border-gray-800">
      
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-center md:text-left">

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">
            Career<span className="text-blue-500">Sync</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            Connecting students with top opportunities and building future careers.
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wider mb-2">
            Quick Links
          </h3>

          <Link to="/" className="text-sm text-gray-400 hover:text-blue-400 transition">
            Home
          </Link>

          <Link to="/jobs" className="text-sm text-gray-400 hover:text-blue-400 transition">
            Jobs
          </Link>

          <Link to="/profile" className="text-sm text-gray-400 hover:text-blue-400 transition">
            Profile
          </Link>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wider mb-2">
            Contact
          </h3>

          <p className="text-sm text-gray-400">
            admin.careersync@gmail.com
          </p>

          <p className="text-sm text-gray-400">
            +91 7563060136
          </p>
        </div>

      </div>

      <div className="border-t border-gray-800 py-6 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} CareerSync. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;

