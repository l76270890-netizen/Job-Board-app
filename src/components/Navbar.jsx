import "./Navbar.css";
import {
  Search,
  Bell,
  Bookmark,
  User,
  Menu,
  Home,
  Briefcase,
  Building2,
  Settings,
  X,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Controls desktop responsive fallback if any
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Controls modern mobile bottom sheet drawer
  const location = useLocation();

  // Helper function to dynamically add active styling classes
  const isActive = (path) => location.pathname === path ? "active-tab" : "";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* ========================================== */}
      {/* 1. DESKTOP NAVBAR (Maintained Exactly)     */}
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
          <Link to="/settings">Settings</Link>
        </nav>

        <div className="navbar-right">
          <Search size={20} />
          <Bell size={20} />
          <Bookmark size={20} />
          <button className="login-btn">Login</button>
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu />
        </button>
      </header>

      {/* ========================================== */}
      {/* MOBILE SHEET MENU OVERLAY & TRAY           */}
      {/* ========================================== */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? "show" : ""}`} 
        onClick={toggleMobileMenu} 
      />
      
      <div className={`mobile-menu-sheet ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sheet-header">
          <h3>More Options</h3>
          <button className="sheet-close-btn" onClick={toggleMobileMenu} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        
        <div className="sheet-links">
          <Link to="/search" className="sheet-item" onClick={toggleMobileMenu}>
            <Search size={18} />
            <span>Search Jobs</span>
          </Link>
          <Link to="/notifications" className="sheet-item" onClick={toggleMobileMenu}>
            <Bell size={18} />
            <span>Notifications</span>
          </Link>
          <Link to="/settings" className="sheet-item" onClick={toggleMobileMenu}>
            <Settings size={18} />
            <span>Settings & Account</span>
          </Link>
          <div className="sheet-divider"></div>
          <button className="sheet-item logout-btn" onClick={toggleMobileMenu}>
            <LogOut size={18} />
            <span>Login / Logout</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. PREMIUM MOBILE BOTTOM NAVBAR            */}
      {/* ========================================== */}
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`mobile-nav-item ${isActive("/")}`} onClick={() => setMobileMenuOpen(false)}>
          <Home size={22} />
          <span>Home</span>
        </Link>
        
        <Link to="/jobs" className={`mobile-nav-item ${isActive("/jobs")}`} onClick={() => setMobileMenuOpen(false)}>
          <Briefcase size={22} />
          <span>Jobs</span>
        </Link>
        
        <Link to="/saved" className={`mobile-nav-item ${isActive("/saved")}`} onClick={() => setMobileMenuOpen(false)}>
          <Bookmark size={22} />
          <span>Saved</span>
        </Link>
        
        <Link to="/companies" className={`mobile-nav-item ${isActive("/companies")}`} onClick={() => setMobileMenuOpen(false)}>
          <Building2 size={22} />
          <span>Companies</span>
        </Link>
        
        {/* Swapped standard Settings tab out for full Hamburger Control */}
        <button 
          className={`mobile-nav-item menu-toggle-btn ${mobileMenuOpen ? "active-tab" : ""}`} 
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
        >
          <Menu size={22} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;
