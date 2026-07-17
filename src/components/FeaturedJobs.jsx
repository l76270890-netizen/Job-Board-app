import { useState } from "react";
import "./FeaturedJobs.css";
import {
  MapPin,
  Clock3,
  Bookmark,
  Briefcase,
  X
} from "lucide-react";

import { useNavigate } from "react-router-dom";
const jobs = [
  {
    id: 1,
    logo: "https://flaticon.com",
    company: "Google",
    title: "Senior Product Designer",
    location: "California, USA",
    type: "Full Time",
    posted: "2 days ago",
    salary: "$120k - $145k / year",
    description: "Lead user research initiatives and craft high-fidelity interface solutions for millions of active ecosystem products globally.",
  },
  {
    id: 2,
    logo: "https://flaticon.com",
    company: "Spotify",
    title: "Frontend Engineer",
    location: "Remote",
    type: "Remote",
    posted: "1 day ago",
    salary: "$100k - $125k / year",
    description: "Architect lightweight modular React infrastructure arrays for next-generation streaming client desktop and web dashboards.",
  },
  {
    id: 3,
    logo: "https://flaticon.com",
    company: "Notion",
    title: "Marketing Manager",
    location: "New York",
    type: "Hybrid",
    posted: "4 days ago",
    salary: "$90k - $110k / year",
    description: "Formulate data-backed retention and user growth models, directing creative deployment across multiple acquisition pipelines.",
  },
];



function FeaturedJobs() {
 const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle) => {
    console.log("Category clicked:", categoryTitle);
    // Go to jobs page and filter by category
    navigate(`/jobs?category=${encodeURIComponent(categoryTitle)}`);
  };

  const [selectedJob, setSelectedJob] = useState(null);
   
  
  return (
    <section className="featured">
      
        
      {/* ========================================== */}
      {/* 1. DESKTOP VIEW (Maintained Unchanged)     */}
      {/* ========================================== */}
      <div className="desktop-view">
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all →</a>
        </div>
        <hr />
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <div className="job-left">
              <img src={job.logo} alt="" className="company-logo" />
              <div className="job-details">
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <div className="location">
                  <MapPin size={15}/>
                  {job.location}
                </div>
              </div>
            </div>
            <div className="job-right">
              <span className="job-type">{job.type}</span>
              <span className="posted">
                <Clock3 size={14}/>
                {job.posted}
              </span>
              <Bookmark className="bookmark"/>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* 2. DYNAMIC GRID MOBILE VIEW                */}
      {/* ========================================== */}
      {/* Job Cards */}
  
  <div className="mobileJobList1"
  style={{
     position:"relative",
    top:"-410px",
    height:"77vh"
  }}>
    <hr />
     <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all</a>
        </div>

    {jobs.map((job) => (

     <div
  className="mobileCard1"
  key={job.id}
  onClick={() => navigate(`/jobs/${job.id}`, { state: job })}
>

        <div className="mobileTop1">

          <img
            src={job.logo}
            alt={job.company}
          />

         <Bookmark
  size={18}
  onClick={(e) => {
    e.stopPropagation();
  }}
/>

        </div>

        <h3>{job.title}</h3>

        <p className="companyName1">
          {job.company}
        </p>

        <div className="mobileInfo1">

          <span>
            <MapPin size={14} />
            {job.location}
          </span>

          <span>
            <Briefcase size={14} />
            {job.type}
          </span>

        </div>

        <p className="mobileDesc1">
          {job.description}
        </p>

        <div className="mobileBottom1">

          <div className="salary1">


            {job.salary}

          </div>

         <button
  onClick={(e) => {
    e.stopPropagation();
    alert(`Applying for ${job.title}`);
  }}
>
  Apply
</button>

        </div>

      </div>

    ))}

      {jobs.map((job) => (

     <div
  className="mobileCard1"
  key={job.id}
  onClick={() => navigate(`/jobs/${job.id}`, { state: job })}
>

        <div className="mobileTop1">

          <img
            src={job.logo}
            alt={job.company}
          />

         <Bookmark
  size={18}
  onClick={(e) => {
    e.stopPropagation();
  }}
/>

        </div>

        <h3>{job.title}</h3>

        <p className="companyName1">
          {job.company}
        </p>

        <div className="mobileInfo1">

          <span>
            <MapPin size={14} />
            {job.location}
          </span>

          <span>
            <Briefcase size={14} />
            {job.type}
          </span>

        </div>

        <p className="mobileDesc1">
          {job.description}
        </p>

        <div className="mobileBottom1">

          <div className="salary1">


            {job.salary}

          </div>

         <button
  onClick={(e) => {
    e.stopPropagation();
    alert(`Applying for ${job.title}`);
  }}
>
  Apply
</button>

        </div>

      </div>

    ))}
    

  </div>

    </section>
  );
}

export default FeaturedJobs;
