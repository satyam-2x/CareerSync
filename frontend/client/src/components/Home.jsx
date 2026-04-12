import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-100">
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl w-full text-center">

          {/* Hero Section */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
              Career<span className="text-blue-600">Sync</span>
            </h1>

            <p className="mt-6 text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Your gateway to meaningful opportunities. Join students connecting
              with top recruiters in one seamless platform.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition">
                Browse Jobs
              </button>
            </Link>

            <Link to="/signup">
              <button className="w-full sm:w-auto bg-white text-slate-700 border px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition">
                Create Account
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">

            <div className="bg-white/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-slate-800">Fast Apply</h3>
              <p className="text-sm text-slate-500 mt-2">
                Apply to jobs quickly using your profile.
              </p>
            </div>

            <div className="bg-white/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-slate-800">Track Status</h3>
              <p className="text-sm text-slate-500 mt-2">
                Track your applications in real-time.
              </p>
            </div>

            <div className="bg-white/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-slate-800">Verified Jobs</h3>
              <p className="text-sm text-slate-500 mt-2">
                Only verified recruiters and opportunities.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;