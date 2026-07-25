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
  MessageSquare,
  X,
  LogOut,
  Newspaper,
  UserPlus,
  LifeBuoy,
  User // added
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // make sure this path is correct

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // for dropdown
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // get user
  const profileRef = useRef(null);

  const isActive = (path) => location.pathname === path? "active-tab" : "";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current &&!profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  const userInitial = currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase();
  const userPhoto = currentUser?.photoURL;

  return (
    <>
      {/* ========================================== */}
      {/* 1. DESKTOP NAVBAR */}
      {/* ========================================== */}
      <header className="navbar desktop-navbar">
        <div className="logo">
          <span className="logo-dot"></span>
          NijaJobs
        </div>

        <nav className={menuOpen? "nav active" : "nav"}>
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

          {/* USER ICON / LOGIN BUTTON */}
          {currentUser? (
            <div className="user-menu" ref={profileRef}>
              <button className="user-avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                {userPhoto? (
                  <img src={userPhoto} alt="user" className="avatar-img" />
                ) : (
                  <div className="avatar-initial">{userInitial}</div>
                )}
              </button>
              {profileOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">{currentUser.displayName || "User"}</p>
                    <p className="user-email">{currentUser.email}</p>
                  </div>
                  <Link to="/settings" onClick={() => setProfileOpen(false)}><User size={16}/> Profile</Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)}><Settings size={16}/> Settings</Link>
                  <button onClick={handleLogout}><LogOut size={16}/> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
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
          {mobileMenuOpen? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="mobile-logo">
          <span className="logo-dot"></span>
          NijaJobs
        </div>

        {/* USER ICON ON MOBILE TOP RIGHT */}
        {currentUser? (
          <button className="mobile-avatar-btn" onClick={() => navigate("/settings")}>
            {userPhoto? (
              <img src={userPhoto} alt="user" className="avatar-img-sm" />
            ) : (
              <div className="avatar-initial-sm">{userInitial}</div>
            )}
          </button>
        ) : (
          <Link to="/login"><User size={24} /></Link>
        )}
      </header>

      {/* ========================================== */}
      {/* 3. MOBILE TOP DRAWER MENU */}
      {/* ========================================== */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen? "show" : ""}`}
        onClick={toggleMobileMenu}
      />

      <div className={`mobile-drawer ${mobileMenuOpen? "open" : ""}`}>
        {/* USER INFO AT TOP OF DRAWER */}
        {currentUser && (
          <div className="drawer-user">
            {userPhoto? (
              <img src={userPhoto} alt="user" className="avatar-img" />
            ) : (
              <div className="avatar-initial">{userInitial}</div>
            )}
            <div>
              <p className="user-name">{currentUser.displayName || "User"}</p>
              <p className="user-email">{currentUser.email}</p>
            </div>
          </div>
        )}

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
          <Link to="/articles" className="drawer-item" onClick={toggleMobileMenu}>
            <Newspaper size={18} />
            <span>Articles</span>
          </Link>
          <Link to="/companies" className="drawer-item" onClick={toggleMobileMenu}>
            <Building2 size={18} />
            <span>Companies</span>
          </Link>

          <div className="drawer-divider"></div>

          <Link to="/message" className="drawer-item" onClick={toggleMobileMenu}>
            <MessageSquare size={18} />
            <span>Messages</span>
          </Link>

          <Link to="/settings" className="drawer-item" onClick={toggleMobileMenu}>
            <Settings size={18} />
            <span>Account Settings</span>
          </Link>

          <Link to="/settings" className="drawer-item" onClick={toggleMobileMenu}>
            <LifeBuoy size={18} />
            <span>Support</span>
          </Link>

          <button className="drawer-item logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>{currentUser? "Logout" : "Login"}</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 4. MOBILE BOTTOM NAVBAR */}
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
