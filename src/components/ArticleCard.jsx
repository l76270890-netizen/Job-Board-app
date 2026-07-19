
import { Eye, MessageSquare } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; // 1. ADDED
import "./ArticleCard.css";

const articles = [
  {
    id: 1,
    image: "6.jpg", 
    tags: ["Job Market", "Career"],
    title: "Fractional Leadership: Why Your Next Senior Hire Might Only Need Part-Time Hours",
    excerpt: "Companies are hiring senior leaders for 10-20 hours per week instead of full-time roles.",
    content: `Fractional leadership is the biggest hiring trend of 2026...\n\nFull article content goes here.\n\nCompanies save 60% on costs while getting C-level expertise.`,
    date: "May 26, 2026",
    publishedDate: "2026-05-26", // added for detail page
    views: 1906,
    comments: 6,
    author: "Aisha Bello",
    authorImg: "https://i.pravatar.cc/100?img=5",
    category: "Career",
    readTime: "5 min read",
    coverImage: "6.jpg"
  },
  {
    id: 2,
    image: "6.jpg",
    tags: ["Technology", "AI"],
    title: "How Generative AI is Reshaping Tech Recruitment in Emerging Markets",
    excerpt: "AI is screening CVs and doing first interviews. Here is what it means for job seekers.",
    content: `Generative AI is changing how recruiters hire...\n\nFull article content goes here.`,
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
    content: `After 3 years of remote work, companies want people back...\n\nFull article content goes here.`,
    date: "June 14, 2026",
    publishedDate: "2026-06-14",
    views: 2844,
    comments: 19,
    author: "Fatima Yusuf",
    authorImg: "https://i.pravatar.cc/100?img=7",
    category: "Workplace",
    readTime: "6 min read",
    coverImage: "6.jpg"
  }
];

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
 <div className="View-button" onClick={() => navigate('/companies')}>
        View all
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
                  <span key={tag} className="tag">{tag}</span>
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
        <button className="view-all-btn" onClick={() => navigate('/articles')}>View all articles</button>
      </div>
    </section>
  );
}

export default ArticleCard;
