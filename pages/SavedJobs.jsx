import "./AllJobs.css";
import { Bookmark, ArrowLeft, DollarSign, MapPin, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jobs as allJobs } from "./AllJobs"; // your static jobs array
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove, onSnapshot } from "firebase/firestore";

export default function SavedJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved jobs from FIREBASE and listen for changes
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);

    // onSnapshot = auto updates when you save/unsave from AllJobs page
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const savedIds = snap.data().savedJobs || [];
        // convert job.id to string to avoid "1" vs 1 mismatch
        const filtered = allJobs.filter(job => savedIds.includes(String(job.id)));
        setSavedJobs(filtered);
      }
      setLoading(false);
    });

    return () => unsub(); // cleanup
  }, [currentUser]);

  // Remove from saved in FIREBASE
  const handleRemoveSave = async (e, jobId) => {
    e.stopPropagation();
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      savedJobs: arrayRemove(String(jobId)) // make sure it's string
    });
  };

  const handleApply = (e, job) => {
    e.stopPropagation();
    if(!currentUser) navigate('/login', {state: {from: location.pathname}})
    else alert(`Applying for ${job.title}`);
  };

  if (loading) return <div className="allJobs"><p style={{textAlign: 'center', padding: '40px'}}>Loading...</p></div>

  if (!currentUser) return (
    <div className="allJobs" style={{textAlign: 'center', padding: '60px'}}>
      <Bookmark size={48} color="#ccc" />
      <h3>Please login to see saved jobs</h3>
      <button className="applyBtn" onClick={() => navigate('/login')}>Login</button>
    </div>
  )

  return (
    <section className="allJobs">
      <div className="desktopJobs">
        <div className="backHeader">
         <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span>Back</span>
          </button>
        </div>

        <div className="jobsHero">
          <h1>Your <span>Saved Jobs</span></h1>
          <p className="resultsCount">{savedJobs.length} jobs saved</p>
        </div>

        <div className="jobsContainer" style={{ gridTemplateColumns: '1fr' }}>
          <div className="jobsGrid">
            {savedJobs.length > 0? (
              savedJobs.map((job) => (
                <div className="jobCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                  <div className="jobHeader">
                    <img src={job.logo} alt={job.company} />
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
                    <button onClick={(e) => handleApply(e, job)}>Apply</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-jobs" style={{ textAlign: 'center', padding: '40px' }}>
                <Bookmark size={48} color="#ccc" />
                <h3>No Saved Jobs Yet</h3>
                <p>Click the bookmark icon on any job to save it here</p>
                <button className="applyBtn" onClick={() => navigate('/jobs')}>Browse Jobs</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE VIEW - same as yours, just replace handleRemoveSave and handleApply */}
      <div className="mobileJobs">
        <div className="mobileBack">
         <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span>Back</span>
          </button>
        </div>
        <div className="jobsHero">
          <h1>Your <span>Saved Jobs</span></h1>
        </div>
        <div className="mobileJobList">
          <p className="resultsCount">{savedJobs.length} jobs saved</p>
          {savedJobs.length > 0? (
            savedJobs.map((job) => (
              <div className="mobileCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                <div className="mobileTop">
                  <img src={job.logo} alt={job.company} />
                  <Bookmark size={18} fill="#2563eb" color="#2563eb" onClick={(e) => handleRemoveSave(e, job.id)} />
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
                  <button onClick={(e) => handleApply(e, job)}>Apply</button>
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
























