import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Search, MoreVertical, Check, CheckCheck } from "lucide-react";
import "./MessagesPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection, query, where, orderBy, onSnapshot, addDoc,
  serverTimestamp, doc, getDoc, updateDoc
} from "firebase/firestore";

function MessagesPage() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { currentUser, userData } = useAuth();
  const isEmployer = userData?.role === "employer";

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const messagesEndRef = useRef(null);

  // 1. LOAD ALL CONVERSATIONS FOR CURRENT USER - SEPARATED BY ROLE
  useEffect(() => {
    if(!currentUser) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const convos = [];
      for(const d of snap.docs){
        const data = d.data();
        const otherId = data.participants.find(id => id!== currentUser.uid);
        const otherSnap = await getDoc(doc(db, "users", otherId));
        const otherData = otherSnap.data() || {};

        // ROLE FILTER: Jobseeker only sees employers, Employer only sees jobseekers
        if(isEmployer && otherData.role!== 'jobseeker') continue;
        if(!isEmployer && otherData.role!== 'employer') continue;

        convos.push({
          id: d.id,
         ...data,
          otherUser: {
           ...otherData,
            uid: otherId
          }
        });
      }
      setConversations(convos);

      if(chatId){
        const active = convos.find(c => c.id === chatId);
        if(active) { setActiveChat(active); setShowChat(true); }
      } else if(convos.length > 0 &&!activeChat) {
        setActiveChat(convos[0]); setShowChat(true);
      }
    });
    return () => unsub();
  }, [currentUser, chatId, isEmployer]);

  // 2. LOAD MESSAGES FOR ACTIVE CHAT
  useEffect(() => {
    if(!activeChat) return;
    const q = query(collection(db, "conversations", activeChat.id, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({id: d.id,...d.data()})));
    });
    return () => unsub();
  }, [activeChat]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if(!activeChat ||!currentUser) return;
    const unread = messages.filter(m => m.senderId!== currentUser.uid &&!m.read);
    if(unread.length > 0) {
      unread.forEach(m => {
        updateDoc(doc(db, "conversations", activeChat.id, "messages", m.id), { read: true });
      })
    }
  }, [messages, activeChat, currentUser])

  const handleSelectChat = (convo) => {
    setActiveChat(convo);
    setShowChat(true);
  };

  const handleBack = () => setShowChat(false);

  const sendMessage = async () => {
    if (newMessage.trim() === "" ||!activeChat) return;
    const text = newMessage; // save before clearing
    setNewMessage(""); // CLEAR INPUT IMMEDIATELY

    const newMsgRef = await addDoc(collection(db, "conversations", activeChat.id, "messages"), {
      senderId: currentUser.uid,
      text: text,
      createdAt: serverTimestamp(),
      read: false
    });

    // Update last message in convo
    await updateDoc(doc(db, "conversations", activeChat.id), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      [`unread_${activeChat.otherUser.uid}`]: (activeChat[`unread_${activeChat.otherUser.uid}`] || 0) + 1
    });
  };

  const filteredConvos = conversations.filter(c => {
    const name = isEmployer? c.otherUser?.name : c.otherUser?.companyName;
    return name?.toLowerCase().includes(searchTitle.toLowerCase())
  });

  if(!currentUser) return <div className="messages-container"><p>Login to see messages</p></div>;

  return (
    <div className="messages-container">
      {/* Sidebar - Conversations */}
      <aside className={`messages-sidebar ${showChat? 'hide-mobile' : ''}`}>
        <div className="messages-header">
          <ArrowLeft size={20} className="back-btn" onClick={() => navigate(-1)} />
          <h2>Messages</h2>
          <MoreVertical size={21} />
        </div>
        <div className="mobileChatSeach">
          <input type="text" placeholder="Search..." value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
          <Search size={20} style={{ position:"relative", right:"36px", top:"7px" }} />
        </div>
        <div className="convo-list">
          {filteredConvos.length === 0? <p style={{textAlign: 'center', padding: '20px'}}>No messages yet</p> :
          filteredConvos.map((convo) => (
            <div
              key={convo.id}
              className={`convo-item ${activeChat?.id === convo.id? "active" : ""}`}
              onClick={() => handleSelectChat(convo)}
            >
              <img src={convo.otherUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(isEmployer? convo.otherUser?.name : convo.otherUser?.companyName)}&background=2563EB&color=fff`} alt="" />
              <div className="convo-info">
                <h4>
                  {isEmployer? convo.otherUser?.name : convo.otherUser?.companyName}
                </h4>
                <p>{convo.lastMessage || "Start conversation"}</p>
              </div>
              {convo[`unread_${currentUser.uid}`] > 0 &&
                <span className="unread-badge">{convo[`unread_${currentUser.uid}`]}</span>
              }
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <main className={`chat-window ${!showChat? 'hide-mobile' : ''}`}>
        {activeChat? <>
        <div className="chat-header">
          <ArrowLeft size={20} className="backbtn" onClick={handleBack} />
          <img src={activeChat.otherUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(isEmployer? activeChat.otherUser?.name : activeChat.otherUser?.companyName)}&background=2563EB&color=fff`} alt="" />
          <div>
            <h3>{isEmployer? activeChat.otherUser?.name : activeChat.otherUser?.companyName}</h3>
            <span>{activeChat.jobTitle || "Job Discussion"}</span>
          </div>
          <MoreVertical size={20} className="more-btn" />
        </div>

        <div className="chat-messages">
          {messages.length === 0? (
            <p className="empty-state">No messages yet. Say hi 👋</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-bubble ${ msg.senderId === currentUser.uid? "sent" : "received" }`}
              >
                <p>{msg.text}</p>
                <div className="message-meta">
                  <span className="message-time">
                    {msg.createdAt?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {msg.senderId === currentUser.uid && (
                    <span className="message-status">
                      {msg.read? <Check size={14} color="#22C55E" /> : <Check size={14} />}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}><Send size={18} /></button>
        </div>
        </> : <div className="empty-state">Select a conversation</div>}
      </main>
    </div>
  );
}

export default MessagesPage;