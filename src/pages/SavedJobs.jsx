import "./SavedJobs.css";
import { Bookmark, Briefcase, DollarSign, MapPin, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function SavedJobs() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSavedJobs = useCallback(async () => {
    if (!currentUser) {
      setSavedJobs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setSavedJobs(await api("/api/saved-jobs"));
    } catch (loadError) {
      setError(loadError.message || "Could not load your saved jobs.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { loadSavedJobs(); }, [loadSavedJobs]);

  const removeSavedJob = async (event, jobId) => {
    event.stopPropagation();
    const id = String(jobId);
    const previousJobs = savedJobs;
    setSavedJobs((items) => items.filter((job) => String(job.id) !== id));
    setError("");
    try {
      await api(`/api/saved-jobs/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (removeError) {
      setSavedJobs(previousJobs);
      setError(removeError.message || "Could not remove this saved job.");
    }
  };

  const openJob = (job) => navigate(`/jobs/${job.id}`, { state: job });

  if (!currentUser) {
    return (
      <main className="savedJobsPage emptyState">
        <Bookmark size={42} aria-hidden="true" />
        <h2>Sign in to view saved jobs</h2>
        <p>Your saved jobs will appear here.</p>
        <button className="browseBtn" onClick={() => navigate("/login")}>Sign in</button>
      </main>
    );
  }

  return (
    <main className="savedJobsPage">
      <header className="savedHeader">
        <h1>Your saved jobs</h1>
        <p className="savedCount">{savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved</p>
      </header>

      {error && <p role="alert" className="savedJobsError">{error}</p>}

      {loading ? (
        <p className="loadingText">Loading saved jobs…</p>
      ) : savedJobs.length ? (
        <div className="savedJobsGrid">
          {savedJobs.map((job) => {
            const company = job.companyName || job.company || "Company";
            const logo = job.logo || job.companyLogo;
            const salary = Number(job.salaryMax || job.salaryMin || job.salary || 0);
            return (
              <article className="savedJobCard" key={job.id} onClick={() => openJob(job)}>
                <div className="savedJobTop">
                  {logo ? (
                    <img className="savedCompanyLogo" src={logo} alt={`${company} logo`} />
                  ) : (
                    <div className="savedCompanyFallbackLogo" aria-label={`${company} logo`}>{company.slice(0, 1).toUpperCase()}</div>
                  )}
                  <button className="unsaveBtn" aria-label={`Remove ${job.title} from saved jobs`} onClick={(event) => removeSavedJob(event, job.id)}>
                    <Trash2 size={17} />
                  </button>
                </div>
                <h3>{job.title}</h3>
                <p className="savedCompanyName">{company}</p>
                <div className="savedJobInfo">
                  <span><MapPin size={15} />{job.location || "Nigeria"}</span>
                  <span><Briefcase size={15} />{job.jobType || job.type || "Full-time"}</span>
                  {job.category && <span>{job.category}</span>}
                </div>
                <p className="savedJobDesc">{job.description || "View the full job details to learn more about this opportunity."}</p>
                <div className="savedJobBottom">
                  <span className="savedSalary"><DollarSign size={16} />{salary ? `₦${salary.toLocaleString()}` : "Salary not listed"}</span>
                  <button className="applyBtn" onClick={(event) => { event.stopPropagation(); openJob(job); }}>View job</button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="emptyState">
          <Bookmark size={42} aria-hidden="true" />
          <h2>No saved jobs yet</h2>
          <p>Use the bookmark on a job card to keep it here.</p>
          <Link className="browseBtn" to="/jobs">Browse jobs</Link>
        </div>
      )}
    </main>
  );
}
