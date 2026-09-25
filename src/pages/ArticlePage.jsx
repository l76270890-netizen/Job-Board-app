import { Eye, MessageSquare } from "lucide-react"; 
import { useNavigate, useLocation } from "react-router-dom"; // 1. ADD useLocation
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 2. ADD
import "./ArticlePage.css";

import { articles } from "../data/articles";

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
