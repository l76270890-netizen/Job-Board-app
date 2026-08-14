import "./Hero.css";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  Users,
  FileText,
  TrendingUp,
  Plus,
  MessageSquare,  // ADDED
  Building2       // ADDED
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
    const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
  const { currentUser, userData } = useAuth(); // FIX 1: get userData
  const [searchTerm, setSearchTerm] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [jobType, setJobType] = useState("");

  const userRole = userData?.role; // FIX 1: role is in userData

  // 1. LOGIN CHECK WRAPPER - for jobseekers
  const requireAuthAndNavigate = (filters = {}) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location, filters: filters } });
      return;
    }
    navigate("/jobs", { state: filters });
  };

  const handleSearch = () => {
    requireAuthAndNavigate({
      search: searchTerm,
      location: locationInput,
      jobType: jobType
    });
  };

   const fetchEmployerData = async () => { // EMPLOYER - UNCHANGED
      setLoading(true);
      try {
        const jobsQ = query(collection(db, "jobs"), where("companyId", "==", currentUser.uid));
        const jobsSnap = await getDocs(jobsQ);
        const jobsData = jobsSnap.docs.map(d => ({ id: d.id,...d.data() }));
  
        const appsQ = query(collection(db, "applications"), where("employerId", "==", currentUser.uid));
        const appsSnap = await getDocs(appsQ);
  
        const jobsWithCount = jobsData.map(job => ({
       ...job,
          applicantCount: appsSnap.docs.filter(app => app.data().jobId === job.id).length
        }))
  
        setMyJobs(jobsWithCount.slice(0, 5));
        setStats({ jobs: jobsData.length, applicants: appsSnap.size });
      } catch (error) {
        console.error("Error fetching employer data:", error);
      }
      setLoading(false);
    };
  

  const handleCategoryClick = (category) => {
    requireAuthAndNavigate({ selectedCategory: category });
  };

  const handleLocationClick = (loc) => {
    requireAuthAndNavigate({ location: loc });
  };

  const handleJobTypeClick = (type) => {
    requireAuthAndNavigate({ jobType: type });
  };

  // ==========================================
  // EMPLOYER HERO VIEW
  // ==========================================
  if (userRole === 'employer') {
    return (
      <>
        {/* DESKTOP EMPLOYER HERO */}
        <section className="hero desktop-view">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="hero-badge">💼 Employer Dashboard</span>
            <h1>Hire Top <span>Talent</span> For Your Company</h1>
            <p>Post jobs, review applications, and find the perfect candidate in days, not weeks.</p>

            <div className="hero-search" style={{justifyContent: "center"}}>
              <button
                onClick={() => navigate('/employer/post-job')} // FIX 3: removed S
                style={{background: "#fff", color: "#15803D", padding: "16px 32px", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px"}}
              >
                <Plus size={18} /> Post a Job
              </button>
              <button
                onClick={() => navigate('/employer/applicants/:jobId')}
                style={{background: "transparent", border: "2px solid #fff", color: "#fff", display: "flex", alignItems: "center", gap: "8px"}}
              >
                View Applicants <ArrowRight size={18} />
              </button>
            </div>

            <div className="hero-stats">
              <div> <h3>{stats.jobs || 0}</h3><span>Job Seekers</span></div>
              <div><h2>127</h2><span>Your Applicants</span></div>
              <div><h3>{stats.jobs || 0}</h3><span>Active Jobs</span></div>
            </div>
          </div>
        </section>

        {/* MOBILE EMPLOYER HERO */}
        <section className="mobile-hero-container">
          <div className="hero-feature-card" style={{background: "linear-gradient(135deg, #22C55E 0%, #15803D 100%)"}}>
            <div className="feature-overlay"></div>
            <div className="feature-content">
              <span className="feature-tag">💼 Employer</span>
              <h1 className="feature-title">Find Your Next Hire</h1>
              <p className="feature-description">Manage jobs and connect with qualified candidates instantly.</p>
              <button className="action-cta-btn" onClick={() => navigate('/employer/post-job')}> {/* FIX 3: removed S */}
                <Plus size={18} /> Post New Job
              </button>
            </div>
          </div>

          <div className="mobile-section">
            <h3>📊 Quick Actions</h3>
            <div className="chip-grid">
              <button onClick={() => navigate('/employer/jobs')}> Manage Jobs</button>
              <button onClick={() => navigate('/employer/applicants/:jobId')}> Applicants</button>
              <button onClick={() => navigate('/message')}> Messages</button>
              <button onClick={() => navigate('/employer/profile')}> Company Profile</button>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ==========================================
  // JOBSEEKER HERO VIEW - YOUR ORIGINAL CODE
  // ==========================================
  return (
    <>
      {/* DESKTOP HERO */}
      <section className="hero desktop-view">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">🚀 #1 Job Portal for Professionals</span>
          <h1>Find Your <span>Dream Job</span> With Top Companies Worldwide</h1>
          <p>Discover thousands of remote, hybrid and full-time opportunities from the world's leading companies.</p>

          <div className="hero-search">
            <div className="search-item">
              <Search size={20} />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="search-item">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="Location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
            </div>
            <div className="search-item">
              <Briefcase size={20} />
              <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="">Job Type</option>
                <option value="Full-time">Full Time</option>
                <option value="Part-time">Part Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <button onClick={handleSearch}>
              Search <ArrowRight size={18} />
            </button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>
            <button onClick={() => handleCategoryClick("IT")}>React</button>
            <button onClick={() => handleCategoryClick("Technology")}>UI/UX</button>
            <button onClick={() => handleJobTypeClick("Remote")}>Remote</button>
            <button onClick={() => handleCategoryClick("Marketing")}>Marketing</button>
            <button onClick={() => handleCategoryClick("IT")}>Python</button>
          </div>

          <div className="hero-stats">
            <div><h2>20K+</h2><span>Jobs</span></div>
            <div><h2>8K+</h2><span>Companies</span></div>
            <div><h2>50K+</h2><span>Job Seekers</span></div>
          </div>
        </div>
      </section>

      {/* MOBILE HERO */}
      <section className="mobile-hero-container">
        <div className="hero-feature-card">
          <div className="feature-overlay"></div>
          <div className="feature-content">
            <span className="feature-tag">✨ New Feature</span>
            <h1 className="feature-title">Accelerate Your Career Growth</h1>
            <p className="feature-description">Connect directly with recruiters and discover thousands of verified jobs.</p>
            <button className="action-cta-btn" onClick={() => navigate('/jobs')}>
              Find jobs
            </button>
          </div>
        </div>

        <div className="mobile-section">
          <h3>🔥 Popular Categories</h3>
          <div className="chip-grid">
            <button onClick={() => handleCategoryClick("Teaching")}>Teaching</button>
            <button onClick={() => handleCategoryClick("Business")}>Business</button>
            <button onClick={() => handleCategoryClick("IT")}>IT</button>
            <button onClick={() => handleCategoryClick("Finance")}>Finance</button>
            <button onClick={() => handleCategoryClick("Healthcare")}>Healthcare</button>
            <button onClick={() => handleCategoryClick("Marketing")}>Marketing</button>
          </div>
        </div>

        <div className="mobile-section">
          <h3>📍 Browse by Location</h3>
          <div className="chip-grid">
            <button onClick={() => handleLocationClick("Lagos, Nigeria")}>Lagos</button>
            <button onClick={() => handleLocationClick("Abuja, Nigeria")}>Abuja</button>
            <button onClick={() => handleLocationClick("Kaduna, Nigeria")}>Kaduna</button>
            <button onClick={() => handleLocationClick("Port Harcourt, Nigeria")}>Port Harcourt</button>
            <button onClick={() => handleLocationClick("Kano, Nigeria")}>Kano</button>
            <button onClick={() => handleLocationClick("Calabar, Nigeria")}>Cross River</button>
          </div>
        </div>

        <div className="mobile-section">
          <h3>⏰ Job Type</h3>
          <div className="chip-grid">
            <button onClick={() => handleJobTypeClick("Remote")}>💻 Remote</button>
            <button onClick={() => handleJobTypeClick("Full-time")}>Full-time</button>
            <button onClick={() => handleJobTypeClick("Contract")}>Contract</button>
            <button onClick={() => handleJobTypeClick("Part-time")}>Part-time</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;