import "./JobDetail.css";
import {
  ArrowLeft, MapPin, Briefcase, Clock3, Bookmark, Users, Building2, CheckCircle2, X, Upload,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jobs as allJobs } from "./AllJobs";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function JobDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const { currentUser, userData } = useAuth(); // ADDED userData

  const [job, setJob] = useState(state || null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(!state);
  const [submitting, setSubmitting] = useState(false);

  // 1. CREATE NOTIFICATION FUNCTION - ADDED
  const createNotification = async (employerId, jobTitle, applicantName, jobId) => {
    if (!employerId) return;
    await addDoc(collection(db, "notifications"), {
      userId: employerId, // Who receives it
      title: "New Application",
      message: `${applicantName} applied for ${jobTitle}`,
      link: `/employer/applicants/${jobId}`, // Where clicking takes them
      read: false,
      type: "application",
      createdAt: serverTimestamp(),
    });
  };

  // 1. FETCH JOB: check static first, then Firestore
  useEffect(() => {
    const fetchJob = async () => {
      let foundJob = allJobs.find(j => String(j.id) === String(id));

      if (!foundJob) {
        setLoading(true);
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          foundJob = {
            id: docSnap.id,
            title: data.title,
            company: data.companyName,
            logo: "https://via.placeholder.com/40",
            location: data.location || "Remote",
            type: data.jobType,
            salary: data.salaryMax || data.salaryMin || 50000,
            category: data.category,
            experience: data.experience || "Mid-Level",
            postedDate: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            description: data.description,
            responsibilities: [],
            skills: data.requirements || [],
            benefits: data.benefits || [],
            companyId: data.companyId || data.employerId // IMPORTANT for notifications
          }
        }
        setLoading(false);
      }

      setJob(foundJob || null);
      window.scrollTo(0, 0);
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!job ||!currentUser) return;

    const checkApplication = async () => {
      const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
      setIsSaved(savedIds.includes(job.id));

      const q = query(
        collection(db, "applications"),
        where("jobId", "==", job.id),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      setApplied(!snapshot.empty);
    }
    checkApplication();
  }, [job, currentUser]);

  if (loading) return <p style={{textAlign: 'center', marginTop: '40px'}}>Loading job...</p>
  if (!job) {
    return (
      <section className="jobDetail">
        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <p style={{textAlign: 'center', marginTop: '40px'}}>
          Job not found. Please go back to <span style={{color: '#2563eb', cursor: 'pointer'}} onClick={() => navigate('/jobs')}> Jobs</span>
        </p>
      </section>
    )
  }

  const responsibilities = job.responsibilities || [];
  const skills = job.skills || [];
  const benefits = job.benefits || [];

  const requireAuth = (action) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }
    action();
  }

  const handleToggleSave = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
      let newSavedIds;
      if (savedIds.includes(job.id)) {
        newSavedIds = savedIds.filter(id => String(id)!== String(job.id));
        setIsSaved(false);
      } else {
        newSavedIds = [...savedIds, job.id];
        setIsSaved(true);
      }
      localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
    })
  };

  const handleApplyClick = () => {
    requireAuth(() => {
      if (!applied) setShowApplyModal(true)
    })
  }

  // UPDATED: Real Firestore submit + NOTIFICATION
