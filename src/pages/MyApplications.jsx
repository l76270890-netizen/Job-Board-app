import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CalendarDays, ChevronRight, ClipboardList } from "lucide-react";
import { api } from "../lib/api";
import "./MyApplications.css";

const statusClass = (status = "Pending") => status.toLowerCase().replaceAll(" ", "-");

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api("/api/applications/me")
      .then((items) => { if (active) setApplications(items); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <main className="my-applications-page"><div className="my-applications-inner">
    <header className="my-applications-header"><span><ClipboardList size={16} /> Job seeker dashboard</span><h1>My applications</h1><p>Keep track of every role you have applied for and its latest update.</p></header>
    {loading ? <div className="applications-state">Loading your applications…</div> : error ? <div className="applications-state error">{error}</div> : applications.length ? <section className="applications-list" aria-label="Your applications">
      {applications.map((application) => <article className="application-card" key={application.id}>
        <div className="application-icon"><Briefcase size={21} /></div>
        <div className="application-main"><h2>{application.jobTitle}</h2><p>{application.company} · {application.location || "Nigeria"}</p><span><CalendarDays size={14} /> Applied {new Date(application.appliedAt).toLocaleDateString()}</span></div>
        <div className="application-actions"><span className={`application-status ${statusClass(application.status)}`}>{application.status || "Pending"}</span><Link to={`/jobs/${application.jobId}`}>View role <ChevronRight size={16} /></Link></div>
      </article>)}
    </section> : <section className="applications-empty"><ClipboardList size={30} /><h2>No applications yet</h2><p>When you apply for a role, its progress will appear here.</p><Link to="/jobs">Browse open jobs</Link></section>}
  </div></main>;
}
