import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdminJobById, approveJob } from "../../services/adminService";

function JobDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token"); 

  // State management
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch job
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminJobById(id, token);
        setJob(res.data);
      } catch {
        setMessage("Error fetching job");
        setType("error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // Approve job
  const approve = async () => {
    try {
      await approveJob(id, token);

      setJob({ ...job, approved: true });
      setMessage("Job approved");
      setType("success");

    } catch {
      setMessage("Error approving job");
      setType("error");
    }
  };

  // Reusable row
  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-800 font-medium">
        {value || "N/A"}
      </span>
    </div>
  );

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading job...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-xl font-semibold text-gray-800">
          {job.title}
        </h2>

        <div className="mt-2 text-sm text-blue-600 space-y-1">
          <p>{job.recruiterId?.companyName || "N/A"}</p>
          <p>{job.recruiterId?.name || "N/A"}</p>
          <p>{job.recruiterId?.companyEmail || "N/A"}</p>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-4 space-y-1">
          <InfoRow label="Location" value={job.location} />
          <InfoRow label="Salary" value={job.salary} />
          <InfoRow label="Type" value={job.jobType} />
          <InfoRow label="CGPA" value={job.minCgpa} />
          <InfoRow label="Batch" value={job.eligibleBatch?.join(", ")} />
          <InfoRow label="Branch" value={job.eligibleBranches?.join(", ")} />
          <InfoRow
            label="Deadline"
            value={
              job.deadline
                ? new Date(job.deadline).toDateString()
                : "N/A"
            }
          />
        </div>

        <div className="mt-4">
          <p className="text-gray-700 text-sm">
            {job.description}
          </p>
        </div>

        <p className="mt-4 text-sm font-medium">
          Status:{" "}
          <span className={
            job.approved ? "text-green-600" : "text-yellow-500"
          }>
            {job.approved ? "Approved" : "Pending"}
          </span>
        </p>

        {!job.approved && (
          <button
            onClick={approve}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6 hover:bg-blue-700 transition"
          >
            Approve Job
          </button>
        )}

      </div>
    </div>
  );
}

export default JobDetails;