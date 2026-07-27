
import "./Categories.css";
import {
  Monitor,
  Megaphone,
  BriefcaseBusiness,
  Users,
  HeartPulse,
  Landmark,
  GraduationCap,
  Palette,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
import { useMemo } from "react";
import { jobs as allJobs } from "../pages/AllJobs"; // 1. IMPORT YOUR JOBS

const categoryIcons = { // 2. MAP ICONS TO TITLE
  "Technology": <Monitor size={34} />,
  "Marketing": <Megaphone size={34} />,
  "Business": <BriefcaseBusiness size={34} />,
  "Human Resources": <Users size={34} />,
  "Healthcare": <HeartPulse size={34} />,
  "Finance": <Landmark size={34} />,
  "Education": <GraduationCap size={34} />,
  "Design": <Palette size={34} />,
};

function Categories() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { currentUser } = useAuth(); 

  // 3. COUNT JOBS PER CATEGORY AUTOMATICALLY
  const categories = useMemo(() => {
    const counts = {};
    allJobs.forEach(job => {
      counts[job.category] = (counts[job.category] || 0) + 1;
    });

    // Only show categories that have jobs
    return Object.entries(counts)
     .map(([title, count], index) => ({
        id: index + 1,
        icon: categoryIcons[title] || <BriefcaseBusiness size={34} />, // fallback icon
        title: title,
        jobs: `${count} ${count === 1? 'Job' : 'Jobs'}`, // "12 Jobs"
        count: count
      }))
     .sort((a, b) => b.count - a.count) // most jobs first
     .slice(0, 6); // show top 6. Remove this to show all
  }, []);

  const handleCategoryClick = (categoryTitle) => {
    console.log("Category clicked:", categoryTitle);

    // LOGIN CHECK
    if (!currentUser) {
      navigate("/login", { 
        state: { 
          from: location,
          filters: { selectedCategory: categoryTitle } // remember what they clicked
        } 
      });
      return;
    }

    // If logged in, go to jobs page and filter by category
    navigate(`/jobs?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <section className="categories">
      <div className="categories-header">
        <div>
          <h2>Browse by Category</h2>
          <p>Find opportunities in your preferred field.</p>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div 
            className="category-card" 
            key={category.id}
            onClick={() => handleCategoryClick(category.title)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(category.title)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-icon">
              {category.icon}
            </div>

            <h3>{category.title}</h3>

            <p>{category.jobs}</p> {/* Now shows real count like "12 Jobs" */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
