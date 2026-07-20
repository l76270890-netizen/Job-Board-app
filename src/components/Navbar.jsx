import "./Navbar.css";
import {
  Search,
  Bell,
  Bookmark,
  Menu,
  Home,
  Briefcase,
  Building2,
  Settings,
  X,
  LogOut,
  Newspaper
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active-tab" : "";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* ========================================== */}
      {/* 1. DESKTOP NAVBAR - UNTOUCHED */}
      {/* ========================================== */}
      <header className="navbar desktop-navbar">
        <div className="logo">
          <span className="logo-dot"></span>
          NijaJobs
        </div>

        <nav className={menuOpen ? "nav active" : "nav"}>
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/saved">Saved</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/articles">Article</Link>
        </nav>

        <div className="navbar-right">
          <Search size={20} />
          <Bell size={20} />
          <Bookmark size={20} />
          <button className="login-btn">Login</button>
        </div>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </button>
      </header>

      {/* ========================================== */}
      {/* 2. MOBILE TOP BAR WITH HAMBURGER LEFT */}
      {/* ========================================== */}
      <header className="mobile-top-bar">
        <button className="mobile-menu-icon" onClick={toggleMobileMenu} aria-label="Open menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />} {/* Changes to X when open */}
        </button>
        <div className="mobile-logo">
          <span className="logo-dot"></span>
          NijaJobs
        </div>
        <Search size={22} /> {/* right icon */}
      </header>

      {/* ========================================== */}
      {/* 3. MOBILE TOP DRAWER MENU - SLIDES FROM TOP */}
      {/* ========================================== */}
      <div 
        className={`mobile-drawer-overlay ${mobileMenuOpen ? "show" : ""}`} 
        onClick={toggleMobileMenu} 
      />
      
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="drawer-links">
          <Link to="/" className="drawer-item" onClick={toggleMobileMenu}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/jobs" className="drawer-item" onClick={toggleMobileMenu}>
            <Briefcase size={18} />
            <span>Jobs</span>
          </Link>
           <Link to="/saved" className="drawer-item" onClick={toggleMobileMenu}>
            <Bookmark size={18} />
            <span>Saved</span>
          </Link>
          <Link to="/Articles" className="drawer-item" onClick={toggleMobileMenu}>
            <Newspaper size={18} />
            <span>Articles</span>
          </Link>
          <Link to="/companies" className="drawer-item" onClick={toggleMobileMenu}>
            <Building2 size={18} />
            <span>Companies</span>
          </Link>
          <div className="drawer-divider"></div>
          <Link to="/settings" className="drawer-item" onClick={toggleMobileMenu}>
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          
          <button className="drawer-item logout-btn" onClick={toggleMobileMenu}>
            <LogOut size={18} />
            <span>Login / Logout</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 4. MOBILE BOTTOM NAVBAR - 5 TABS */}
      {/* ========================================== */}
     <nav className="mobile-bottom-nav">
  <Link to="/" className={`mobile-nav-item ${isActive("/")}`}>
    <Home size={22} />
    <span>Home</span>
  </Link>
  
  <Link to="/jobs" className={`mobile-nav-item ${isActive("/jobs")}`}>
    <Briefcase size={22} />
    <span>Jobs</span>
  </Link>

  <Link to="/saved" className={`mobile-nav-item ${isActive("/saved")}`}>
    <Bookmark size={22} />
    <span>Saved</span>
  </Link>

  {/* CHANGED THIS LINE */}
  <Link to="/articles" className={`mobile-nav-item ${isActive("/articles")}`}>
    <Newspaper size={22} />
    <span>Article</span>
  </Link>
  
  <Link to="/companies" className={`mobile-nav-item ${isActive("/companies")}`}>
    <Building2 size={22} />
    <span>Companies</span>
  </Link>

</nav>
    </>
  );
}

export default Navbar;