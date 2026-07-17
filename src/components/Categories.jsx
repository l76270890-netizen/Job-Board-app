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
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    icon: <Monitor size={34} />,
    title: "Technology",
    jobs: "1,245 Jobs",
  },
  {
    id: 2,
    icon: <Megaphone size={34} />,
    title: "Marketing",
    jobs: "835 Jobs",
  },
  {
    id: 3,
    icon: <BriefcaseBusiness size={34} />,
    title: "Business",
    jobs: "650 Jobs",
  },
  {
    id: 4,
    icon: <Users size={34} />,
    title: "Human Resources",
    jobs: "512 Jobs",
  },
  {
    id: 5,
    icon: <HeartPulse size={34} />,
    title: "Healthcare",
    jobs: "903 Jobs",
  },
  {
    id: 6,
    icon: <Landmark size={34} />,
    title: "Finance",
    jobs: "721 Jobs",
  },
];

function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle) => {
    console.log("Category clicked:", categoryTitle);
    // Go to jobs page and filter by category
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
          >
            <div className="category-icon">
              {category.icon}
            </div>

            <h3>{category.title}</h3>

            <p>{category.jobs}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;