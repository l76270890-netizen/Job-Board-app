import "./SettingPage.css";
import {
  ArrowLeft, User, Bell, Moon, Shield, Globe, FileText, LogOut,
  ChevronRight, X, Upload, Check, Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // import this

export default function SettingPage() {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserProfile } = useAuth(); // get user

  // STATE
  const [activeModal, setActiveModal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    title: "Frontend Developer",
    email: "",
    phone: "+234 800 000 0000",
    bio: "I build beautiful web apps"
  });
  const [notifications, setNotifications] = useState({ email: true, push: true, jobAlerts: true });
  const [language, setLanguage] = useState("English");
  const [resume, setResume] = useState(null);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

  // LOAD FROM FIREBASE + LOCALSTORAGE
  useEffect(() => {
    if (currentUser) {
      setProfile(prev => ({
       ...prev,
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        photoURL: currentUser.photoURL // add this
      }));
    }

    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) setProfile(p => ({...p,...savedProfile}));

    const savedNotifs = JSON.parse(localStorage.getItem("notifications"));
    if (savedNotifs) setNotifications(savedNotifs);

    const savedDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDark);
    document.body.classList.toggle("dark", savedDark);

    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);

    const savedResume = JSON.parse(localStorage.getItem("resume"));
    if (savedResume) setResume(savedResume);
  }, [currentUser]);

  // HANDLERS
  const handleSaveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setActiveModal(null);
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await updateUserProfile(file); // this uploads to Firebase
      setActiveModal(null);
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
  };

  const handleToggleNotif = (key) => {
    const updated = {...notifications, [key]:!notifications[key] };
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const handleDarkMode = () => {
    const newMode =!darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark", newMode);
  };

  const handleChangeLang = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setActiveModal(null);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const resumeData = { name: file.name, size: file.size };
      setResume(resumeData);
      localStorage.setItem("resume", JSON.stringify(resumeData));
    }
  };

  const handleChangePassword = () => {
    if (password.new!== password.confirm) {
      alert("Passwords do not match");
      return;
    }
    alert("Password changed successfully! Connect to Firebase updatePassword later");
    setPassword({ current: "", new: "", confirm: "" });
    setActiveModal(null);
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout(); // use firebase logout
      navigate("/login");
    }
  };

  const settings = [
    { icon: <User size={22} />, title: "Profile", desc: "Edit your personal information", onClick: () => setActiveModal("profile") },
    { icon: <Bell size={22} />, title: "Notifications", desc: "Manage alerts and emails", onClick: () => setActiveModal("notifications") },
    { icon: <Moon size={22} />, title: "Appearance", desc: darkMode? "Dark Mode" : "Light Mode", onClick: handleDarkMode },
    { icon: <Shield size={22} />, title: "Privacy & Security", desc: "Password and account security", onClick: () => setActiveModal("security") },
    { icon: <Globe size={22} />, title: "Language", desc: language, onClick: () => setActiveModal("language") },
    { icon: <FileText size={22} />, title: "Resume", desc: resume? resume.name : "Upload or update CV", onClick: () => setActiveModal("resume") },
  ];

  const userInitial = profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase();

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="backBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
      </div>

      <div className="profile-card">
        <div className="avatar-wrapper">
          {profile.photoURL? (
            <img src={profile.photoURL} alt="" />
          ) : (
            <div className="avatar-initial">{userInitial}</div>
          )}
          <button className="change-avatar-btn" onClick={() => fileInputRef.current.click()}>
            <Camera size={14} />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfilePicUpload} hidden />
        </div>
        <div>
          <h2>{profile.name || "User"}</h2>
          <p>{profile.title}</p>
        </div>
      </div>

      <div className="settings-list">
        {settings.map((item, index) => (
          <div className="setting-item" key={index} onClick={item.onClick}>
            <div className="setting-left">
              <div className="iconBox">{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
            <ChevronRight size={20} />
          </div>
        ))}
      </div>

      <button className="logoutBtn" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>

      {/* MODALS */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}</h2>
              <X size={22} onClick={() => setActiveModal(null)} />
            </div>

            {activeModal === "profile" && (
              <div className="modal-body">
                <div className="avatar-upload-modal">
                  {profile.photoURL? <img src={profile.photoURL} alt="" /> : <div className="avatar-initial-large">{userInitial}</div>}
                  <button className="btn-outline" onClick={() => fileInputRef.current.click()} disabled={uploading}>
                    {uploading? "Uploading..." : "Change Photo"}
                  </button>
                </div>
                <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Full Name" />
                <input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} placeholder="Job Title" />
                <input value={profile.email} disabled placeholder="Email" /> {/* email can't be changed easily */}
                <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="Phone" />
                <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Bio" rows="3" />
                <button className="btn-save" onClick={handleSaveProfile}>Save Changes</button>
              </div>
            )}

            {/* Other modals stay the same */}
            {activeModal === "notifications" && (
              <div className="modal-body">
                <div className="toggle-row"><span>Email Notifications</span><label className="switch"><input type="checkbox" checked={notifications.email} onChange={() => handleToggleNotif("email")} /><span className="slider"></span></label></div>
                <div className="toggle-row"><span>Push Notifications</span><label className="switch"><input type="checkbox" checked={notifications.push} onChange={() => handleToggleNotif("push")} /><span className="slider"></span></label></div>
                <div className="toggle-row"><span>Job Alerts</span><label className="switch"><input type="checkbox" checked={notifications.jobAlerts} onChange={() => handleToggleNotif("jobAlerts")} /><span className="slider"></span></label></div>
              </div>
            )}

            {activeModal === "security" && (
              <div className="modal-body">
                <input type="password" placeholder="Current Password" value={password.current} onChange={e => setPassword({...password, current: e.target.value})} />
                <input type="password" placeholder="New Password" value={password.new} onChange={e => setPassword({...password, new: e.target.value})} />
                <input type="password" placeholder="Confirm New Password" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} />
                <button className="btn-save" onClick={handleChangePassword}>Change Password</button>
              </div>
            )}

            {activeModal === "language" && (
              <div className="modal-body">
                {["English", "French", "Arabic"].map(lang => (
                  <div key={lang} className="lang-option" onClick={() => handleChangeLang(lang)}>{lang} {language === lang && <Check size={18} />}</div>
                ))}
              </div>
            )}

            {activeModal === "resume" && (
              <div className="modal-body">
                <label className="upload-box"><Upload size={20} /><span>{resume? resume.name : "Click to upload PDF, DOC"}</span><input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} hidden /></label>
                {resume && <p className="file-info">Current: {resume.name}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
