import { useEffect, useState } from "react";
import "./ManageJobs.css";
import { Plus, Edit, Trash2, Users, Eye, Briefcase, MapPin, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, onSnapshot } from "firebase/firestore";

function ManageJobs() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return navigate('/login');
    fetchJobs();
  }, [currentUser]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "jobs"),
        where("companyId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      // 1. GET JOBS - cache first = instant
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
        ...data,
          // Normalize fields to match AllJobs
          company: data.companyName,
          type: data.jobType,
          salary: data.salaryMax || data.salaryMin || 0,
          postedDate: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        }
      });

      if (jobsData.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // 2. GET ALL APPLICANT COUNTS IN 1 QUERY - SAME AS BEFORE
      const jobIds = jobsData.map(j => j.id);
      // Firestore "in" query max 10. If you have >10 jobs, chunk it
      const chunks = [];
      for(let i = 0; i < jobIds.length; i += 10) {
        chunks.push(jobIds.slice(i, i + 10));
      }

      let allApps = [];
      for(const chunk of chunks) {
        const appQ = query(collection(db, "applications"), where("jobId", "in", chunk));
        const appSnap = await getDocs(appQ);
        allApps = [...allApps,...appSnap.docs];
      }

      // Count applicants per job
      const counts = {};
      allApps.forEach(doc => {
        const jobId = doc.data().jobId;
        counts[jobId] = (counts[jobId] || 0) + 1;
      });

      const jobsWithCount = jobsData.map(job => ({
    ...job,
        applicantCount: counts[job.id] || 0
      }));

      setJobs(jobsWithCount);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);

    // 3. ADD REALTIME LISTENER - SAME AS ALLJOBS onSnapshot
    const q = query(
      collection(db, "jobs"),
      where("companyId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, async (snapshot) => {
      const jobsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
        ...data,
          company: data.companyName,
          type: data.jobType,
          salary: data.salaryMax || data.salaryMin || 0,
          postedDate: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        }
      });

      if(jobsData.length > 0) {
        const jobIds = jobsData.map(j => j.id);
        const chunks = [];
        for(let i = 0; i < jobIds.length; i += 10) chunks.push(jobIds.slice(i, i + 10));

        let allApps = [];
        for(const chunk of chunks) {
          const appQ = query(collection(db, "applications"), where("jobId", "in", chunk));
          const appSnap = await getDocs(appQ);
          allApps = [...allApps,...appSnap.docs];
        }
        const counts = {};
        allApps.forEach(doc => { counts[doc.data().jobId] = (counts[doc.data().jobId] || 0) + 1; });

        setJobs(jobsData.map(job => ({...job, applicantCount: counts[job.id] || 0})));
      } else {
        setJobs([]);
      }
      setLoading(false);
    });

    return () => unsub(); // cleanup
  };

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this job?")) {
      // Optimistic update: remove from UI immediately like AllJobs
      setJobs(prev => prev.filter(j => j.id!== jobId));
      await deleteDoc(doc(db, "jobs", jobId));
    }
  };

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

  if (loading) return (
    <div className="manage1-container">
      <div className="empty1-state">
        <Loader2 size={32} className="spin" />
        <p>Loading your jobs...</p>
      </div>
    </div>
  )

  return (
    <div className="manage1-container">
      <button className="detailBackBtn1" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>
      <div className="manage1-header">
        <div>
          <h1>Manage Jobs</h1>
          <p>{jobs.length} Active Job{jobs.length!== 1 && 's'} Posted</p>
        </div>
        <button className="post-job-btn1" onClick={() => navigate('/employer/post-job')}>
          <Plus size={18} /> Post New Job
        </button>
      </div>

      {jobs.length === 0? (
        <div className="empty1-state">
          <Briefcase size={48} />
          <h2>No jobs posted yet</h2>
          <p>Post your first job to start hiring top talent</p>
          <button className="post-job-btn1" onClick={() => navigate('/employer/post-job')}>
            <Plus size={18} /> Post a Job
          </button>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW */}
          <div className="desktop-manage-jobs">
            <div className="jobs-grid1">
              {jobs.map(job => (
                <div key={job.id} className="job-card1">
                  <div className="job-card-header1">
                    <div>
                      <span className={`status-badge1 ${job.status?.toLowerCase()}`}>{job.status || "Active"}</span>
                      <h3>{job.title}</h3>
                    </div>
                    <div className="applicants-count1">
                      <Users size={16} />
                      <span>{job.applicantCount} Applicants</span>
                    </div>
                  </div>

                  <div className="job-card-meta1">
                    <span><Briefcase size={14} /> {job.jobType}</span>
                    <span><MapPin size={14} /> {job.location}</span>
                    <span><Calendar size={14} /> {job.deadline? new Date(job.deadline).toLocaleDateString() : "No deadline"}</span>
                  </div>

                  <p className="job-description1">{job.description?.slice(0, 120)}...</p>

                  <div className="job-card-actions1">
                    <button className="btn-applicants1" onClick={() => navigate(`/employer/applicants/${job.id}`)}>
                      <Users size={16} /> Applicants
                    </button>
                    <button className="btn-edit1" onClick={() => navigate(`/employer/edit-job/${job.id}`)}>
                      <Edit size={16} /> Edit
                    </button>
                    <button className="btn-delete1" onClick={(e) => handleDelete(e, job.id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="mobile-manage-jobs">
            {jobs.map(job => (
              <div key={job.id} className="mobile-job-card1" onClick={() => navigate(`/employer/applicants/${job.id}`)}>
                <div className="mobile-job-top1">
                  <div>
                    <span className={`status-badge1 ${job.status?.toLowerCase()}`}>{job.status || "Active"}</span>
                    <h3>{job.title}</h3>
                  </div>
                  <div className="mobile-job-actions1">
                    <Eye size={18} onClick={(e) => {e.stopPropagation(); navigate(`/jobs/${job.id}`)}}/>
                    <Edit size={18} onClick={(e) => {e.stopPropagation(); navigate(`/employer/edit-job/${job.id}`)}}/>
                    <Trash2 size={18} color="red" onClick={(e) => handleDelete(e, job.id)}/>
                  </div>
                </div>

                <p className="companyName1">{job.companyName}</p>

                <div className="mobile-job-meta1">
                  <span><MapPin size={14} />{job.location}</span>
                  <span><Briefcase size={14} />{job.jobType}</span>
                  <span><Users size={14} />{job.applicantCount}</span>
                </div>

                <p className="mobile-job-desc1">{job.description?.slice(0, 100)}...</p>

                <div className="mobile-job-bottom1">
                  <span className="posted1"><Calendar size={14} /> {timeAgo(job.createdAt)}</span>
                  <button onClick={(e) => {e.stopPropagation(); navigate(`/employer/applicants/${job.id}`)}}>
                    View Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageJobs;