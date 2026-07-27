import { Eye, MessageSquare } from "lucide-react"; 
import { useNavigate, useLocation } from "react-router-dom"; // 1. ADD useLocation
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 2. ADD
import "./ArticlePage.css";

const articles = [
  {
    id: 1,
    image: "6.jpg", 
    tags: ["Job Market", "Career"],
    title: "Fractional Leadership: Why Your Next Senior Hire Might Only Need Part-Time Hours",
    excerpt: "Companies are hiring senior leaders for 10-20 hours per week instead of full-time roles.",
    content: `Fractional leadership is the biggest hiring trend of 2026...`,
    date: "May 26, 2026",
    publishedDate: "2026-05-26",
    views: 1906,
    comments: 6,
    author: "Aisha Bello",
    authorImg: "https://i.pravatar.cc/100?img=5",
    category: "Career",
    readTime: "5 min read",
    coverImage: "6.jpg",
    topPick: true
  },
  {
    id: 2,
    image: "6.jpg",
    tags: ["Technology", "AI"],
    title: "How Generative AI is Reshaping Tech Recruitment in Emerging Markets",
    excerpt: "AI is screening CVs and doing first interviews. Here is what it means for job seekers.",
    content: `Generative AI is changing how recruiters hire...`,
    date: "June 02, 2026",
    publishedDate: "2026-06-02",
    views: 1420,
    comments: 12,
    author: "David Okoro",
    authorImg: "https://i.pravatar.cc/100?img=6",
    category: "Technology",
    readTime: "7 min read",
    coverImage: "6.jpg"
  },
  {
    id: 3,
    image: "6.jpg",
    tags: ["Workplace", "Remote"],
    title: "The Silent Shift Back to the Office: Balancing Autonomy and Corporate Culture",
    excerpt: "Hybrid is the new default. But companies are getting stricter with office days.",
    content: `After 3 years of remote work, companies want people back...`,
    date: "June 14, 2026",
    publishedDate: "2026-06-14",
    views: 2844,
    comments: 19,
    author: "Fatima Yusuf",
    authorImg: "https://i.pravatar.cc/100?img=7",
    category: "Workplace",
    readTime: "6 min read",
    coverImage: "6.jpg",
    topPick: true
  },
   {
    id: 4,
    image: "6.jpg",
    tags: ["Career", "Interview"],
    title: "5 Questions to Ask in an Interview to Land the Job",
    excerpt: "The questions you ask matter more than the answers you give.",
    content: `Asking good questions shows you are serious...`,
    date: "June 20, 2026",
    publishedDate: "2026-06-20",
    views: 980,
    comments: 4,
    author: "Tunde Ade",
    authorImg: "https://i.pravatar.cc/100?img=8",
    category: "Career",
    readTime: "4 min read",
    coverImage: "6.jpg"
  }
];

function ArticleCard() {
  const navigate = useNavigate();
  const location = useLocation(); // 3. GET LOCATION
  const { currentUser } = useAuth(); // 4. GET USER
  const [activeTab, setActiveTab] = useState("Discover");

  const handleClick = (article) => {
    // 5. GATE ARTICLE CLICK TOO
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }
    navigate(`/articles/${article.id}`, { state: article });
  }

  // ONLY SHOW THESE TABS IF LOGGED IN
  const tabs = currentUser 
    ? ["Discover", "Popular", "Recent", "Top Picks"] 
    : ["Discover"];

  // FILTER LOGIC FOR MAIN GRID
  const getFilteredArticles = () => {
    if (activeTab === "Popular") return [...articles].sort((a, b) => b.views - a.views);
    if (activeTab === "Recent") return [...articles].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    if (activeTab === "Top Picks") return articles.filter(a => a.topPick);
    return articles; // Discover = all
  }

  const filteredArticles = getFilteredArticles();
  const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 4);
  const recentArticles = [...articles].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)).slice(0, 4);

  return (
    <section className="articlePage-section">
      <div className="articlePage-header">
        <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span></span>
          </button>
        <h2 className="sectionPage-title">Latest Articles & Insights</h2>
        <p className="sectionPage-subtitle">Stay updated with deep dives into corporate trends and job developments</p>
      </div>

      {/* TABS BAR - ONLY SHOW EXTRA TABS IF LOGGED IN */}
      <div className="articleTabsWrapper">
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`articleTab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MAIN GRID - FILTERED BY TAB */}
      <div className="articlePage-grid">
        {filteredArticles.length > 0 ? filteredArticles.map((article) => (
          <article 
            key={article.id} 
            className="articlePage-card"
            onClick={() => handleClick(article)}
          >
            <div className="articlePage-image-wrapper">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="articlePage-content">
              <div className="articlePage-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="tagPage">{tag}</span>
                ))}
              </div>
              <h3 className="articlePage-title">{article.title}</h3>
              <div className="articlePage-footer">
                <span className="articlePage-date">{article.date}</span>
                <div className="articlePage-stats">
                  <div className="stat">
                    <Eye size={14} />
                    <span>{article.views}</span>
                  </div>
                  <div className="stat">
                    <MessageSquare size={14} />
                    <span>{article.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )) : (
          <p style={{padding: "40px", textAlign: "center", color: "#6b7280"}}>No articles found for {activeTab}</p>
        )}
      </div>

      {/* ONLY SHOW THESE 2 SECTIONS IF LOGGED IN AND ON DISCOVER TAB */}
      {currentUser && activeTab === "Discover" && (
        <>
          {/* POPULAR ARTICLES HORIZONTAL */}
          <div className='Related-jobs'>
            <h2>Popular articles</h2>
            <div className="articlePage2-grid">
              {popularArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="articlePage-card"
                  onClick={() => handleClick(article)}
                >
                  <div className="articlePage-image-wrapper">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="articlePage-content">
                    <div className="articlePage-tags">
                      {article.tags.map((tag) => (
                        <span key={tag} className="tagPage">{tag}</span>
                      ))}
                    </div>
                    <h3 className="articlePage-title">{article.title}</h3>
                    <div className="articlePage-footer">
                      <span className="articlePage-date">{article.date}</span>
                      <div className="articlePage-stats">
                        <div className="stat">
                          <Eye size={14} />
                          <span>{article.views >= 1000 ? (article.views / 1000).toFixed(1) + 'K' : article.views}</span>
                        </div>
                        <div className="stat">
                          <MessageSquare size={14} />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RECENT ARTICLES HORIZONTAL */}
          <div className='Related-jobs'>
            <h2>Recent articles</h2>
            <div className="articlePage2-grid">
              {recentArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="articlePage-card"
                  onClick={() => handleClick(article)}
                >
                  <div className="articlePage-image-wrapper">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="articlePage-content">
                    <div className="articlePage-tags">
                      {article.tags.map((tag) => (
                        <span key={tag} className="tagPage">{tag}</span>
                      ))}
                    </div>
                    <h3 className="articlePage-title">{article.title}</h3>
                    <div className="articlePage-footer">
                      <span className="articlePage-date">{article.date}</span>
                      <div className="articlePage-stats">
                        <div className="stat">
                          <Eye size={14} />
                          <span>{article.views >= 1000 ? (article.views / 1000).toFixed(1) + 'K' : article.views}</span>
                        </div>
                        <div className="stat">
                          <MessageSquare size={14} />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SHOW CTA IF NOT LOGGED IN */}
      {!currentUser && (
        <div style={{textAlign: 'center', padding: '40px 20px', background: '#f9fafb', borderRadius: '12px', marginTop: '40px'}}>
          <h3>Unlock More Articles</h3>
          <p>Sign up to see Popular, Recent and Top Picks</p>
          <button 
            className="apply-btn" 
            onClick={() => navigate('/login', { state: { from: location } })}
            style={{marginTop: '12px'}}
          >
            Login / Sign Up
          </button>
        </div>
      )}

    </section>
  );
}

export default ArticleCard;