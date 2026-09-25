
import { Eye, MessageSquare } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; // 1. ADDED
import { articles } from "../data/articles";
import "./ArticleCard.css";

function ArticleCard() {
  const navigate = useNavigate(); // 2. ADDED

  const handleClick = (article) => { // 3. NEW: navigate with state
    navigate(`/articles/${article.id}`, { state: article });
  }

  return (
    <section className="article-section">
      <div className="article-header">
        <h2 className="section-title">Latest Articles & Insights</h2>
        <p className="section-subtitle">Stay updated with deep dives into corporate trends and job developments</p>
      </div>

      <div className="article-grid">
        {articles.map((article) => (
          <article 
            key={article.id} 
            className="article-card"
            onClick={() => handleClick(article)} // 4. MAKE CARD CLICKABLE
          >
            <div className="article-image-wrapper">
              <img src={article.image} alt={article.title} />
            </div>

            <div className="article-content">
              <div className="article-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="tags">{tag}</span>
                ))}
              </div>

              <h3 className="article-title">
                {article.title} {/* removed <a> tag */}
              </h3>

              <div className="article-footer">
                <span className="article-date">{article.date}</span>
                
                <div className="article-stats">
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
        ))}
      </div>

      <div className="action-wrapper">
        <button className="view1-all-btn" onClick={() => navigate('/articles')}>View all articles</button>
      </div>
    </section>
  );
}

export default ArticleCard;
