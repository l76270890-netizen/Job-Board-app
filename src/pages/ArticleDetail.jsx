import "./ArticleDetail.css";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Bookmark,
  Share2,
  Tag,
  Check
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { articles } from "../data/articles";
function ArticleDetail() {
  const navigate = useNavigate();
  const { state: articleFromState } = useLocation();
  const { id } = useParams();
  const [copied, setCopied] = useState(false); // <-- add this

  // 1. Get article from state OR find by ID for refresh support
  const article = articleFromState || articles.find(a => a.id === Number(id));

  // SHARE FUNCTION - NEW
  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };

    try {
      // 1. Try native share - works on mobile Chrome, Safari
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 2. Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log("Share cancelled", err);
    }
  };

  if (!article) {
    return (
      <section className="articleDetail">
        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <p style={{textAlign: 'center', marginTop: '40px'}}>
          Article not found. Go back to 
          <span style={{color: '#2563eb', cursor: 'pointer'}} onClick={() => navigate('/articles')}> Articles</span>
        </p>
      </section>
    )
  }

  return (
    <section className="articleDetail">
      <div className="articleContainer">
        <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} style={{color:"#166534"}} />
          Back to Articles
        </button>

        {/* HERO */}
        <div className="articleHero">
          <div className="articleMetaTop">
            <span className="categoryTag"><Tag size={14}/>{article.category}</span>
            <span><Clock size={14}/>{article.readTime}</span>
          </div>
          <h1>{article.title}</h1>
          <p className="articleExcerpt">{article.excerpt}</p>

          <div className="articleAuthorBar">
            <div className="authorInfo">
              <img src={article.authorImg} alt={article.author} />
              <div>
                <p className="authorName">{article.author}</p>
                <p className="publishDate"><Calendar size={14}/> {new Date(article.publishedDate).toDateString()}</p>
              </div>
            </div>
            <div className="articleActions">
              {/* UPDATED SHARE BUTTON */}
              <button onClick={handleShare} title="Share article">
                {copied ? <Check size={18} color="green"/> : <Share2 size={18}/>}
                {copied ? 'Copied' : ''}
              </button>
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        <img src={article.coverImage} alt={article.title} className="articleCover" />

        {/* CONTENT */}
        <div className="articleContent">
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* TAGS */}
        <div className="articleTags">
          {article.tags.map(tag => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="articleCTA">
          <h3>Looking for your next role?</h3>
          <p>Browse thousands of jobs on our platform</p>
          <button onClick={() => navigate('/jobs')}>View Open Jobs</button>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="articleSidebar">
        <div className="sideCard">
          <h4>About the Author</h4>
          <div className="sideAuthor">
            <img src={article.authorImg} alt={article.author} />
            <div>
              <p>{article.author}</p>
              <span>Career Coach</span>
            </div>
          </div>
        </div>

       <div className="sideCard">
        <h4>Related Articles</h4>
        {articles
          .filter(a => a.id !== article.id) // exclude current article
          .slice(0,3) // show only 3
          .map(rel => (
            <div 
              key={rel.id} 
              className="relatedItem" 
              onClick={() => navigate(`/articles/${rel.id}`, {state: rel})}
            >
              <img src={rel.coverImage} alt={rel.title} />
              <div className="relatedInfo">
                <p>{rel.title}</p>
                <span>{new Date(rel.publishedDate).toDateString()}</span> {/* fixed bug: was publishedAt */}
              </div>
            </div>
        ))}
      </div>
      </aside>
    </section>
  );
}

export default ArticleDetail;
