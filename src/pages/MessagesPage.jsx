import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Search, MoreVertical } from "lucide-react";
import "./MessagesPage.css";
import { useNavigate, useParams } from "react-router-dom";



// Fake users for demo. Replace with your real users
const DEMO_USERS = [
  { id: 1, name: "Aisha Bello", role: "Product Designer @ TechNova", avatar: "6.jpg" },
  { id: 2, name: "Tunde Adebayo", role: "Frontend Engineer", avatar: "6.jpg" },
  { id: 3, name: "HR - GIZ Nigeria", role: "Recruiter", avatar: "6.jpg" },
   { id: 4, name: "Aisha Bello", role: "Product Designer @ TechNova", avatar: "6.jpg" }
];

const CURRENT_USER_ID = 99; // Your logged in user id

function MessagesPage() {
   const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(DEMO_USERS[0]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false); // NEW: for mobile toggle
    const [searchTitle, setSearchTitle] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("jobBoardMessages")) || [];
    setMessages(saved);
  }, []);

  // Filter messages for active chat
  const chatMessages = messages.filter(
    (m) =>
      (m.sender_id === CURRENT_USER_ID && m.receiver_id === activeChat.id) ||
      (m.receiver_id === CURRENT_USER_ID && m.sender_id === activeChat.id)
  );

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSelectChat = (user) => {
    setActiveChat(user);
    setShowChat(true); // on mobile, switch to chat view
  };

  const handleBack = () => {
    setShowChat(false); // on mobile, go back to list
  };


  
  const clearAll = () => {
    setSearchTitle("");
   
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const msg = {
      id: Date.now(),
      sender_id: CURRENT_USER_ID,
      receiver_id: activeChat.id,
      text: newMessage,
      created_at: new Date().toISOString(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem("jobBoardMessages", JSON.stringify(updated));
    setNewMessage("");
  };

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
            <input type="text" placeholder="Search ..."  value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
             <Search size={20} style={{
              position:"relative",
              right:"36px",
              top:"7px"
             }}
             />
          </div>
        <div className="convo-list">
          {DEMO_USERS.map((user) => (
            <div
              key={user.id}
              className={`convo-item ${activeChat.id === user.id? "active" : ""}`}
              onClick={() => handleSelectChat(user)}
            >
              <img src={user.avatar} alt={user.name} />
              <div className="convo-info">
                <h4>{user.name}</h4>
                <p>{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <main className={`chat-window ${!showChat? 'hide-mobile' : ''}`}>
        <div className="chat-header">
          <ArrowLeft size={20} className="backbtn" onClick={handleBack} />
          <img src={activeChat.avatar} alt={activeChat.name} />
          <div>
            <h3>{activeChat.name}</h3>
            <span>Active now</span>
          </div>
          <MoreVertical size={20} className="more-btn" />
        </div>

        <div className="chat-messages">
          {chatMessages.length === 0? (
            <p className="empty-state">No messages yet. Say hi to {activeChat.name} 👋</p>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`message-bubble ${
                  msg.sender_id === CURRENT_USER_ID? "sent" : "received"
                }`}
              >
                {msg.text}
                <span className="message-time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
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
          <button onClick={sendMessage}>
            <Send size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default MessagesPage;