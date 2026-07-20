import "./ArticleDetail.css";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Bookmark,
  Share2,
  Tag
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// Dummy articles array. Replace with import from your articles file
export const articles = [
  { 
    id: 1, 
    title: "How to Land a Remote Tech Job in 2026",
    excerpt: "Remote work is booming in Africa. Here are 7 proven strategies to get hired remotely.",
    content: `Remote tech jobs have opened doors for thousands of developers, designers, and product people across Africa.\n\nIn 2026, companies are hiring more than ever. But competition is also higher.\n\nHere are 7 things that actually work:\n\n1. Build a public portfolio on GitHub and Dribbble\n2. Apply to companies that are already remote-first\n3. Tailor your CV to highlight async communication skills\n4. Get active on LinkedIn and Twitter\n5. Take assessments seriously\n6. Practice system design and behavioral interviews\n7. Follow up within 48 hours\nThe key is consistency. Apply to 5 jobs per week and you’ll get interviews within 30 days.`,
    author: "Sarah Johnson",
    authorImg: "https://i.pravatar.cc/100?img=1",
    category: "Career Advice",
    readTime: "6 min read",
    publishedDate: "2026-09-28",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
    tags: ["Remote Work", "Career", "Tech"]
  },
  { 
    id: 2, 
    title: "Top 10 Skills Employers Want in 2026",
    excerpt: "AI, Data, and Communication are top. Here is the full list and how to learn them.",
    content: `The job market is shifting fast...\n\nFull article content here.`,
    author: "Michael Ade",
    authorImg: "https://i.pravatar.cc/100?img=2",
    category: "Skills",
    readTime: "8 min read",
    publishedDate: "2026-09-25",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200",
    tags: ["Skills", "AI", "Learning"]
  },
  // add more articles...
];

function ArticleDetail() {
  const navigate = useNavigate();
  const { state: articleFromState } = useLocation();
  const { id } = useParams();

  // 1. Get article from state OR find by ID for refresh support
  const article = articleFromState || articles.find(a => a.id === Number(id));

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
          <ArrowLeft size={20} />
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
              <button><Bookmark size={18}/></button>
              <button><Share2 size={18}/></button>
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
          <button onClick={() => navigate('/all-jobs')}>View Open Jobs</button>
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
          <span>{new Date(rel.publishedAt).toDateString()}</span>
        </div>
      </div>
  ))}
</div>
      </aside>
    </section>
  );
}

export default ArticleDetail;
