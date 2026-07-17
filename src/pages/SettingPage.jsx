import "./SettingPage.css";
import {
  ArrowLeft,
  User,
  Bell,
  Moon,
  Shield,
  Globe,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingPage() {
  const navigate = useNavigate();

  const settings = [
    {
      icon: <User size={22} />,
      title: "Profile",
      desc: "Edit your personal information",
    },
    {
      icon: <Bell size={22} />,
      title: "Notifications",
      desc: "Manage alerts and emails",
    },
    {
      icon: <Moon size={22} />,
      title: "Appearance",
      desc: "Dark mode & theme",
    },
    {
      icon: <Shield size={22} />,
      title: "Privacy & Security",
      desc: "Password and account security",
    },
    {
      icon: <Globe size={22} />,
      title: "Language",
      desc: "English",
    },
    {
      icon: <FileText size={22} />,
      title: "Resume",
      desc: "Upload or update CV",
    },
  ];

  return (
    <div className="settings-page">

      <div className="settings-header">
        <button className="backBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <h1>Settings</h1>
      </div>

      <div className="profile-card">
        <img
          src="https://i.pravatar.cc/150?img=8"
          alt=""
        />

        <div>
          <h2>Lawrence Ifeanyi</h2>
          <p>Frontend Developer</p>
        </div>
      </div>

      <div className="settings-list">
        {settings.map((item, index) => (
          <div className="setting-item" key={index}>
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

      <button className="logoutBtn">
        <LogOut size={18} />
        Logout
      </button>

    </div>
  );
}