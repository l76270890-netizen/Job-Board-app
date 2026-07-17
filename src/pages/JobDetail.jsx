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
import { useNavigate, useLocation } from "react-router-dom"; // ADD useLocation

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
        <p style={{textAlign: 'center', marginTop: '40px'}}>Job not found. Please go back to <span style={{color: '#2563eb', cursor: 'pointer'}} onClick={() => navigate('/jobs')}>Jobs</span></p>
      </section>
    )
  }

  const responsibilities = [
    "Build responsive web applications",
    "Collaborate with designers and backend teams",
    "Optimize applications for speed",
    "Write reusable clean components",
  ];

  const skills = ["React", "JavaScript", "TypeScript", "CSS", "Git", "REST API"];

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
            {responsibilities.map((item, index) => (
              <div className="responsibilityItem" key={index}>
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detailCard">
          <h2>Required Skills</h2>
          <div className="skillsWrap">
            {skills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
        </div>
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
            <div><span>Experience</span><p>{job.experience} Level</p></div>
          </div>
          <div className="overviewItem">
            <Building2 size={18} />
            <div><span>Category</span><p>{job.category}</p></div>
          </div>
        </div>

        <div className="sideCard">
          <h3>Company Benefits</h3>
          <ul>
            <li>Remote Work</li>
            <li>Health Insurance</li>
            <li>Flexible Hours</li>
            <li>Learning Budget</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JobDetail;