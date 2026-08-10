import { useState, useEffect } from "react";
import "./FeaturedJobs.css";
import {
  MapPin,
  Clock3,
  Bookmark,
  Briefcase,
  DollarSign,
  Users,
  Plus,
  Eye,
  Edit,
  WifiOff,
  Loader2
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase"; 
import { collection, query, where, getDocs, getDocsFromServer, orderBy, limit } from "firebase/firestore"; // ADDED getDocsFromServer

export const staticJobs = [
  // ... keep rest of your static jobs here
];

function FeaturedJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userData } = useAuth();
  const [savedIds, setSavedIds] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // ADDED

  const isEmployer = userData?.role === 'employer';

  // Track internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
    setSavedIds(saved);

    fetchFeaturedJobs(); // Only for job seekers

    if (isEmployer && currentUser) {
      fetchEmployerData();
    }
  }, [isEmployer, currentUser, isOnline]); // re-run when internet comes back

  const fetchFeaturedJobs = async () => {
    if (isEmployer) return; // don't run for employer

    setLoading(true);
    try {
      if (!isOnline) throw new Error("offline"); // force error if offline

      const q = query(
        collection(db, "jobs"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
      // CHANGED: Force server fetch for speed + fresh data
      const snapshot = await getDocsFromServer(q); 
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
       ...doc.data(),
        company: doc.data().companyName,
        type: doc.data().jobType,
        salary: doc.data().salaryMax || doc.data().salaryMin || 0,
        postedDate: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
        logo: doc.data().companyLogo || `https://ui-avatars.com/api/?name=${doc.data().companyName}&background=22C55E&color=fff`
      }));

      setFeaturedJobs(jobsData.length > 0 ? jobsData : staticJobs);
    } catch (error) {
      console.error("Error fetching featured jobs:", error);
      if (!isOnline) {
        setFeaturedJobs([]); // show empty + no internet UI
      } else {
        setFeaturedJobs(staticJobs); // fallback if online but error
      }
    }
    setLoading(false);
  };

  const fetchEmployerData = async () => {
    // EMPLOYER VIEW STAYS THE SAME - uses cache for speed
    const jobsQ = query(collection(db, "jobs"), where("companyId", "==", currentUser.uid));
    const jobsSnap = await getDocs(jobsQ);
    const jobsData = jobsSnap.docs.map(d => ({ id: d.id,...d.data() }));

    const appsQ = query(collection(db, "applications"), where("employerId", "==", currentUser.uid));
    const appsSnap = await getDocs(appsQ);

    const jobsWithCount = jobsData.map(job => ({
     ...job,
      applicantCount: appsSnap.docs.filter(app => app.data().jobId === job.id).length
    }))

    setMyJobs(jobsWithCount.slice(0, 5));
    setStats({ jobs: jobsData.length, applicants: appsSnap.size });
  };

  const requireAuth = (action) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }
    action();
  }

  const toggleSave = (e, jobId) => {
    e.stopPropagation();
    requireAuth(() => {
      let newSavedIds;
      if (savedIds.includes(jobId)) {
        newSavedIds = savedIds.filter(id => String(id) !== String(jobId));
      } else {
        newSavedIds = [...savedIds, jobId];
      }
      setSavedIds(newSavedIds);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
    })
  };

  const handleApplyClick = (e, job) => {
    e.stopPropagation();
    requireAuth(() => {
      navigate(`/jobs/${job.id}`, { state: job });
    })
  }

  const timeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours}h ago`;
    return "Today";
  }

  // EMPLOYER VIEW - UNCHANGED
  if (isEmployer) {
    return (
     <section className="employer-featured">
        <div className="desktop-view">
          <div className="featured-header">
            <h2>Welcome back, {userData?.companyName || "Employer"}</h2>
            <button className="post-job-btn" onClick={() => navigate('/employer/post-job')}>
              <Plus size={16} /> Post New Job
            </button>
          </div>
          <hr />

          <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
            <div className="job-card" style={{flex: 1, cursor: 'default'}}>
              <Briefcase /> <h3>{stats.jobs || 0}</h3> <p>Active Jobs</p>
            </div>
            <div className="job-card" style={{flex: 1, cursor: 'default'}}>
              <Users /> <h3>{stats.applicants || 0}</h3> <p>Total Applicants</p>
            </div>
          </div>

          <div className="featured-header">
            <h2>My Recent Jobs</h2>
            <a href="/employer/jobs">Manage all →</a>
          </div>

          {myJobs.length === 0? <p style={{textAlign: 'center', padding: '20px'}}>No jobs posted yet</p> :
            myJobs.map((job) => (
              <div className="employer-job-card" key={job.id}>
                <div className="job-left" onClick={() => navigate(`/employer/applicants/${job.id}`)} style={{cursor: 'pointer'}}>
                  <img src={job.logo || "https://via.placeholder.com/50"} alt="" className="company-logo" />
                  <div className="job-details">
                    <h3>{job.title}</h3>
                    <p>{job.companyName}</p>
                    <div className="location">
                      <MapPin size={15}/>
                      {job.location}
                    </div>
                  </div>
                </div>
                <div className="job-right">
                  <span className="job-type">{job.jobType}</span>
                  <span className="posted">
                    <Clock3 size={14}/>
                    {job.applicantCount || 0} Applicants
                  </span>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <Users size={18} style={{cursor: 'pointer'}} onClick={() => navigate(`/employer/applicants/${job.id}`)}/>
                    <Edit size={18} style={{cursor: 'pointer'}} onClick={() => navigate(`/employer/edit-job/${job.id}`)}/>
                    <Eye size={18} style={{cursor: 'pointer'}} onClick={() => navigate(`/jobs/${job.id}`)}/>
                  </div>
                </div>
              </div>
            ))
          }

          <div className="quick-actions-grid">
            <div className="job-card" onClick={() => navigate('/employer/post-job')}>
              <Plus size={24} />
              <h3>Post a New Job</h3>
              <p>Get applicants in 24hrs</p>
            </div>
          </div>

          <div className="tip-banner">
            <h4>💡 Pro Tip</h4>
            <p>Jobs with salary listed get 2.3x more applicants.</p>
          </div>
        </div>

        <div className="mobileJobList1" style={{ position:"relative", top:"-410px", height:"77vh" }}>
          <hr />
          <div className="featured-header">
            <h2>My Jobs</h2>
            <button className="plus-btn" onClick={() => navigate('/employer/post-job')}><Plus size={16}/></button>
          </div>
          {myJobs.map((job) => (
            <div className="mobileCard1" key={job.id} onClick={() => navigate(`/employer/applicants/${job.id}`)}>
              <div className="mobileTop1">
                <img src={job.logo || "https://via.placeholder.com/40"} alt={job.companyName} />
                <Users size={18}/>
              </div>
              <h3>{job.title}</h3>
              <p className="companyName1">{job.companyName}</p>
              <div className="mobileInfo1">
                <span><MapPin size={14} />{job.location}</span>
                <span><Users size={14} />{job.applicantCount || 0} Applicants</span>
              </div>
              <div className="mobileBottom1">
                <div className="salary1">{job.jobType}</div>
                 <div className="salary1">₦{Number(job.salaryMax || job.salaryMin || 0).toLocaleString()}/mo</div>
                <button onClick={(e) => {e.stopPropagation(); navigate(`/employer/edit-job/${job.id}`)}}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // JOBSEEKER VIEW - NOW INTERNET ONLY
  if (!isOnline) return ( // ADDED
    <section className="featured">
      <div className="desktop-view">
        <div className="featured-header"><h2>Featured Jobs</h2></div>
        <hr />
        <div style={{textAlign: 'center', padding: '40px'}}>
          <WifiOff size={48} />
          <h3>No Internet Connection</h3>
          <p>Connect to see the latest jobs</p>
        </div>
      </div>
      <div className="mobileJobList1" style={{ position:"relative", top:"-410px", height:"77vh" }}>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <WifiOff size={40} />
          <h3>No Internet</h3>
        </div>
      </div>
    </section>
  )

  return (
    <section className="featured">
      <div className="desktop-view">
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all →</a>
        </div>
        <hr />
        {loading? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <Loader2 size={32} className="spin" />
            <p>Loading jobs...</p>
          </div>
        ) : 
          featuredJobs.map((job) => (
            <div className="job-card" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
              <div className="job-left">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="company-logo"
                />
                <div className="job-details">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <div className="location">
                    <MapPin size={15}/>
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="job-right">
                <span className="job-type">{job.type}</span>
                <span className="posted">
                  <Clock3 size={14}/>
                  {timeAgo(job.postedDate)}
                </span>
                <Bookmark 
                  className="bookmark"
                  fill={savedIds.includes(String(job.id)) ? "#22C55E" : "none"}
                  color={savedIds.includes(String(job.id)) ? "#22C55E" : "currentColor"}
                  onClick={(e) => toggleSave(e, job.id)}
                />
              </div>
            </div>
          ))
        }
      </div>

      <div className="mobileJobList1" style={{ position:"relative", top:"-410px", height:"77vh" }}>
        <hr />
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all</a>
        </div>

        {loading? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <Loader2 size={32} className="spin" />
          </div>
        ) :
          featuredJobs.map((job) => (
            <div className="mobileCard1" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
              <div className="mobileTop1">
                <img src={job.logo} alt={job.company} />
                <Bookmark
                  size={18}
                  fill={savedIds.includes(String(job.id)) ? "#22C55E" : "none"}
                  color={savedIds.includes(String(job.id)) ? "#22C55E" : "currentColor"}
                  onClick={(e) => toggleSave(e, job.id)}
                />
              </div>

              <h3>{job.title}</h3>
              <p className="companyName1">{job.company}</p>

              <div className="mobileInfo1">
                <span><MapPin size={14} />{job.location}</span>
                <span><Briefcase size={14} />{job.type}</span>
              </div>

              <p className="mobileDesc1">{job.description?.slice(0, 100)}...</p>

              <div className="mobileBottom1">
                <div className="salary1">₦{Number(job.salary).toLocaleString()}/mo</div>
                <button onClick={(e) => handleApplyClick(e, job)}>Apply</button>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  );
}

export default FeaturedJobs;