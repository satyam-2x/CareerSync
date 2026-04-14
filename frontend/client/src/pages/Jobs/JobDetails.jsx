import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyJob } from "../../services/jobService";


function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(id); 
        setJob(res.data);
      } catch (error) {
        setMessage("Error fetching job details");
        setType("error");
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first to apply");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await applyJob(id, token);

      setMessage(res.data.message || "Applied successfully");
      setType("success");
      setApplied(true);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error applying");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!job)
    return <p className="text-center mt-10 text-gray-500">Loading job details...</p>;

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between border-b py-2">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-800 font-medium">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="bg-white max-w-2xl w-full p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
        <p className="text-blue-600 mt-1">
          {job.recruiterId?.companyName || "N/A"}
        </p>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 space-y-2">
          <InfoRow label="Location" value={job.location} />
          <InfoRow label="Stipend" value={job.salary} />
          <InfoRow label="Type" value={job.jobType} />
          <InfoRow label="Min CGPA" value={job.minCgpa} />
          <InfoRow label="Eligible Batch" value={job.eligibleBatch?.join(", ")} />
          <InfoRow label="Eligible Branches" value={job.eligibleBranches?.join(", ")} />

          <InfoRow
            label="Status"
            value={
              <span className={`font-bold ${
                job.status === "open" ? "text-green-600" : "text-red-600"
              }`}>
                {job.status ? job.status.toUpperCase() : "OPEN"}
              </span>
            }
          />

          <InfoRow
            label="Deadline"
            value={job.deadline ? new Date(job.deadline).toDateString() : "N/A"}
          />
        </div>

        <button
          onClick={handleApply}
          disabled={applied || loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6"
        >
          {applied ? "Already Applied" : loading ? "Applying..." : "Apply Now"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-sm text-gray-500 mt-3"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default JobDetails;