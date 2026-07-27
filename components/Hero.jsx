import "./Hero.css";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // 1. IMPORT THIS

function Hero() {
  const navigate = useNavigate(); 
  const location = useLocation(); // 2. GET CURRENT LOCATION
  const { currentUser } = useAuth(); // 3. GET USER
  const [searchTerm, setSearchTerm] = useState("");
  const [locationInput, setLocationInput] = useState(""); // renamed to avoid clash
  const [jobType, setJobType] = useState("");

  // 4. LOGIN CHECK WRAPPER
  const requireAuthAndNavigate = (filters = {}) => {
    if (!currentUser) {
      // send them to login, and remember where they came from
      navigate("/login", { state: { from: location, filters: filters } });
      return;
    }
    navigate("/jobs", { state: filters }); 
  };

  // Handle main search button
  const handleSearch = () => {
    requireAuthAndNavigate({ 
      search: searchTerm, 
      location: locationInput, 
      jobType: jobType 
    });
  };

  // Handle popular category click
  const handleCategoryClick = (category) => {
    requireAuthAndNavigate({ selectedCategory: category });
  };

  // Handle location click
  const handleLocationClick = (loc) => {
    requireAuthAndNavigate({ location: loc });
  };

  // Handle job type click
  const handleJobTypeClick = (type) => {
    requireAuthAndNavigate({ jobType: type });
  };

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
            <button className="action-cta-btn" onClick={() => navigate('/profile')}>
              Complete Profile
            </button>
          </div>
        </div>

        {/* Popular Categories */}
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