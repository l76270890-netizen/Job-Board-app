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
    title: "Senior Product Designer", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 2500, 
    category: "Design",
    experience: "Senior",
    postedDate: "2026-09-28",
    description: "We are looking for a Senior Product Designer to lead the design of our flagship SaaS product. You will own the end-to-end design process from user research to high-fidelity prototypes. Must have 5+ years experience with Figma, design systems, and working with product managers. You'll be working on products used by 1M+ users across Africa.",
    responsibilities: [
      "Lead product design from concept to launch",
      "Conduct user research and usability testing",
      "Create design systems and component libraries in Figma",
      "Collaborate with PMs and Engineers to ship features"
    ],
    skills: ["Figma", "UI/UX", "Design Systems", "User Research", "Prototyping"],
    benefits: ["Health Insurance", "Remote Work", "Learning Budget", "Paid Time Off"]
  },
  { 
    id: 2, 
    title: "Frontend Engineer", 
    company: "Fuzu Ltd", 
    logo: "https://logo.clearbit.com/fuzu.com",
    location: "Remote, Nigeria", 
    type: "Contract", 
    salary: 1800, 
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-25",
    description: "Join Fuzu as a Frontend Engineer to build scalable React applications. You will work on our job search platform and company pages. Required: 3+ years React, Tailwind CSS, REST APIs, and Git. Experience with performance optimization is a plus. This is a 6 month contract with possibility to extend.",
    responsibilities: [
      "Build responsive web applications using React",
      "Collaborate with designers and backend teams",
      "Optimize applications for speed and scalability",
      "Write reusable and clean components"
    ],
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git", "REST API"],
    benefits: ["Remote Work", "Flexible Hours", "Contract Bonus"]
  },
  { 
    id: 3, 
    title: "Marketing Manager", 
    company: "GIZ KE", 
    logo: "https://logo.clearbit.com/giz.de",
    location: "Abuja, Nigeria", 
    type: "Full-time", 
    salary: 2200, 
    category: "Marketing",
    experience: "Senior",
    postedDate: "2026-09-20",
    description: "GIZ Nigeria is seeking a Marketing Manager to drive awareness for our development programs. Responsibilities include campaign management, social media strategy, and stakeholder communications. Bachelor's degree in Marketing/Communications required. 4+ years experience in NGO or development sector preferred.",
    responsibilities: [
      "Develop and execute marketing campaigns",
      "Manage social media and content strategy",
      "Coordinate with stakeholders and partners",
      "Track and report campaign performance"
    ],
    skills: ["Digital Marketing", "Content Strategy", "Communication", "Analytics", "NGO"],
    benefits: ["Health Insurance", "Paid Leave", "Professional Development"]
  },
  { 
    id: 4, 
    title: "Backend Engineer", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 3000, 
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-29",
    description: "Build and scale the APIs that power TechNova's platform. Tech stack: Node.js, Express, PostgreSQL, Redis, Docker, AWS. You will design microservices, optimize database queries, and ensure 99.9% uptime. 4+ years backend experience required.",
    responsibilities: [
      "Design and build RESTful APIs",
      "Optimize database performance",
      "Deploy and maintain services on AWS",
      "Write unit and integration tests"
    ],
    skills: ["Node.js", "Express", "PostgreSQL", "Docker", "AWS", "Redis"],
    benefits: ["Health Insurance", "Remote Work", "Stock Options", "Gym Membership"]
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
