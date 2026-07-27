import { useState, useEffect } from "react";
import "./FeaturedJobs.css";
import {
  MapPin,
  Clock3,
  Bookmark,
  Briefcase,
  DollarSign // added for button
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // 1. ADD
import { useAuth } from "../context/AuthContext"; // 2. ADD

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
    featured: true,
    postedDate: "2026-09-28",
    description: "We are looking for a Senior Product Designer to lead the design of our flagship SaaS product. You will own the end-to-end design process from user research to high-fidelity prototypes.",
    responsibilities: ["Lead product design", "Conduct user research", "Create design systems", "Collaborate with PMs"],
    skills: ["Figma", "UI/UX", "Design Systems"],
    benefits: ["Health Insurance", "Remote Work"]
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
    featured: true,
    postedDate: "2026-09-25",
    description: "Join Fuzu as a Frontend Engineer to build scalable React applications.",
    responsibilities: ["Build React apps", "Collaborate with teams"],
    skills: ["React", "JavaScript", "Tailwind"],
    benefits: ["Remote Work"]
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
    featured: true,
    postedDate: "2026-09-25",
    description: "Oversee end-to-end supply chain for Oriental Mills.",
    responsibilities: ["Manage procurement", "Optimize logistics"],
    skills: ["Supply Chain", "Logistics"],
    benefits: ["Health Insurance"]
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
    featured: true,
    postedDate: "2026-09-26",
    description: "Drive growth through SEO, content, and paid ads.",
    responsibilities: ["Run paid campaigns"],
    skills: ["SEO", "Google Ads"],
    benefits: ["Health Insurance"]
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
    featured: true,
    postedDate: "2026-09-21",
    description: "Lead HR operations and talent acquisition.",
    responsibilities: ["Recruitment", "Employee relations"],
    skills: ["Recruitment", "HR Policies"],
    benefits: ["Health Insurance"]
  },
];

function FeaturedJobs() {
  const navigate = useNavigate();
  const location = useLocation(); // 3. ADD
  const { currentUser } = useAuth(); // 4. ADD
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
    setSavedIds(saved);
  }, []);

  // 5. LOGIN CHECK WRAPPER
  const requireAuth = (action) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }
    action();
  }

  const toggleSave = (e, jobId) => {
    e.stopPropagation();
    requireAuth(() => { // 6. WRAP
      let newSavedIds;
      if (savedIds.includes(jobId)) {
        newSavedIds = savedIds.filter(id => id !== jobId);
      } else {
        newSavedIds = [...savedIds, jobId];
      }
      setSavedIds(newSavedIds);
      localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
    })
  };

  const handleApplyClick = (e, job) => { // 7. NEW
    e.stopPropagation();
    requireAuth(() => {
      navigate(`/jobs/${job.id}`, { state: job }); // send to detail to apply
    })
  }

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <section className="featured">
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
              <Bookmark 
                className="bookmark"
                fill={savedIds.includes(job.id) ? "#22C55E" : "none"}
                color={savedIds.includes(job.id) ? "#22C55E" : "currentColor"}
                onClick={(e) => toggleSave(e, job.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mobileJobList1" style={{ position:"relative", top:"-410px", height:"77vh" }}>
        <hr />
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all</a>
        </div>

        {jobs.map((job) => (
          <div className="mobileCard1" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
            <div className="mobileTop1">
              <img src={job.logo} alt={job.company} />
              <Bookmark
                size={18}
                fill={savedIds.includes(job.id) ? "#22C55E" : "none"}
                color={savedIds.includes(job.id) ? "#22C55E" : "currentColor"}
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
              <button onClick={(e) => handleApplyClick(e, job)}>Apply</button> {/* 8. UPDATED */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;