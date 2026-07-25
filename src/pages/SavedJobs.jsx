import "./AllJobs.css"; // reuse same styles
import {
  Search,
  MapPin,
  Bookmark,
  Briefcase,
  DollarSign,
  ArrowLeft,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobs as allJobs } from "./AllJobs"; // import your jobs array

export default function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);

  // Load saved jobs from localStorage
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const filtered = allJobs.filter(job => savedIds.includes(job.id));
    setSavedJobs(filtered);
  }, []);

  // Remove from saved
  const handleRemoveSave = (e, jobId) => {
    e.stopPropagation();
    const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const newSavedIds = savedIds.filter(id => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  return (
    <section className="allJobs">
      <div className="desktopJobs">
        <div className="backHeader">
          <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span></span>
          </button>
        </div>

        <div className="jobsHero">
          <h1>Your <span>Saved Jobs</span></h1>
          <p className="resultsCount">{savedJobs.length} jobs saved</p>
        </div>

        <div className="jobsContainer" style={{ gridTemplateColumns: '1fr' }}>
          <div className="jobsGrid">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <div className="jobCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                  <div className="jobHeader">
                    <img src={job.logo} alt={job.company} />
                    {/* Bookmark is filled + acts as remove button */}
                    <Bookmark
                      size={20}
                      fill="#2563eb"
                      color="#2563eb"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleRemoveSave(e, job.id)}
                    />
                  </div>
                  <h2>{job.title}</h2>
                  <h4>{job.company}</h4>
                  <div className="jobTags">
                    <span>{job.category}</span>
                    <span>{job.type}</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="des">{job.description}</p>
                  <div className="salaryRow">
                    <div><DollarSign size={18} />${job.salary.toLocaleString()}/mo</div>
                    <button onClick={(e) => { e.stopPropagation(); alert(`Applying for ${job.title}`); }}>Apply</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-jobs" style={{ textAlign: 'center', padding: '40px' }}>
                <Bookmark size={48} color="#ccc" />
                <h3>No Saved Jobs Yet</h3>
                <p>Click the bookmark icon on any job to save it here</p>
                <button className="applyBtn" style={{ marginTop: '16px' }} onClick={() => navigate('/jobs')}>
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="mobileJobs">
        <div className="mobileBack">
          <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span></span>
          </button>
        </div>
    <div className="jobsHero">
          <h1>Your <span>Saved Jobs</span></h1>
        </div>
        <div className="mobileJobList">
          <p className="resultsCount">{savedJobs.length} jobs saved</p>
          {savedJobs.length > 0 ? (
            savedJobs.map((job) => (
              <div className="mobileCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                <div className="mobileTop">
                  <img src={job.logo} alt={job.company} />
                  <Bookmark
                    size={18}
                    fill="#2563eb"
                    color="#2563eb"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleRemoveSave(e, job.id)}
                  />
                </div>
                <h3>{job.title}</h3>
                <p className="companyName">{job.company}</p>
                <div className="mobileInfo">
                  <span><MapPin size={14} />{job.location}</span>
                  <span><Briefcase size={14} />{job.type}</span>
                  <span>{job.category}</span>
                </div>
                <p className="mobileDesc">{job.description}</p>
                <div className="mobileBottom">
                  <div className="salary"><DollarSign size={16} />${job.salary.toLocaleString()}/mo</div>
                  <button onClick={(e) => { e.stopPropagation(); alert(`Applying for ${job.title}`); }}>Apply</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-jobs" style={{ textAlign: 'center', padding: '40px' }}>
              <Bookmark size={48} color="#ccc" />
              <h3>No Saved Jobs Yet</h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}