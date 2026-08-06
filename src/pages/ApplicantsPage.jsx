import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection, query, where, getDocs, doc, updateDoc, addDoc,
  getDoc, orderBy, serverTimestamp
} from "firebase/firestore";
import {
  ArrowLeft, Mail, Phone, Download, Eye, X,
  CheckCircle, XCircle, User
} from "lucide-react";
import "./ApplicantsPage.css";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Reviewed: "#3b82f6",
  Accepted: "#10b981",
  Rejected: "#ef4444"
};

export default function ApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const notifyJobseeker = async (jobseekerId, jobTitle, company, status) => {
    let title = "";
    let message = "";
    if(status === "Reviewed") { title = "Application Viewed"; message = `${company} has viewed your application for ${jobTitle}`; }
    if(status === "Accepted") { title = "You're Hired! 🎉"; message = `Congratulations! ${company} has accepted you for ${jobTitle}`; }
    if(status === "Rejected") { title = "Application Update"; message = `Your application for ${jobTitle} at ${company} was not selected this time.`; }
    if(!title) return;

    await addDoc(collection(db, "notifications"), {
      userId: jobseekerId, title, message, link: `/my-applications`,
      read: false, type: "status_update", createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const jobSnap = await getDoc(doc(db, "jobs", jobId));
      if (jobSnap.exists()) setJob({ id: jobSnap.id,...jobSnap.data() });

      const q = query(collection(db, "applications"), where("jobId", "==", jobId), orderBy("appliedAt", "desc"));
      const appSnap = await getDocs(q);
      const apps = appSnap.docs.map(d => ({ id: d.id,...d.data() }));
      console.log("Applicants from DB:", apps) // DEBUG
      setApplicants(apps);
      setLoading(false);
    };
    fetchData();
  }, [jobId]);

  const updateStatus = async (appId, newStatus) => {
    const applicant = applicants.find(a => a.id === appId);
    if(!applicant) return;
    await updateDoc(doc(db, "applications", appId), { status: newStatus });
    await notifyJobseeker(applicant.userId, job.title, job.companyName || job.company, newStatus);
    setApplicants(prev => prev.map(a => a.id === appId? {...a, status: newStatus } : a));
  };

  const filteredApplicants = filter === "All"? applicants : applicants.filter(a => a.status === filter);

  if (loading) return <div className="app-loading">Loading applicants...</div>;
  if (!job) return <div className="app-loading">Job not found</div>;

  return (
    <div className="applicants-container">
      <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /> Back to Jobs</button>

      <div className="applicants-header">
        <div><h1>Applicants for: {job.title}</h1><p>{applicants.length} Total Applications</p></div>
      </div>

      <div className="status-tabs">
        {["All", "Pending", "Reviewed", "Accepted", "Rejected"].map(s => (
          <button key={s} className={filter === s? "active" : ""} onClick={() => setFilter(s)}>
            {s} {s!== "All" && `(${applicants.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="applicants-grid">
        {filteredApplicants.length === 0? (
          <div className="no-applicants">No applicants yet. Ask people to apply</div>
        ) : (
          filteredApplicants.map(app => (
            <div key={app.id} className="applicant-card">
              <div className="applicant-top">
                <div className="applicant-info">
                  <div className="avatar">
                    {app.profilePic? <img src={app.profilePic} alt="" /> : <User size={24} />}
                  </div>
                  <div>
                    <h3>{app.applicantName || "No Name"}</h3>
                    <p className="email"><Mail size={14} /> {app.userEmail || "No Email"}</p>
                    {app.phone && <p className="phone"><Phone size={14} /> {app.phone}</p>}
                  </div>
                </div>
                <div className="status-badge" style={{ background: STATUS_COLORS[app.status] + "20", color: STATUS_COLORS[app.status] }}>
                  {app.status}
                </div>
              </div>

              {app.coverLetter && (<div className="cover-letter"><h4>Cover Letter</h4><p>{app.coverLetter}</p></div>)}

              <div className="applicant-actions">
                <button className="btn-outline" onClick={() => setSelectedApplicant(app)}><Eye size={16} /> View Profile</button>
                <div className="status-buttons">
                  <button onClick={() => updateStatus(app.id, "Reviewed")}><Eye size={14} /> Review</button>
                  <button className="accept" onClick={() => updateStatus(app.id, "Accepted")}><CheckCircle size={14} /> Accept</button>
                  <button className="reject" onClick={() => updateStatus(app.id, "Rejected")}><XCircle size={14} /> Reject</button>
                </div>
              </div>

              <div className="applied-date">Applied: {app.appliedAt?.toDate().toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>

      {selectedApplicant && (
        <div className="modal-overlay" onClick={() => setSelectedApplicant(null)}>
          <div className="applicant-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Applicant Profile</h2><X size={22} onClick={() => setSelectedApplicant(null)} /></div>
            <div className="modal-body">
              <div className="applicant-profile-top">
                <img src={selectedApplicant.profilePic || `https://ui-avatars.com/api/?name=${selectedApplicant.applicantName}`} className="applicant-modal-avatar"/>
                <div><h3>{selectedApplicant.applicantName}</h3><p><Mail size={14} /> {selectedApplicant.userEmail}</p><p><Phone size={14} /> {selectedApplicant.phone || "Not provided"}</p></div>
              </div>
              {selectedApplicant.bio && (<div className="profile-section"><h4>About</h4><p>{selectedApplicant.bio}</p></div>)}
              {selectedApplicant.skills?.length > 0 && (<div className="profile-section"><h4>Skills</h4><div className="skills-tags">{selectedApplicant.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}</div></div>)}
              {selectedApplicant.resumeUrl? (<a href={selectedApplicant.resumeUrl} download={selectedApplicant.resumeName} target="_blank" className="btn-view-resume"><Download size={16} /> Download CV: {selectedApplicant.resumeName}</a>) : <p className="no-resume">No CV uploaded</p>}
              <div className="modal-actions">
                <button className="accept" onClick={() => {updateStatus(selectedApplicant.id, "Accepted"); setSelectedApplicant(null)}}><CheckCircle size={14} /> Accept</button>
                <button className="reject" onClick={() => {updateStatus(selectedApplicant.id, "Rejected"); setSelectedApplicant(null)}}><XCircle size={14} /> Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}