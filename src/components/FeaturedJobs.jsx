import { useState, useEffect } from "react";
import "./FeaturedJobs.css";
import {
  MapPin,
  Clock3,
  Bookmark,
  Briefcase,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // 1. Use supabase instead of API_URL

function FeaturedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. FETCH FEATURED JOBS FROM SUPABASE
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
         .from("jobboard-app")
         .select("*")
         .eq("is_featured", true) // add this column in supabase, or use .limit(6)
         .limit(6); // show only 6 featured

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryTitle)}`);
  };
  
  return (
    <section className="featured">
      
      {/* DESKTOP VIEW */}
      <div className="desktop-view">
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all →</a>
        </div>
        <hr />

        {loading ? (
          <p style={{padding: "20px", textAlign: "center"}}>Loading featured jobs...</p>
        ) : error ? (
          <p style={{padding: "20px", textAlign: "center", color: "red"}}>Error: {error}</p>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            // 3. FIX: navigate by ID only. No state
            <div className="job-card" key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
              <div className="job-left">
                <img 
                  src={`https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s/g,'')}.com`}
                  alt={job.company} 
                  className="company-logo"
                  onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                />
                <div className="job-details">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <div className="location">
                    <MapPin size={15}/>
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="job-right">
                <span className="job-type">{job.type}</span>
                <span className="posted">
                  <Clock3 size={14}/>
                  {new Date(job.posted_date).toLocaleDateString()} {/* 4. FIX: snake_case */}
                </span>
                <Bookmark className="bookmark" onClick={(e) => e.stopPropagation()} />
              </div>
            </div>
          ))
        ) : (
          <p style={{padding: "20px", textAlign: "center"}}>No featured jobs right now</p>
        )}
      </div>

      {/* MOBILE VIEW */}
      <div className="mobileJobList1"
        style={{
          position:"relative",
          top:"-410px",
          height:"77vh"
        }}
      >
        <hr />
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <a href="/jobs">View all</a>
        </div>

        {loading ? (
          <p style={{padding: "20px", textAlign: "center"}}>Loading featured jobs...</p>
        ) : error ? (
          <p style={{padding: "20px", textAlign: "center", color: "red"}}>Error: {error}</p>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            // 5. FIX: same here
            <div
              className="mobileCard1"
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="mobileTop1">
                <img 
                  src={`https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s/g,'')}.com`}
                  alt={job.company}
                  onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                />
                <Bookmark size={18} onClick={(e) => { e.stopPropagation(); }} />
              </div>

              <h3>{job.title}</h3>
              <p className="companyName1">{job.company}</p>

              <div className="mobileInfo1">
                <span><MapPin size={14} /> {job.location}</span>
                <span><Briefcase size={14} /> {job.type}</span>
              </div>

              <p className="mobileDesc1">{job.description}</p>

              <div className="mobileBottom1">
                <div className="salary1">${job.salary?.toLocaleString()}</div>
                <button onClick={(e) => { e.stopPropagation(); alert(`Applying for ${job.title}`); }}>
                  Apply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{padding: "20px", textAlign: "center"}}>No featured jobs right now</p>
        )}
      </div>

    </section>
  );
}

export default FeaturedJobs;