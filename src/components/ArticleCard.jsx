import { Eye, MessageSquare } from "lucide-react"; // npm i lucide-react
import "./ArticleCard.css";

const articles = [
  {
    id: 1,
    image: "6.jpg", 
    tags: ["Job Market", "Career"],
    title: "Fractional Leadership: Why Your Next Senior Hire Might Only Need Part-Time Hours",
    date: "May 26, 2026",
    views: 1906,
    comments: 6
  },
  {
    id: 2,
    image: "6.jpg",
    tags: ["Technology", "AI"],
    title: "How Generative AI is Reshaping Tech Recruitment in Emerging Markets",
    date: "June 02, 2026",
    views: 1420,
    comments: 12
  },
  {
    id: 3,
    image: "6.jpg",
    tags: ["Workplace", "Remote"],
    title: "The Silent Shift Back to the Office: Balancing Autonomy and Corporate Culture",
    date: "June 14, 2026",
    views: 2844,
    comments: 19
  }
];

function ArticleCard() {
  return (
    <section className="article-section">
      <div className="article-header">
        <h2 className="section-title">Latest Articles & Insights</h2>
        <p className="section-subtitle">Stay updated with deep dives into corporate trends and job developments</p>
      </div>

      <div className="article-grid">
        {articles.map((article) => (
          <article key={article.id} className="article-card">
            <div className="article-image-wrapper">
              <img src={article.image} alt={article.title} />
            </div>

            <div className="article-content">
              <div className="article-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <h3 className="article-title">
                <a href={`/articles/${article.id}`}>{article.title}</a>
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
        <button className="view-all-btn">View all articles</button>
      </div>
    </section>
  );
}

export default ArticleCard;