const handleApplySubmit = async () => {
  if (!resume) return alert("Please upload your resume");

  setSubmitting(true);
  try {
    const applicantName = userData?.name || currentUser.displayName || currentUser.email;

    // 1. CONVERT RESUME TO BASE64 URL - so employer can view it
    const resumeUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(resume);
    });

    // 2. GET FULL JOBSEEKER PROFILE
    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
    const userProfile = userSnap.data() || {};

    // 3. Save application to Firestore with ALL details
    await addDoc(collection(db, "applications"), {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      employerId: job.companyId,
      
      userId: currentUser.uid,
      applicantName: applicantName,
      userEmail: currentUser.email,
      phone: userProfile.phone || "",
      bio: userProfile.bio || "",
      skills: userProfile.skills || [],
      profilePic: userProfile.photoURL || "",
      
      resumeName: resume.name,
      resumeUrl: resumeUrl, // NOW EMPLOYER CAN VIEW IT
      coverLetter: coverLetter,
      status: "Pending",
      appliedAt: serverTimestamp()
    });

    // 4. SEND NOTIFICATION TO EMPLOYER
    await createNotification(job.companyId, job.title, applicantName, job.id);

    setApplied(true);
    setShowApplyModal(false);
    setResume(null);
    setCoverLetter("");

    alert(`✅ Application Submitted Successfully!\n\nYour application for "${job.title}" at ${job.company} has been sent.`);

  } catch (error) {
    console.error("Error applying:", error);
    alert("Failed to submit application. Please try again.");
  }
  setSubmitting(false);
};

  const handleMessageRecruiter = () =>{
    requireAuth(() => {
      navigate(`/message`, {
        state: { jobId: job.id, jobTitle: job.title, company: job.company, recruiterId: job.companyId, recruiterName: job.company }
      });
    })
  };

  return (
    <section className="jobDetail">
      <div className="jobDetailLeft">
        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>

        <div className="jobHeroCard">
          <div className="jobHeroTop">
            <img src={job.logo} alt={job.company} />
            <div className="jobHeroInfo">
              <h1>{job.title}</h1>
              <h3>{job.company}</h3>
              <div className="heroMeta">
                <span><MapPin size={15} />{job.location}</span>
                <span><Briefcase size={15} />{job.type}</span>
                <span>₦{job.salary.toLocaleString()}/mo</span>
              </div>
            </div>
            <button className="saveBtn" onClick={handleToggleSave}>
              <Bookmark size={20} fill={isSaved? "#16a34a" : "none"} color={isSaved? "#16a34a" : "currentColor"} />
            </button>
          </div>

          <div className="heroActions">
            <button
              className={`applyNowBtn ${applied? 'applied' : ''}`}
              onClick={handleApplyClick}
              disabled={applied}
            >
              {applied? <><CheckCircle2 size={18} /> Applied</> : "Apply Now"}
            </button>
            <button className="messageBtn" onClick={handleMessageRecruiter}>Message Recruiter</button>
          </div>
        </div>

        <div className="detailCard">
          <h2>Job Description</h2>
          <p style={{whiteSpace: "pre-line"}}>{job.description}</p>
        </div>

        <div className="detailCard">
          <h2>Responsibilities</h2>
          <div className="responsibilityList">
            {responsibilities.length > 0? responsibilities.map((item, index) => (
              <div className="responsibilityItem" key={index}>
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </div>
            )) : <p>No responsibilities listed</p>}
          </div>
        </div>

        <div className="detailCard">
          <h2>Required Skills</h2>
          <div className="skillsWrap">
            {skills.length > 0? skills.map((skill, index) => (
              <span key={index}>{skill}</span>
            )) : <p>No skills listed</p>}
          </div>
        </div>

      </div>

      <div className="jobDetailRight">
        <div className="sideCard">
          <h3>Job Overview</h3>
          <div className="overviewItem">
            <Clock3 size={18} />
            <div><span>Posted</span><p>{new Date(job.postedDate).toDateString()}</p></div>
          </div>
          <div className="overviewItem">
            <Users size={18} />
            <div><span>Experience</span><p>{job.experience}</p></div>
          </div>
          <div className="overviewItem">
            <Building2 size={18} />
            <div><span>Category</span><p>{job.category}</p></div>
          </div>
        </div>

        <div className="sideCard">
          <h3>Company Benefits</h3>
          <ul>
            {benefits.length > 0? benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            )) : <li>No benefits listed</li>}
          </ul>
        </div>
      </div>

      {/* APPLY POPUP MODAL */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <X size={22} onClick={() => setShowApplyModal(false)} className="close-icon" />
            </div>

            <div className="modal-body">
              <p className="modal-subtext">at {job.company}</p>

              <label className="form-label">Upload Resume *</label>
              <label className="upload-box">
                <Upload size={20} />
                <span>{resume? resume.name : "Click to upload PDF, DOC, DOCX"}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  hidden
                />
              </label>

              <label className="form-label">Cover Letter - Optional</label>
              <textarea
                placeholder="Why are you a good fit for this role?"
                rows="4"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="cover-letter-input"
              />
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowApplyModal(false)}>Cancel</button>
              <button
                className="btn-submit"
                onClick={handleApplySubmit}
                disabled={!resume || submitting}
              >
                {submitting? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default JobDetail;
