import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { Home as HomeIcon, Briefcase, Newspaper, Building2, User, ArrowLeft, Share2 } from "lucide-react";
import "../App.css";

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const hideNav = ["/login", "/signup"].includes(pathname);

  const getTitle = () => {
    if (pathname.startsWith("/articles")) return "Articles";
    if (pathname.startsWith("/jobs")) return "Jobs";
    if (pathname.startsWith("/companies")) return "Companies";
    if (pathname.startsWith("/settings")) return "Profile";
    return "Home";
  }

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/articles", label: "Articles", icon: Newspaper },
    { path: "/companies", label: "Companies", icon: Building2 },
    { path: "/settings", label: "Profile", icon: User },
  ];

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="appLayout">
      
      {/* TOP NAV - Shows on all screen sizes */}
      {!hideNav && (
        <header className="topNav">
          {pathname !== "/" ? (
            <button onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
          ) : <div style={{width: 22}}/>}
          <h3>{getTitle()}</h3>
          <button><Share2 size={20} /></button>
        </header>
      )}
      
      <main className="pageContent">
        <Outlet /> 
      </main>

      {/* BOTTOM NAV - We will hide this on desktop with CSS */}
      {!hideNav && (
        <nav className="bottomNav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              className={`navItem ${isActive(path) ? "active" : ""}`}
              onClick={() => navigate(path)}
            >
              <Icon size={22} strokeWidth={isActive(path) ? 2.5 : 2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}