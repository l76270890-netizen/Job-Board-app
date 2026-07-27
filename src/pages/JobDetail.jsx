import "./JobDetail.css";
import {
  ArrowLeft, MapPin, Briefcase, Clock3, DollarSign, Bookmark, Users, Building2, CheckCircle2, X, Upload,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jobs as allJobs } from "./AllJobs";
import { useAuth } from "../context/AuthContext"; // 1. IMPORT

function JobDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const { currentUser } = useAuth(); // 2. GET USER

  const [job, setJob] = useState(state || null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const foundJob = allJobs.find(j => j.id === Number(id));
    setJob(foundJob || null);
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!job) return;
    const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    setIsSaved(savedIds.includes(job.id));

    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const alreadyApplied = applications.some(app => app.job_id === job.id && app.user_id === currentUser?.uid); // 3. USE FIREBASE UID
    setApplied(alreadyApplied);

    let filtered = allJobs.filter(j => j.id!== job.id);
    let related = filtered.filter(j => j.category === job.category);
    if (related.length < 5) {
      const sameLocation = filtered.filter(j => j.location === job.location &&!related.find(r => r.id === j.id));
      related = [...related,...sameLocation];
    }
    if (related.length < 5) {
      const randomJobs = filtered.filter(j =>!related.find(r => r.id === j.id));
      related = [...related,...randomJobs];
    }
    setRelatedJobs(related.slice(0, 5));
  }, [job, currentUser]); // 4. ADD currentUser

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

  // 5. NEW: LOGIN CHECK FUNCTION
  const requireAuth = (action) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }
    action(); // run the action if logged in
  }

  const handleToggleSave = (e) => {
    e.stopPropagation();
    requireAuth(() => { // WRAP WITH LOGIN CHECK
      const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
      let newSavedIds;
      if (savedIds.includes(job.id)) {
        newSavedIds = savedIds.filter(id => id!== job.id);
        setIsSaved(false);
      } else {
        newSavedIds = [...savedIds, job.id];
        setIsSaved(true);
      }
      localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
    })
  };

  const handleApplyClick = () => { // 6. NEW FUNCTION FOR BUTTON
    requireAuth(() => {
      if (!applied) setShowApplyModal(true)
    })
  }

  const handleApplySubmit = () => {
    if (!resume) return;
    const application = {
      id: Date.now(),
      job_id: job.id,
      job_title: job.title,
      company: job.company,
      user_id: currentUser.uid, // 7. USE FIREBASE UID
      resume_name: resume.name,
      cover_letter: coverLetter,
      applied_at: new Date().toISOString(),
      status: "pending"
    };
    const applications = JSON.parse(localStorage.getItem("applications")) || [];
    localStorage.setItem("applications", JSON.stringify([...applications, application]));
    setApplied(true);
    setShowApplyModal(false);
    setResume(null);
    setCoverLetter("");
  };

  const handleMessageRecruiter = () =>{
    requireAuth(() => { // WRAP WITH LOGIN CHECK
      navigate(`/message`, {
        state: { jobId: job.id, jobTitle: job.title, company: job.company, recruiterId: job.recruiter_id || job.company, recruiterName: job.company }
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
                <span><DollarSign size={15} />${job.salary.toLocaleString()}/mo</span>
              </div>
            </div>
            <button className="saveBtn" onClick={handleToggleSave}>
              <Bookmark size={20} fill={isSaved? "#16a34a" : "none"} color={isSaved? "#16a34a" : "currentColor"} />
            </button>
          </div>

          <div className="heroActions">
            <button
              className={`applyNowBtn ${applied? 'applied' : ''}`}
              onClick={handleApplyClick} // 8. USE NEW FUNCTION
              disabled={applied}
            >
              {applied? <><CheckCircle2 size={18} /> Applied</> : "Apply Now"}
            </button>
            <button className="messageBtn" onClick={handleMessageRecruiter}>Message Recruiter</button>
          </div>
        </div>
 <div className="detailCard">
          <h2>Job Description</h2>
          <p>{job.description}</p>
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

        {/* RELATED JOBS SECTION */}
        {relatedJobs.length > 0 && (
          <div className="relatedJobsSection">
            <h2>Related Jobs</h2>
            <p>More jobs you might be interested in</p>

            <div className="relatedJobsGrid">
              {relatedJobs.map(rJob => (
                <div
                  className="relatedCard"
                  key={rJob.id}
                  onClick={() => navigate(`/jobs/${rJob.id}`)} // FIX 3: just navigate by id
                >
                  <div className="relatedCardTop">
                    <img src={rJob.logo} alt={rJob.company} />
                    <div>
                      <h4>{rJob.title}</h4>
                      <p>{rJob.company}</p>
                    </div>
                  </div>
                  <div className="relatedCardMeta">
                    <span><MapPin size={14} /> {rJob.location}</span>
                    <span className="salary">${rJob.salary.toLocaleString()}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                disabled={!resume}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default JobDetail;