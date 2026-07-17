import "./Hero.css";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  Bell,
} from "lucide-react";

function Hero() {
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
              />
            </div>

            <div className="search-item">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="Location"
              />
            </div>

            <div className="search-item">
              <Briefcase size={20} />

              <select>
                <option>Job Type</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            <button>
              Search
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>

            <button>React</button>
            <button>UI/UX</button>
            <button>Remote</button>
            <button>Marketing</button>
            <button>Python</button>
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

  {/* Search */}
  <div className="mobile-search-widget">
    <input
      type="text"
      placeholder="Search jobs, companies..."
      className="mobile-search-input"
    />
  </div>

  {/* Hero */}

  <div className="hero-feature-card">

    <div className="feature-overlay"></div>

    <div className="feature-content">

      <span className="feature-tag">
        ✨ New Feature
      </span>

      <h1 className="feature-title">
        Accelerate Your Career Growth
      </h1>

      <p className="feature-description">
        Connect directly with recruiters and discover thousands of verified jobs.
      </p>

      <button className="action-cta-btn">
        Complete Profile
      </button>

    </div>

  </div>

  {/* Popular */}

  <div className="mobile-section">

    <h3>🔥 Popular Categories</h3>

    <div className="chip-grid">

      <button>Teaching</button>
      <button>Business</button>
      <button>IT</button>
      <button>Finance</button>
      <button>Healthcare</button>
      <button>Marketing</button>

    </div>

  </div>

  {/* Locations */}

  <div className="mobile-section">

    <h3>📍 Browse by Location</h3>

    <div className="chip-grid">

      <button>Lagos</button>
      <button>Abuja</button>
      <button>Kaduna</button>
      <button>Port Harcourt</button>
      <button>Kano</button>
      <button>Cross River</button>

    </div>

  </div>

  {/* Job Type */}

  <div className="mobile-section">

    <h3>⏰ Job Type</h3>

    <div className="chip-grid">

      <button>💻 Remote</button>
      <button>Full-time</button>
      <button>Contract</button>
      <button>Part-time</button>

    </div>

  </div>

</section>
    </>
  );
}

export default Hero;