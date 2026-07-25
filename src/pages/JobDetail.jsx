import "./JobDetail.css";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock3,
  DollarSign,
  Bookmark,
  Users,
  Building2,
  CheckCircle2,
  X,
  Upload,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jobs as allJobs } from "./AllJobs"; // 1. IMPORT JOBS

const CURRENT_USER_ID = 99; // change to real logged in user id

function JobDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams(); // 2. GET ID FROM URL

  const [job, setJob] = useState(state || null); // use state if available
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false); // NEW
  const [applied, setApplied] = useState(false); // NEW
  const [resume, setResume] = useState(null); // NEW
  const [coverLetter, setCoverLetter] = useState(""); // NEW

  // 3. FALLBACK: if user refreshes, find job by ID
  useEffect(() => {
    if (!job) {
      const foundJob = allJobs.find(j => j.id === Number(id));
      setJob(foundJob || null);
    }
  }, [id, job]);

  // 4. LOAD SAVE STATE + APPLIED STATE
  useEffect(() => {
    if (job) {
      const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
      setIsSaved(savedIds.includes(job.id));

      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      const alreadyApplied = applications.some(app => app.job_id === job.id && app.user_id === CURRENT_USER_ID);
      setApplied(alreadyApplied);
    }
  }, [job]);

  if (!job) {
    return (
      <section className="jobDetail">
        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <p style={{textAlign: 'center', marginTop: '40px'}}>
          Job not found. Please go back to
          <span style={{color: '#2563eb', cursor: 'pointer'}} onClick={() => navigate('/jobs')}> Jobs</span>
        </p>
      </section>
    )
  }

  const responsibilities = job.responsibilities || [];
  const skills = job.skills || [];
  const benefits = job.benefits || [];

  // 5. SAVE TOGGLE - same as AllJobs
  const handleToggleSave = (e) => {
    e.stopPropagation();
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
  };

  // NEW: HANDLE APPLY SUBMIT
  const handleApplySubmit = () => {
    if (!resume) return;

    const application = {
      id: Date.now(),
      job_id: job.id,
      job_title: job.title,
      company: job.company,
      user_id: CURRENT_USER_ID,
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
    navigate(`/message`, {
      state: {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        recruiterId: job.recruiter_id ||
        job.company, 
        recruiterName: job.company
      }
    });
  };

  // 6. GET RELATED JOBS: same category OR same company, exclude current job
  const relatedJobs = allJobs
  .filter(j => j.id!== job.id && (j.category === job.category || j.company === job.company))
  .slice(0, 4); // show max 4

  return (
    <section className="jobDetail">

      {/* LEFT CONTENT */}
      <div className="jobDetailLeft">

        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
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
            {/* 7. SAVE BUTTON WITH STATE */}
            <button className="saveBtn" onClick={handleToggleSave}>
              <Bookmark size={20} fill={isSaved? "#16a34a" : "none"} color={isSaved? "#16a34a" : "currentColor"} />
            </button>
          </div>

          <div className="heroActions">
            {/* DESKTOP APPLY BUTTON */}
            <button
              className={`applyNowBtn ${applied? 'applied' : ''}`}
              onClick={() =>!applied && setShowApplyModal(true)}
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

        {/* 2. RELATED JOBS SECTION */}
        {relatedJobs.length > 0 && (
          <div className="relatedJobsSection">
            <h2>Related Jobs</h2>
            <p>More {job.category} jobs you might be interested in</p>

            <div className="relatedJobsGrid">
              {relatedJobs.map(rJob => (
                <div
                  className="relatedCard"
                  key={rJob.id}
                  onClick={() => navigate(`/jobs/${rJob.id}`, { state: rJob })}
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

      {/* RIGHT PANEL */}
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

      {/* MOBILE STICKY APPLY BUTTON */}
      

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