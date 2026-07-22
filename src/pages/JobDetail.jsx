import "./JobDetail.css";
import {
  ArrowLeft, MapPin, Briefcase, Clock3, DollarSign, Bookmark,
  Users, Building2, CheckCircle2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom"; // 1. useParams not useLocation
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // 2. Get id from URL
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]); // 3. Need all jobs for related
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch this job
      const { data: jobData } = await supabase
       .from("jobboard-app")
       .select("*")
       .eq("id", id)
       .single();

      // Fetch all jobs for related
      const { data: allJobs } = await supabase
       .from("jobboard-app")
       .select("*");

      setJob(jobData);
      setJobs(allJobs || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <section className="jobDetail"><p>Loading...</p></section>;
  if (!job) return (
    <section className="jobDetail">
      <button className="detailBackBtn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>
      <p style={{textAlign: 'center', marginTop: '40px'}}>
        Job not found. Please go back to
        <span style={{color: '#2563eb', cursor: 'pointer'}} onClick={() => navigate('/jobs')}> Jobs</span>
      </p>
    </section>
  );

  const responsibilities = job.responsibilities || [];
  const skills = job.skills || [];
  const benefits = job.benefits || [];

  // 4. FIX: use jobs state now
  const relatedJobs = jobs
   .filter(j => j.id!== job.id && (j.category === job.category || j.company === job.company))
   .slice(0, 4);

  return (
    <section className="jobDetail">

      <div className="jobDetailLeft">
        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>

        <div className="jobHeroCard">
          <div className="jobHeroTop">
            <img
              src={`https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s/g,'')}.com`}
              alt={job.company}
              onError={(e) => e.target.src = "https://via.placeholder.com/40"}
            />
            <div className="jobHeroInfo">
              <h1>{job.title}</h1>
              <h3>{job.company}</h3>
              <div className="heroMeta">
                <span><MapPin size={15} />{job.location}</span>
                <span><Briefcase size={15} />{job.type}</span>
                <span><DollarSign size={15} />${job.salary?.toLocaleString()}/mo</span>
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

        {relatedJobs.length > 0 && (
          <div className="relatedJobsSection">
            <h2>Related Jobs</h2>
            <p>More {job.category} jobs you might be interested in</p>
            <div className="relatedJobsGrid">
              {relatedJobs.map(rJob => (
                <div
                  className="relatedCard"
                  key={rJob.id}
                  onClick={() => navigate(`/jobs/${rJob.id}`)} // 5. Navigate by ID only
                >
                  <div className="relatedCardTop">
                    <img
                      src={`https://logo.clearbit.com/${rJob.company?.toLowerCase().replace(/\s/g,'')}.com`}
                      alt={rJob.company}
                      onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                    />
                    <div>
                      <h4>{rJob.title}</h4>
                      <p>{rJob.company}</p>
                    </div>
                  </div>
                  <div className="relatedCardMeta">
                    <span><MapPin size={14} /> {rJob.location}</span>
                    <span className="salary">${rJob.salary?.toLocaleString()}/mo</span>
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
            <div><span>Posted</span><p>{new Date(job.posted_date).toDateString()}</p></div> {/* 6. snake_case */}
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
    </section>
  );
}

export default JobDetail;