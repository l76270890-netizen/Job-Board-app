import "./SettingPage.css";
import {
  ArrowLeft, User, Bell, Moon, Shield, Globe, FileText, LogOut,
  ChevronRight, X, Upload, Check, Camera, Building2, Users, CreditCard, Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingPage() {
  const navigate = useNavigate();
  const { currentUser, logout, userData } = useAuth();

  const isEmployer = userData?.role === "employer";

  // STATE
  const [activeModal, setActiveModal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // JOBSEEKER STATE
  const [profile, setProfile] = useState({
    name: "", title: "Frontend Developer", email: "", phone: "", bio: "", photoURL: "", cvUrl: ""
  });
  const [cvFile, setCvFile] = useState(null);

  // EMPLOYER STATE
  const [company, setCompany] = useState({
    companyName: "", industry: "", companySize: "", location: "", website: "", photoURL: "", bannerURL: ""
  });

  // COMMON STATE
  const [notifications, setNotifications] = useState({ email: true, push: true, jobAlerts: true });
  const [language, setLanguage] = useState("English");
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

  // LOAD DATA FROM FIRESTORE
  useEffect(() => {
    if (userData) {
      if (isEmployer) {
        setCompany({
          companyName: userData.companyName || "",
          industry: userData.industry || "",
          companySize: userData.companySize || "",
          location: userData.location || "",
          website: userData.website || "",
          photoURL: userData.photoURL || "",
          bannerURL: userData.bannerURL || ""
        });
      } else {
        setProfile({
          name: userData.name || currentUser?.displayName || "",
          title: userData.title || "",
          email: userData.email || currentUser?.email || "",
          phone: userData.phone || "",
          bio: userData.bio || "",
          photoURL: userData.photoURL || currentUser?.photoURL || "",
          cvUrl: userData.cvUrl || ""
        });
      }
      setNotifications(userData.notifications || { email: true, push: true, jobAlerts: true });
    }
    const savedDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDark);
    document.body.classList.toggle("dark", savedDark);
  }, [currentUser, isEmployer, userData]);

  // Upload CV to storage and get URL
  const uploadCV = async () => {
    if (!cvFile ||!currentUser) return profile.cvUrl;
    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${currentUser.uid}/resume_${Date.now()}_${cvFile.name}`);
      const snap = await uploadBytes(storageRef, cvFile);
      const url = await getDownloadURL(snap.ref);
      setUploading(false);
      return url;
    } catch (err) {
      setUploading(false);
      alert("CV Upload failed: " + err.message);
      return profile.cvUrl;
    }
  };

  // HANDLERS
  const handleSaveProfile = async () => {
    setSaving(true);
    const cvUrl = await uploadCV();
    const dataToSave = {...profile, cvUrl };
    await updateDoc(doc(db, "users", currentUser.uid), dataToSave);
    setProfile(prev => ({...prev, cvUrl}));
    setCvFile(null);
    alert("Profile saved!");
    setSaving(false);
    setActiveModal(null);
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    await updateDoc(doc(db, "users", currentUser.uid), company);
    alert("Company profile saved!");
    setSaving(false);
    setActiveModal(null);
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file ||!currentUser) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${currentUser.uid}/profilePic_${Date.now()}`);
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);
      await updateDoc(doc(db, "users", currentUser.uid), { photoURL: url });
      if (isEmployer) setCompany(prev => ({...prev, photoURL: url}));
      else setProfile(prev => ({...prev, photoURL: url}));
      alert("Profile picture updated!");
    } catch (err) {
      console.error(err)
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file ||!currentUser) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${currentUser.uid}/banner_${Date.now()}`);
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);
      await updateDoc(doc(db, "users", currentUser.uid), { bannerURL: url });
      setCompany(prev => ({...prev, bannerURL: url}));
      alert("Banner updated!");
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  const handleToggleNotif = async (key) => {
    const updated = {...notifications, [key]:!notifications[key] };
    setNotifications(updated);
    await updateDoc(doc(db, "users", currentUser.uid), { notifications: updated });
  };

  const handleLogout = async () => {
    if (confirm("Logout?")) { await logout(); navigate("/login"); }
  };

  // FIX: MOVE SETTINGS ARRAYS UP HERE BEFORE USING THEM
  const resumeDesc = profile.cvUrl
   ? <a href={profile.cvUrl} target="_blank" rel="noreferrer" style={{color: '#22c55e'}}>View Current CV</a>
    : cvFile? cvFile.name : "Upload CV";

  const jobseekerSettings = [
    { icon: <User size={22} />, title: "Profile", desc: "Edit personal info", onClick: () => setActiveModal("profile") },
    { icon: <FileText size={22} />, title: "Resume", desc: resumeDesc, onClick: () => setActiveModal("resume") },
    { icon: <Bell size={22} />, title: "Notifications", desc: "Job alerts & emails", onClick: () => setActiveModal("notifications") },
    { icon: <Shield size={22} />, title: "Security", desc: "Change password", onClick: () => setActiveModal("security") },
    { icon: <Globe size={22} />, title: "Language", desc: language, onClick: () => setActiveModal("language") },
  ];

  const employerSettings = [
    { icon: <Building2 size={22} />, title: "Company Profile", desc: "Edit company info", onClick: () => setActiveModal("company") },
    { icon: <Camera size={22} />, title: "Branding", desc: "Logo & Banner", onClick: () => setActiveModal("branding") },
    { icon: <Users size={22} />, title: "Team", desc: "Manage team members", onClick: () => navigate("/employer/team") },
    { icon: <CreditCard size={22} />, title: "Billing", desc: "Subscription & invoices", onClick: () => navigate("/employer/billing") },
    { icon: <Bell size={22} />, title: "Notifications", desc: "Application alerts", onClick: () => setActiveModal("notifications") },
    { icon: <Shield size={22} />, title: "Security", desc: "Change password", onClick: () => setActiveModal("security") },
  ];

  const settings = isEmployer? employerSettings : jobseekerSettings;
  const displayName = isEmployer? company.companyName : profile.name;
  const displaySub = isEmployer? company.industry : profile.title;
  const userInitial = displayName?.[0]?.toUpperCase() || "U";
  const currentPhoto = isEmployer? company.photoURL : profile.photoURL;

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="backBtn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h1>Settings</h1>
      </div>

      {isEmployer && (
        <div className="banner-wrapper">
          <img src={company.bannerURL || "/default-banner.jpg"} className="banner-img" alt="" />
          <label className="change-banner-btn">
            <Camera size={14}/> Change
            <input type="file" accept="image/*" onChange={handleBannerUpload} hidden />
          </label>
        </div>
      )}

      <div className="profile-card">
        <div className="avatar-wrapper">
          {currentPhoto? (
            <img src={`${currentPhoto}?t=${Date.now()}`} alt="" />
          ) : (<div className="avatar-initial">{userInitial}</div>)}
          <button className="change-avatar-btn" onClick={() => fileInputRef.current.click()} disabled={uploading}>
            {uploading? <Loader size={14} className="spin"/> : <Camera size={14} />}
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfilePicUpload} hidden />
        </div>
        <div>
          <h2>{displayName || "User"}</h2>
          <p>{displaySub} {isEmployer && <span className="role-badge">Employer</span>}</p>
        </div>
      </div>

      <div className="settings-list">
        {settings.map((item, i) => (
          <div className="setting-item" key={i} onClick={item.onClick}>
            <div className="setting-left">
              <div className="iconBox">{item.icon}</div>
              <div><h3>{item.title}</h3><p>{item.desc}</p></div>
            </div>
            <ChevronRight size={20} />
          </div>
        ))}
      </div>

      <button className="logoutBtn" onClick={handleLogout}><LogOut size={18} />Logout</button>

      {/* MODALS */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}</h2>
              <X size={22} onClick={() => setActiveModal(null)} />
            </div>

            {activeModal === "profile" &&!isEmployer && (
              <div className="modal-body">
                <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Full Name" />
                <input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} placeholder="Job Title" />
                <input value={profile.email} disabled />
                <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="Phone" />
                <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Bio" rows="3" />
                <button className="btn-save" onClick={handleSaveProfile} disabled={saving || uploading}>
                  {saving? "Saving..." : uploading? "Uploading CV..." : "Save Changes"}
                </button>
              </div>
            )}

            {activeModal === "company" && isEmployer && (
              <div className="modal-body">
                <input value={company.companyName} onChange={e => setCompany({...company, companyName: e.target.value})} placeholder="Company Name" />
                <input value={company.industry} onChange={e => setCompany({...company, industry: e.target.value})} placeholder="Industry" />
                <select value={company.companySize} onChange={e => setCompany({...company, companySize: e.target.value})}>
                  <option value="">Company Size</option>
                  <option>1-10</option><option>11-50</option><option>51-200</option><option>500+</option>
                </select>
                <input value={company.location} onChange={e => setCompany({...company, location: e.target.value})} placeholder="Location" />
                <input value={company.website} onChange={e => setCompany({...company, website: e.target.value})} placeholder="Website" />
                <button className="btn-save" onClick={handleSaveCompany} disabled={saving}>
                  {saving? "Saving..." : "Save Company"}
                </button>
              </div>
            )}

            {activeModal === "branding" && isEmployer && (
              <div className="modal-body">
                <p>Upload Company Logo</p>
                <button className="btn-outline" onClick={() => fileInputRef.current.click()}>Upload Logo</button>
                <p style={{marginTop: 16}}>Upload Banner</p>
                <label className="btn-outline">
                  Upload Banner
                  <input type="file" accept="image/*" onChange={handleBannerUpload} hidden />
                </label>
              </div>
            )}

            {activeModal === "notifications" && (
              <div className="modal-body">
                <div className="toggle-row"><span>Email Notifications</span><label className="switch"><input type="checkbox" checked={notifications.email} onChange={() => handleToggleNotif("email")} /><span className="slider"></span></label></div>
                <div className="toggle-row"><span>Push Notifications</span><label className="switch"><input type="checkbox" checked={notifications.push} onChange={() => handleToggleNotif("push")} /><span className="slider"></span></label></div>
                {!isEmployer && <div className="toggle-row"><span>Job Alerts</span><label className="switch"><input type="checkbox" checked={notifications.jobAlerts} onChange={() => handleToggleNotif("jobAlerts")} /><span className="slider"></span></label></div>}
              </div>
            )}

            {activeModal === "security" && (
              <div className="modal-body">
                <input type="password" placeholder="Current Password" value={password.current} onChange={e => setPassword({...password, current: e.target.value})} />
                <input type="password" placeholder="New Password" value={password.new} onChange={e => setPassword({...password, new: e.target.value})} />
                <input type="password" placeholder="Confirm New Password" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} />
                <button className="btn-save" onClick={() => alert("Connect to Firebase updatePassword")}>Change Password</button>
              </div>
            )}

            {activeModal === "resume" &&!isEmployer && (
              <div className="modal-body">
                {profile.cvUrl && (
                  <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{marginBottom: 12, display: 'block'}}>
                    📄 View Current CV
                  </a>
                )}
                <label className="upload-box">
                  <Upload size={20} />
                  <span>{cvFile? cvFile.name : "Click to upload PDF, DOC"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setCvFile(e.target.files[0])}
                    hidden
                  />
                </label>
                <button className="btn-save" onClick={handleSaveProfile} disabled={saving || uploading}>
                  {saving? "Saving..." : uploading? "Uploading..." : "Save CV"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}