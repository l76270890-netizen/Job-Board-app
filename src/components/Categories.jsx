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
  Loader2
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMemo, useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore"; // ADDED
import { db } from "../firebase";
import { jobs as staticJobs } from "../pages/AllJobs"; // fallback

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
  const [jobsList, setJobsList] = useState([]); // NEW: hold firestore + static
  const [loading, setLoading] = useState(true);

  // 1. LOAD JOBS FROM FIRESTORE - SAME LOGIC AS ALLJOBS
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "jobs"),
          where("status", "==", "active"), // only count active jobs
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q); // cache first = instant
        const firestoreJobs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            category: data.category || "Other",
          ...data
          }
        });

        // Merge with static jobs as fallback
        setJobsList([...firestoreJobs,...staticJobs]);
      } catch (error) {
        console.error("Error fetching jobs for categories:", error);
        setJobsList(staticJobs); // fallback
      }
      setLoading(false);
    };
    fetchJobs();

    // 2. REALTIME UPDATES - SAME AS ALLJOBS
    const q = query(collection(db, "jobs"), where("status", "==", "active"));
    const unsub = onSnapshot(q, (snapshot) => {
      const firestoreJobs = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, category: data.category || "Other",...data }
      });
      setJobsList([...firestoreJobs,...staticJobs]);
    });
    return () => unsub();
  }, []);

  // 3. COUNT JOBS PER CATEGORY AUTOMATICALLY FROM FIRESTORE
  const categories = useMemo(() => {
    const counts = {};
    jobsList.forEach(job => {
      const cat = job.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
    .map(([title, count]) => ({
        id: title,
        icon: categoryIcons[title] || <BriefcaseBusiness size={34} />, // fallback icon
        title: title,
        jobs: `${count} ${count === 1? 'Job' : 'Jobs'}`, // "12 Jobs"
        count: count
      }))
    .sort((a, b) => b.count - a.count) // most jobs first
    .slice(0, 8); // show top 8. Remove this to show all
  }, [jobsList]);

  const handleCategoryClick = (categoryTitle) => {
    console.log("Category clicked:", categoryTitle);

    // LOGIN CHECK
    if (!currentUser) {
      navigate("/login", {
        state: {
          from: location,
          selectedCategory: categoryTitle // remember what they clicked
        }
      });
      return;
    }

    // If logged in, go to jobs page and pass category in state
    // AllJobs already reads location.state.selectedCategory
    navigate(`/jobs`, { state: { selectedCategory: categoryTitle } });
  };

  return (
    <section className="categories">
      <div className="categories-header">
        <div>
          <h2>Browse by Category</h2>
          <p>Find opportunities in your preferred field.</p>
        </div>
      </div>

      {loading && (
        <div style={{textAlign: 'center', padding: '20px'}}>
          <Loader2 size={24} className="spin" /> Loading categories...
        </div>
      )}

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

            <p>{category.jobs}</p> {/* Now shows real count from Firestore */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
