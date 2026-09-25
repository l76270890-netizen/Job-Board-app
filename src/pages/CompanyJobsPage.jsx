import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Search } from "lucide-react";
import { api } from "../lib/api";
import "./CompanyJobsPage.css";

export default function CompanyJobsPage() {
  const { companyName = "" } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const decodedName = decodeURIComponent(companyName);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const results = await api(`/api/companies/${encodeURIComponent(decodedName)}/jobs`);
        if (active) setJobs(results.filter((job) => job.status !== "closed"));
      } catch (error) {
        console.error("Could not load company jobs", error);
        if (active) setJobs([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [decodedName]);

  const visibleJobs = useMemo(() => jobs.filter((job) =>
    `${job.title} ${job.category} ${job.location}`.toLowerCase().includes(search.toLowerCase())
  ), [jobs, search]);

  return (
    <main className="company-jobs-page">
      <div className="company-jobs-inner">
        <button className="company-jobs-back" onClick={() => navigate(`/company/${encodeURIComponent(decodedName)}`)}><ArrowLeft size={18} /> Company profile</button>
        <header className="company-jobs-heading">
          <span className="company-jobs-kicker"><Briefcase size={16} /> Open positions</span>
          <h1>Jobs at <span>{decodedName}</span></h1>
          <p>Explore current opportunities and find a role that fits your next move.</p>
        </header>
        <label className="company-jobs-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles or locations" /></label>
        {loading ? <div className="company-jobs-state">Loading open positions…</div> : visibleJobs.length ? (
          <div className="company-jobs-list">
            {visibleJobs.map((job) => <Link className="company-job-card" key={job.id} to={`/jobs/${job.id}`} state={{ id: job.id, ...job }}>
              <div><h2>{job.title}</h2><p className="company-job-meta"><span><MapPin size={15} />{job.location || "Nigeria"}</span><span><Briefcase size={15} />{job.jobType || job.type || "Full-time"}</span></p></div>
              <div className="company-job-right"><span>{job.category || "Opportunity"}</span><strong>{job.salaryMax || job.salaryMin ? `₦${Number(job.salaryMax || job.salaryMin).toLocaleString()}` : "Salary not listed"}</strong><b>View job →</b></div>
            </Link>)}
          </div>
        ) : <div className="company-jobs-empty"><Briefcase size={28} /><h2>{search ? "No matching roles" : "No open roles right now"}</h2><p>{search ? "Try another title or location." : `Check back later for new opportunities at ${decodedName}.`}</p><Link to="/jobs">Browse all jobs</Link></div>}
      </div>
    </main>
  );
}
