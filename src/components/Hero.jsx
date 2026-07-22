import "./Hero.css";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. import this
import { useState } from "react";

function Hero() {
  const navigate = useNavigate(); // 2. init navigate
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  // Function to go to AllPage with filters
  const goToAllJobs = (filters = {}) => {
    navigate("/jobs", { state: filters }); 
  };

  // Handle main search button
  const handleSearch = () => {
    goToAllJobs({ 
      search: searchTerm, 
      location: location, 
      jobType: jobType 
    });
  };

  // Handle popular category click
  const handleCategoryClick = (category) => {
    goToAllJobs({ selectedCategory: category });
  };

  // Handle location click
  const handleLocationClick = (loc) => {
    goToAllJobs({ location: loc });
  };

  // Handle job type click
  const handleJobTypeClick = (type) => {
    goToAllJobs({ jobType: type });
  };

  return (
    <>
      {/* ==========================
          DESKTOP HERO
      =========================== */}

      <section className="hero desktop-view">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-badge">
            🚀 #1 Job Portal for Professionals
          </span>

          <h1>
            Find Your <span>Dream Job</span> With Top Companies Worldwide
          </h1>

          <p>
            Discover thousands of remote, hybrid and full-time opportunities
            from the world's leading companies.
          </p>

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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

            <button onClick={handleSearch}> {/* 3. Added onClick */}
              Search
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>
            {/* 4. Made these clickable categories */}
            <button onClick={() => handleCategoryClick("Engineering")}>React</button>
            <button onClick={() => handleCategoryClick("Design")}>UI/UX</button>
            <button onClick={() => handleJobTypeClick("Remote")}>Remote</button>
            <button onClick={() => handleCategoryClick("Marketing")}>Marketing</button>
            <button onClick={() => handleCategoryClick("Engineering")}>Python</button>
          </div>

          <div className="hero-stats">
            <div>
              <h2>20K+</h2>
              <span>Jobs</span>
            </div>
            <div>
              <h2>8K+</h2>
              <span>Companies</span>
            </div>
            <div>
              <h2>50K+</h2>
              <span>Job Seekers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================
          MOBILE HERO
      =========================== */}

      <section className="mobile-hero-container">


        {/* Hero */}
        <div className="hero-feature-card">
          <div className="feature-overlay"></div>
          <div className="feature-content">
            <span className="feature-tag">✨ New Feature</span>
            <h1 className="feature-title">Accelerate Your Career Growth</h1>
            <p className="feature-description">
              Connect directly with recruiters and discover thousands of verified jobs.
            </p>
            <button className="action-cta-btn" onClick={() => navigate('/profile')}>
              Complete Profile
            </button>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mobile-section">
          <h3>🔥 Popular Categories</h3>
          <div className="chip-grid">
            <button onClick={() => handleCategoryClick("Education")}>Teaching</button>
            <button onClick={() => handleCategoryClick("Business")}>Business</button>
            <button onClick={() => handleCategoryClick("Engineering")}>IT</button>
            <button onClick={() => handleCategoryClick("Finance")}>Finance</button>
            <button onClick={() => handleCategoryClick("Healthcare")}>Healthcare</button>
            <button onClick={() => handleCategoryClick("Marketing")}>Marketing</button>
          </div>
        </div>

        {/* Locations */}
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

        {/* Job Type */}
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