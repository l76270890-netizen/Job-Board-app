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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { jobs } from "./AllJobs"; // IMPORT YOUR JOBS ARRAY

function JobDetail() {
  const navigate = useNavigate();
  const { state: job } = useLocation(); // GET JOB DATA FROM ALLJOBS

  // Fallback if user refreshes page
  if (!job) {
    return (
      <section className="jobDetail">
        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <p style={{textAlign: 'center', marginTop: '40px'}}>
          Job not found. Please go back to 
          <span style={{color: '#2563eb', cursor: 'pointer'}} onClick={() => navigate('/all-jobs')}> Jobs</span>
        </p>
      </section>
    )
  }

  // USE DATA FROM THE JOB OBJECT INSTEAD OF HARDCODED
  const responsibilities = job.responsibilities || [];
  const skills = job.skills || [];
  const benefits = job.benefits || [];

  // 1. GET RELATED JOBS: same category OR same company, exclude current job
  const relatedJobs = jobs
    .filter(j => j.id !== job.id && (j.category === job.category || j.company === job.company))
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
            <button className="saveBtn"><Bookmark size={20} /></button>
          </div>

          <div className="heroActions">
            <button className="applyNowBtn" onClick={() => alert(`Applied for ${job.title}`)}>
              Apply Now
            </button>
            <button className="messageBtn">Message Recruiter</button>
          </div>
        </div>

        <div className="detailCard">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        <div className="detailCard">
          <h2>Responsibilities</h2>
          <div className="responsibilityList">
            {responsibilities.length > 0 ? responsibilities.map((item, index) => (
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
            {skills.length > 0 ? skills.map((skill, index) => (
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
            {benefits.length > 0 ? benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            )) : <li>No benefits listed</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JobDetail;