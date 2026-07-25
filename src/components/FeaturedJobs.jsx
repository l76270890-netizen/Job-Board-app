import { useState, useEffect } from "react";
import "./FeaturedJobs.css";
import {
  MapPin,
  Clock3,
  Bookmark,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const jobs = [
  { 
    id: 2, 
    title: "Senior Product Designer", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 2500, 
    category: "Design",
    experience: "Senior",
    featured: true, // <-- ADDED
    postedDate: "2026-09-28",
    description: "We are looking for a Senior Product Designer to lead the design of our flagship SaaS product. You will own the end-to-end design process from user research to high-fidelity prototypes.",
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
    id: 3, 
    title: "Frontend Engineer", 
    company: "Fuzu Ltd", 
    logo: "https://logo.clearbit.com/fuzu.com",
    location: "Remote, Nigeria", 
    type: "Contract", 
    salary: 1800, 
    category: "Engineering",
    experience: "Mid-Level",
    featured: true, // <-- ADDED
    postedDate: "2026-09-25",
    description: "Join Fuzu as a Frontend Engineer to build scalable React applications. You will work on our job search platform and company pages.",
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
    id: 4,
    title: "Supply Chain Manager",
    company: "Oriental Mills Ltd",
    logo: "https://logo.clearbit.com/orientalmills.com",
    location: "Kaduna, Nigeria",
    type: "Full-time",
    salary: 3000,
    category: "Operations",
    experience: "Senior",
    featured: true, // <-- ADDED
    postedDate: "2026-09-25",
    description: "Oversee end-to-end supply chain for Oriental Mills. Manage vendors, logistics, and inventory across 10+ states.",
    responsibilities: [
      "Manage procurement and vendor relationships",
      "Optimize logistics and distribution",
      "Control inventory levels and costs",
      "Ensure on-time delivery to customers"
    ],
    skills: ["Supply Chain", "Logistics", "Procurement", "ERP", "Negotiation"],
    benefits: ["Health Insurance", "Car Allowance", "Housing Allowance"]
  },
  {
    id: 6,
    title: "Digital Marketing Manager",
    company: "Andela",
    logo: "https://logo.clearbit.com/andela.com",
    location: "Abuja, Nigeria",
    type: "Full-time",
    salary: 2200,
    category: "Marketing",
    experience: "Mid-Level",
    featured: true, // <-- ADDED
    postedDate: "2026-09-26",
    description: "Drive growth through SEO, content, and paid ads. Manage campaigns across Google, Meta, and LinkedIn.",
    responsibilities: ["Run paid campaigns", "Manage social media", "Analyze marketing data", "Create content strategy"],
    skills: ["SEO", "Google Ads", "Meta Ads", "Content Marketing", "Analytics"],
    benefits: ["Health Insurance", "Remote Work", "Training Budget"]
  },
  {
    id: 10,
    title: "HR Manager",
    company: "Jobberman",
    logo: "https://logo.clearbit.com/jobberman.com",
    location: "Abuja, Nigeria",
    type: "Full-time",
    salary: 1800,
    category: "HR",
    experience: "Senior",
    featured: true, // <-- ADDED
    postedDate: "2026-09-21",
    description: "Lead HR operations and talent acquisition for Nigeria's top job platform.",
    responsibilities: ["Recruitment", "Employee relations", "Policy development", "Performance management"],
    skills: ["Recruitment", "HR Policies", "Employee Engagement", "Onboarding"],
    benefits: ["Health Insurance", "Paid Time Off"]
  },
];

function FeaturedJobs() {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState([]); // 1. Track saved jobs

  // 2. Load saved jobs from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
    setSavedIds(saved);
  }, []);

  // 3. Toggle save function
  const toggleSave = (e, jobId) => {
    e.stopPropagation();
    let newSavedIds;
    if (savedIds.includes(jobId)) {
      newSavedIds = savedIds.filter(id => id !== jobId);
    } else {
      newSavedIds = [...savedIds, jobId];
    }
    setSavedIds(newSavedIds);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
  };

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <section className="featured">
      
      {/* ========================================== */}
      {/* 1. DESKTOP VIEW */}
      {/* ========================================== */}
      <div className="desktop-view">
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all →</a>
        </div>
        <hr />
        {jobs.map((job) => (
          <div className="job-card" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
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
                {new Date(job.postedDate).toLocaleDateString()}
              </span>
              {/* 4. SAVE BUTTON ADDED */}
              <Bookmark 
                className="bookmark"
                fill={savedIds.includes(job.id) ? "#2563eb" : "none"}
                color={savedIds.includes(job.id) ? "#2563eb" : "currentColor"}
                onClick={(e) => toggleSave(e, job.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* 2. MOBILE VIEW - FIXED: removed duplicate map */}
      {/* ========================================== */}
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
              <img src={job.logo} alt={job.company} />
              {/* 5. SAVE BUTTON ADDED FOR MOBILE */}
              <Bookmark
                size={18}
                fill={savedIds.includes(job.id) ? "#2563eb" : "none"}
                color={savedIds.includes(job.id) ? "#2563eb" : "currentColor"}
                onClick={(e) => toggleSave(e, job.id)}
              />
            </div>

            <h3>{job.title}</h3>
            <p className="companyName1">{job.company}</p>

            <div className="mobileInfo1">
              <span><MapPin size={14} />{job.location}</span>
              <span><Briefcase size={14} />{job.type}</span>
            </div>

            <p className="mobileDesc1">{job.description.slice(0, 100)}...</p>

            <div className="mobileBottom1">
              <div className="salary1">${job.salary.toLocaleString()}/mo</div>
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