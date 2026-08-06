import "./Navbar.css";
import {
  Search, Bell, Bookmark, Menu, Home, Briefcase, Building2, Settings,
  MessageSquare, X, LogOut, Newspaper, UserPlus, LifeBuoy, User, Plus,
  FileText, Users
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { db } from "../firebase"; // ADDED
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"; // ADDED

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();
  const profileRef = useRef(null);

  const isActive = (path) => location.pathname.startsWith(path)? "active-tab" : "";
  const userRole = userData?.role;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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

  // NEW: GO TO FIRST JOB'S APPLICANTS
  const handleGoToApplicants = async () => {
    setMobileMenuOpen(false);
    if(!currentUser) return navigate('/login');

    try {
      const q = query(
        collection(db, "jobs"),
        where("companyId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      if(!snapshot.empty){
        const firstJobId = snapshot.docs[0].id;
        navigate(`/employer/applicants/${firstJobId}`);
      } else {
        navigate('/employer/jobs'); // no jobs yet
        alert("Post a job first to see applicants")
      }
    } catch (error) {
      console.error(error)
      navigate('/employer/jobs');
    }
  }

  const userInitial = currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase();
  const userPhoto = currentUser?.photoURL;

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header className="navbar desktop-navbar">
        <div className="logo">
          <Link to="/"><img src="Logo.jpg" alt="NijaJobs logo" className="logo-img" /></Link>
        </div>

        <nav className={menuOpen? "nav active" : "nav"}>
          <Link to="/" className={isActive("/")}>Home</Link>

          {userRole === 'employer'? (
            <>
              <Link to="/employer/jobs" className={isActive("/employer/jobs")}>Manage Jobs</Link>
              <Link to="/employer/post-job" className={isActive("/employer/post-job")}>Post Job</Link>
              <button onClick={handleGoToApplicants} className={`nav-link-btn ${isActive("/employer/applicants")}`}>Applicants</button> {/* CHANGED */}
              <Link to="/message" className={isActive("/employer/messages")}>Messages</Link>
            </>
          ) : (
            <>
              <Link to="/jobs" className={isActive("/jobs")}>Jobs</Link>
              <Link to="/companies" className={isActive("/companies")}>Companies</Link>
              <Link to="/saved" className={isActive("/saved")}>Saved</Link>
              <Link to="/articles" className={isActive("/articles")}>Articles</Link>
            </>
          )}
        </nav>

        <div className="navbar-right">
          {userRole!== 'employer' && <Link to="/saved" className="icon-item2"><Bookmark size={20} /></Link>}
          {currentUser && <NotificationBell />}

          {userRole === 'employer' && (
            <button onClick={() => navigate('/employer/post-job')} className="login-btn" style={{ background: "#22c55e" }}>
              <Plus size={16} /> Post Job
            </button>
          )}

          {currentUser? (
            <div className="user-menu" ref={profileRef}>
              <button className="user-avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                {userPhoto? <img src={userPhoto} alt="user" className="avatar-img" /> : <div className="avatar-initial">{userInitial}</div>}
              </button>
              {profileOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">{userData?.name || currentUser.displayName || "User"}</p>
                    <p className="user-email">{currentUser.email}</p>
                    <p style={{ fontSize: "12px", color: "#22c55e", textTransform: "capitalize" }}>{userRole}</p>
                  </div>
                  <Link to="/settings" onClick={() => setProfileOpen(false)}><User size={16} /> Profile</Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)}><Settings size={16} /> Settings</Link>
                  {userRole === 'employer' && <Link to="/employer/profile" onClick={() => setProfileOpen(false)}><Building2 size={16} /> Company Profile</Link>}
                  <button onClick={handleLogout}><LogOut size={16} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">Join now</Link>
          )}
        </div>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </button>
      </header>

      {/* MOBILE TOP BAR */}
      <header className="mobile-top-bar">
        <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {mobileMenuOpen? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="logo"><Link to="/"><img src="Logo.jpg" alt="NijaJobs logo" className="logo-img" /></Link></div>
        {currentUser && <NotificationBell />}

        {!currentUser && <Link to="/login" className="mobile-login-btn">Join now</Link>}
        {currentUser && (
          <Link to="/settings" className="mobile-user-avatar">
            {userPhoto? <img src={userPhoto} alt="user" className="avatar-img" /> : <div className="avatar-initial">{userInitial}</div>}
          </Link>
        )}
      </header>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen? "show" : ""}`} onClick={toggleMobileMenu} />
      <div className={`mobile-drawer ${mobileMenuOpen? "open" : ""}`}>
        {currentUser && (
          <div className="drawer-user">
            {userPhoto? <img src={userPhoto} alt="user" className="avatar-img" /> : <div className="avatar-initial">{userInitial}</div>}
            <div>
              <p className="user-name">{userData?.name || "User"}</p>
              <p className="user-email">{currentUser.email}</p>
              <p style={{ fontSize: "12px", color: "#22c55e", textTransform: "capitalize" }}>{userRole}</p>
            </div>
          </div>
        )}

        <div className="drawer-links">
          <Link to="/" className="drawer-item" onClick={toggleMobileMenu}><Home size={18} /><span>Home</span></Link>

          {userRole === 'employer'? (
            <>
              <Link to="/employer/jobs" className="drawer-item" onClick={toggleMobileMenu}><FileText size={18} /><span>Manage Jobs</span></Link>
              <Link to="/employer/post-job" className="drawer-item" onClick={toggleMobileMenu}><Plus size={18} /><span>Post Job</span></Link>
              <button className="drawer-item" onClick={handleGoToApplicants}><Users size={18} /><span>Applicants</span></button> {/* CHANGED */}
              <Link to="/employer/messages" className="drawer-item" onClick={toggleMobileMenu}><MessageSquare size={18} /><span>Messages</span></Link>
              <Link to="/employer/profile" className="drawer-item" onClick={toggleMobileMenu}><Building2 size={18} /><span>Company Profile</span></Link>
            </>
          ) : (
            <>
              <Link to="/jobs" className="drawer-item" onClick={toggleMobileMenu}><Briefcase size={18} /><span>Jobs</span></Link>
              <Link to="/saved" className="drawer-item" onClick={toggleMobileMenu}><Bookmark size={18} /><span>Saved</span></Link>
              <Link to="/companies" className="drawer-item" onClick={toggleMobileMenu}><Building2 size={18} /><span>Companies</span></Link>
              <Link to="/articles" className="drawer-item" onClick={toggleMobileMenu}><Newspaper size={18} /><span>Articles</span></Link>
            </>
          )}

          <div className="drawer-divider"></div>
          <Link to="/settings" className="drawer-item" onClick={toggleMobileMenu}><Settings size={18} /><span>Account Settings</span></Link>
          <button className="drawer-item logout-btn" onClick={handleLogout}><LogOut size={18} /><span>{currentUser? "Logout" : "Login"}</span></button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`mobile-nav-item ${isActive("/")}`}><Home size={22} /><span>Home</span></Link>

        {userRole === 'employer' && (
          <>
            <Link to="/employer/jobs" className={`mobile-nav-item ${isActive("/employer/jobs")}`}><FileText size={22} /><span>Jobs</span></Link>
            <Link to="/employer/post-job" className={`mobile-nav-item ${isActive("/employer/post-job")}`}><Plus size={22} /><span>Post</span></Link>
            <button className={`mobile-nav-item ${isActive("/employer/applicants")}`} onClick={handleGoToApplicants}><Users size={22} /><span>Applicants</span></button> {/* CHANGED */}
            <Link to="/employer/messages" className={`mobile-nav-item ${isActive("/employer/messages")}`}><MessageSquare size={22} /><span>Messages</span></Link>
          </>
        )}

        {userRole === 'jobseeker' && (
          <>
            <Link to="/jobs" className={`mobile-nav-item ${isActive("/jobs")}`}><Briefcase size={22} /><span>Jobs</span></Link>
            <Link to="/saved" className={`mobile-nav-item ${isActive("/saved")}`}><Bookmark size={22} /><span>Saved</span></Link>
            <Link to="/articles" className={`mobile-nav-item ${isActive("/articles")}`}><Newspaper size={22} /><span>Articles</span></Link>
            <Link to="/companies" className={`mobile-nav-item ${isActive("/companies")}`}><Building2 size={22} /><span>Companies</span></Link>
          </>
        )}

        {!userRole && (
          <>
            <Link to="/jobs" className={`mobile-nav-item ${isActive("/jobs")}`}><Briefcase size={22} /><span>Jobs</span></Link>
            <Link to="/saved" className={`mobile-nav-item ${isActive("/saved")}`}><Bookmark size={22} /><span>Saved</span></Link>
            <Link to="/articles" className={`mobile-nav-item ${isActive("/articles")}`}><Newspaper size={22} /><span>Articles</span></Link>
            <Link to="/companies" className={`mobile-nav-item ${isActive("/companies")}`}><Building2 size={22} /><span>Companies</span></Link>
          </>
        )}
      </nav>
    </>
  );
}

export default Navbar;