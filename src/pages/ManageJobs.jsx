import { useEffect, useState } from "react";
import "./ManageJobs.css";
import { Plus, Edit, Trash2, Users, Eye, Briefcase, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";

function ManageJobs() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  // REMOVED: const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return navigate('/login');
    fetchJobs();
  }, [currentUser]);

  const fetchJobs = async () => {
    // REMOVED: setLoading(true);
    try {
      // 1. Get all jobs for this employer
      const q = query(
        collection(db, "jobs"),
        where("companyId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));

      // 2. Get applicant count for each job
      const jobsWithCount = await Promise.all(
        jobsData.map(async (job) => {
          const appQ = query(
            collection(db, "applications"),
            where("jobId", "==", job.id)
          );
          const appSnap = await getDocs(appQ);
          return {...job, applicantCount: appSnap.size };
        })
      );

      setJobs(jobsWithCount);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    // REMOVED: setLoading(false);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteDoc(doc(db, "jobs", jobId));
      fetchJobs(); // refresh list
    }
  };

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

      {jobs.length === 0? ( // REMOVED loading check
        <div className="empty1-state">
          <Briefcase size={48} />
          <h2>No jobs posted yet</h2>
          <p>Post your first job to start hiring top talent</p>
          <button className="post-job-btn1" onClick={() => navigate('/employer/post-job')}>
            <Plus size={18} /> Post a Job
          </button>
        </div>
      ) : (
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
                <button className="btn-delete1" onClick={() => handleDelete(job.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageJobs;