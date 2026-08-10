
import { useState, useEffect } from "react";
import "./FeaturedJobs.css";
import {
  MapPin,
  Clock3,
  Bookmark,
  Briefcase,
  Users,
  Plus,
  Eye,
  Edit,
  Loader2
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy, limit, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// 1. KEEP STATIC AS FALLBACK
export const staticJobs = [
  //... paste your static jobs here
];

function FeaturedJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userData } = useAuth();
  const [savedIds, setSavedIds] = useState([]); // NOW FROM FIREBASE LIKE ALLJOBS
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEmployer = userData?.role === 'employer';

  // 1. LISTEN TO FIREBASE SAVED JOBS - SAME AS ALLJOBS
  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setSavedIds(snap.data().savedJobs || []);
      }
    });
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    fetchFeaturedJobs(); // Runs for job seekers

    if (isEmployer && currentUser) {
      fetchEmployerData();
    }
  }, [isEmployer, currentUser, savedIds]); // re-run when savedIds changes

  const fetchFeaturedJobs = async () => { // JOB SEEKER - NOW SAME LOGIC AS ALLJOBS
    if(isEmployer) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "jobs"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
      const snapshot = await getDocs(q); // cache first = instant
      const firestoreJobs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "No Title",
          company: data.companyName || "Unknown Company",
          logo: data.companyLogo || `https://ui-avatars.com/api/?name=${data.companyName}&background=22C55E&color=fff`,
          location: data.location || "Remote",
          type: data.jobType || "Full-time",
          salary: data.salaryMax || data.salaryMin || 50000,
          category: data.category || "Other",
          experience: data.experience || "Mid-Level",
          postedDate: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          description: data.description || "",
          isFirestore: true
        }
      });

      // MERGE STATIC + FIRESTORE + CHECK SAVED - SAME AS ALLJOBS
      const allJobs = [...firestoreJobs,...staticJobs].slice(0, 6).map(job => ({
     ...job,
        is_saved: savedIds.includes(String(job.id))
      }));

      setFeaturedJobs(allJobs);
    } catch (error) {
      console.error("Error fetching featured jobs:", error);
      // FALLBACK WITH SAVED STATE
      setFeaturedJobs(staticJobs.map(job => ({...job, is_saved: savedIds.includes(String(job.id))})));
    }
    setLoading(false);
  };

  const fetchEmployerData = async () => { // EMPLOYER - UNCHANGED
    setLoading(true);
    try {
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
    } catch (error) {
      console.error("Error fetching employer data:", error);
    }
    setLoading(false);
  };

  const requireAuth = (action) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }
    action();
  }

  // 2. FIXED: NOW SAVES TO FIREBASE LIKE ALLJOBS
  const toggleSave = async (e, jobId) => {
    e.stopPropagation();
    requireAuth(async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const jobIdStr = String(jobId);
      const isSaved = savedIds.includes(jobIdStr);

      await updateDoc(userRef, {
        savedJobs: isSaved
       ? arrayRemove(jobIdStr)
          : arrayUnion(jobIdStr)
      });
      // UI updates automatically because of onSnapshot
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
    const d = date?.toDate?.() || new Date(date);
    const seconds = Math.floor((new Date() - d) / 1000);
    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours}h ago`;
    return "Today";
  }

  // EMPLOYER VIEW - 100% UNCHANGED
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
            <div className="job-card" style={{flex: 1, cursor: 'default'}}><Briefcase /> <h3>{stats.jobs || 0}</h3> <p>Active Jobs</p></div>
            <div className="job-card" style={{flex: 1, cursor: 'default'}}><Users /> <h3>{stats.applicants || 0}</h3> <p>Total Applicants</p></div>
          </div>
          <div className="featured-header"><h2>My Recent Jobs</h2><a href="/employer/jobs">Manage all →</a></div>
          {loading? <p style={{textAlign: 'center', padding: '20px'}}><Loader2 size={20} className="spin" /> Loading...</p> :
          myJobs.length === 0? <p style={{textAlign: 'center', padding: '20px'}}>No jobs posted yet</p> :
            myJobs.map((job) => (
              <div className="employer-job-card" key={job.id}>
                <div className="job-left" onClick={() => navigate(`/employer/applicants/${job.id}`)} style={{cursor: 'pointer'}}>
                  <img src={job.logo || "https://via.placeholder.com/50"} alt="" className="company-logo" />
                  <div className="job-details"><h3>{job.title}</h3><p>{job.companyName}</p><div className="location"><MapPin size={15}/>{job.location}</div></div>
                </div>
                <div className="job-right">
                  <span className="job-type">{job.jobType}</span>
                  <span className="posted"><Clock3 size={14}/>{job.applicantCount || 0} Applicants</span>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <Users size={18} style={{cursor: 'pointer'}} onClick={() => navigate(`/employer/applicants/${job.id}`)}/>
                    <Edit size={18} style={{cursor: 'pointer'}} onClick={() => navigate(`/employer/edit-job/${job.id}`)}/>
                    <Eye size={18} style={{cursor: 'pointer'}} onClick={() => navigate(`/jobs/${job.id}`)}/>
                  </div>
                </div>
              </div>
            ))
          }
          <div className="quick-actions-grid"><div className="job-card" onClick={() => navigate('/employer/post-job')}><Plus size={24} /><h3>Post a New Job</h3><p>Get applicants in 24hrs</p></div></div>
          <div className="tip-banner"><h4>💡 Pro Tip</h4><p>Jobs with salary listed get 2.3x more applicants.</p></div>
        </div>
        <div className="mobileJobList1" style={{ position:"relative", top:"-410px", height:"77vh" }}>
          <hr /><div className="featured-header"><h2>My Jobs</h2><button className="plus-btn" onClick={() => navigate('/employer/post-job')}><Plus size={16}/></button></div>
          {loading? <p style={{textAlign: 'center', padding: '20px'}}><Loader2 size={20} className="spin" /></p> :
          myJobs.map((job) => (
            <div className="mobileCard1" key={job.id} onClick={() => navigate(`/employer/applicants/${job.id}`)}>
              <div className="mobileTop1"><img src={job.logo || "https://via.placeholder.com/40"} alt={job.companyName} /><Users size={18}/></div>
              <h3>{job.title}</h3><p className="companyName1">{job.companyName}</p>
              <div className="mobileInfo1"><span><MapPin size={14} />{job.location}</span><span><Users size={14} />{job.applicantCount || 0} Applicants</span></div>
              <div className="mobileBottom1"><div className="salary1">{job.jobType}</div><div className="salary1">₦{Number(job.salaryMax || job.salaryMin || 0).toLocaleString()}/mo</div><button onClick={(e) => {e.stopPropagation(); navigate(`/employer/edit-job/${job.id}`)}}>Edit</button></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // JOBSEEKER VIEW - NOW SAME LOGIC AS ALLJOBS
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
                <img src={job.logo} alt={job.company} className="company-logo" />
                <div className="job-details">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <div className="location"><MapPin size={15}/>{job.location}</div>
                </div>
              </div>
              <div className="job-right">
                <span className="job-type">{job.type}</span>
                <span className="posted"><Clock3 size={14}/>{timeAgo(job.postedDate)}</span>
                <Bookmark
                  className="bookmark"
                  fill={job.is_saved? "#22C55E" : "none"} // CHANGED: use job.is_saved
                  color={job.is_saved? "#22C55E" : "currentColor"}
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
          <div style={{textAlign: 'center', padding: '40px'}}><Loader2 size={32} className="spin" /></div>
        ) :
          featuredJobs.map((job) => (
            <div className="mobileCard1" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
              <div className="mobileTop1">
                <img src={job.logo} alt={job.company} />
                <Bookmark
                  size={18}
                  fill={job.is_saved? "#22C55E" : "none"} // CHANGED: use job.is_saved
                  color={job.is_saved? "#22C55E" : "currentColor"}
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
