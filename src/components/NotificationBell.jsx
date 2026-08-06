import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./NotificationBell.css";

function NotificationBell() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [prevNotifIds, setPrevNotifIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  const playSound = () => {
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
    audio.play().catch(() => {});
  }

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const newNotifs = snapshot.docs.map(d => ({ id: d.id,...d.data() }));

      const newUnread = newNotifs.filter(n =>
      !n.read &&!prevNotifIds.includes(n.id)
      );

      if(newUnread.length > 0) {
        playSound();
        toast.success(`${newUnread[0].title}: ${newUnread[0].message}`, {
          duration: 4000,
          icon: '🔔',
          onClick: () => {
            navigate(newUnread[0].link);
            updateDoc(doc(db, "notifications", newUnread[0].id), { read: true });
          }
        });
      }

      setPrevNotifIds(newNotifs.map(n => n.id));
      setNotifications(newNotifs);
    });
    return () => unsub();
  }, [currentUser, prevNotifIds, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current &&!ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n =>!n.read).length;

  const handleClickNotification = async (notif) => {
    await updateDoc(doc(db, "notifications", notif.id), { read: true });
    navigate(notif.link);
    setShowDropdown(false);
  }

  return (
    <div className="notification-wrapper" ref={ref}>
      <div className="bell-icon" onClick={() => setShowDropdown(!showDropdown)}>
        <Bell size={22} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">Notifications</div>
          {notifications.length === 0? (
            <div className="notification-empty">No notifications yet</div>
          ) : (
            notifications.slice(0, 5).map(notif => (
              <div
                key={notif.id}
                className={`notification-item ${!notif.read? 'unread' : ''}`}
                onClick={() => handleClickNotification(notif)}
              >
                <div className="notification-title">{notif.title}</div>
                <div className="notification-message">{notif.message}</div>
                <div className="notification-time">
                  {notif.createdAt?.toDate().toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
export default NotificationBell;