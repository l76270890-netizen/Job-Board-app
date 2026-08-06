import "./AllJobs.css";
import {
  Search, MapPin, Bookmark, Briefcase, DollarSign, ArrowLeft, SlidersHorizontal,
  X, ArrowUpDown, Check, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"; // ADDED
import { db } from "../firebase"; // ADDED

export const jobs = [
  // TEACHING - 7
 
];

const DESKTOP_JOBS_PER_PAGE = 9;
const MOBILE_JOBS_PER_PAGE = 6;

const getPageNumbers = (current, total) => {
  const pages = [];
  const delta = 2;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1]!== '...') {
      pages.push('...');
    }
  }
  return pages;
};

export default function AllJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("find");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsList, setJobsList] = useState([]); // CHANGED: start empty
  const [filters, setFilters] = useState({ category: [], type: [], experience: [], salary: [] });
  const [loading, setLoading] = useState(true); // ADDED

  const sortOptions = ["Newest", "Oldest", "A-Z", "Z-A", "Salary: High-Low", "Salary: Low-High"];
  const allCategories = ["Teaching", "Business", "IT", "Finance", "Healthcare", "Marketing", "Technology"];

 // ADDED: Fetch Firestore jobs and merge with static jobs
useEffect(() => {
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 1. Get jobs from Firestore - REMOVE the status filter for now
      const q = query(
        collection(db, "jobs"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const firestoreJobs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "No Title",
          company: data.companyName || "Unknown Company",
          logo: "https://via.placeholder.com/40",
          location: data.location || "Remote",
          type: data.jobType || "Full-time",
          salary: data.salaryMax || data.salaryMin || 50000, // use ₦50k default
          category: data.category || "Other",
          experience: data.experience || "Mid-Level",
          postedDate: data.createdAt?.toDate().toISOString().split('T')[0] || "2026-01-01",
          description: data.description || "",
          responsibilities: [],
          skills: data.requirements || [],
          benefits: data.benefits || [],
          isFirestore: true
        }
      });

      // 2. Get saved jobs from localStorage
      const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];

      // 3. Merge static + firestore jobs
      const allJobs = [...jobs,...firestoreJobs].map(job => ({
       ...job,
        is_saved: savedIds.includes(job.id)
      }));

      console.log("Jobs loaded:", allJobs.length); // debug
      setJobsList(allJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobsList(jobs); // fallback to static
    }
    setLoading(false);
  };
  fetchJobs();
}, []);

  // READ FILTERS FROM HERO
  useEffect(() => {
    const state = location.state;
    if (state) {
      if (state.selectedCategory) setFilters(prev => ({...prev, category: [state.selectedCategory] }));
      if (state.location) setSearchLocation(state.location.replace(", Nigeria", ""));
      if (state.jobType) setFilters(prev => ({...prev, type: [state.jobType] }));
      if (state.search) setSearchTitle(state.search);
    }
  }, [location.state]);

  useEffect(() => setCurrentPage(1), [searchTitle, searchLocation, filters, sortBy, activeTab]);

  const requireAuth = (action) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }
    action();
  }

  const toggleFilter = (category, value) => {
    setFilters(prev => ({...prev, [category]: prev[category].includes(value)? prev[category].filter(v => v!== value) : [...prev[category], value] }));
  };

  const clearAll = () => {
    setFilters({ category: [], type: [], experience: [], salary: [] });
    setSortBy("Newest");
    setSearchTitle("");
    setSearchLocation("");
    setCurrentPage(1);
    setActiveTab("find");
    navigate('/jobs');
  };

  const handleToggleSave = (e, jobId) => {
    e.stopPropagation();
    requireAuth(() => {
      const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
      let newSavedIds;
      if (savedIds.includes(jobId)) {
        newSavedIds = savedIds.filter(id => id!== jobId);
      } else {
        newSavedIds = [...savedIds, jobId];
      }
      localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
      setJobsList(prev => prev.map(job => job.id === jobId? {...job, is_saved:!job.is_saved } : job));
      if(activeTab === "saved" && savedIds.includes(jobId)) {
        setCurrentPage(1);
      }
    })
  };

  const handleApplyClick = (e, job) => {
    e.stopPropagation();
    requireAuth(() => {
      navigate(`/jobs/${job.id}`, { state: job });
    })
  }

  // MAIN FILTER + SEARCH LOGIC
  const filteredJobs = useMemo(() => {
    let result = [...jobsList];

    if (searchTitle) {
      const query = searchTitle.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.description.toLowerCase().includes(query) ||
        j.category.toLowerCase().includes(query) ||
        j.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (searchLocation) {
      const locQuery = searchLocation.toLowerCase();
      result = result.filter(j => j.location.toLowerCase().includes(locQuery));
    }

    if (filters.category.length) result = result.filter(j => filters.category.includes(j.category));
    if (filters.type.length) result = result.filter(j => filters.type.includes(j.type));
    if (filters.experience.length) result = result.filter(j => filters.experience.includes(j.experience));
    if (filters.salary.length) {
      result = result.filter(j => filters.salary.some(s => {
        if (s === "$1000+") return j.salary >= 1000;
        if (s === "$3000+") return j.salary >= 3000;
        if (s === "$5000+") return j.salary >= 5000;
        return false;
      }))
    }

    if (sortBy === "Newest") result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    if (sortBy === "Oldest") result.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    if (sortBy === "A-Z") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "Z-A") result.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === "Salary: High-Low") result.sort((a, b) => b.salary - a.salary);
    if (sortBy === "Salary: Low-High") result.sort((a, b) => a.salary - b.salary);

    return result;
  }, [searchTitle, searchLocation, filters, sortBy, jobsList]);

  const displayedJobs = useMemo(() => {
    if (activeTab === "saved") return filteredJobs.filter(j => j.is_saved);
    if (activeTab === "applications") return filteredJobs.filter(j => j.hasApplied);
    return filteredJobs;
  }, [activeTab, filteredJobs])

  const activeFiltersCount = filters.category.length + filters.type.length + filters.experience.length + filters.salary.length;
  const totalPages = Math.ceil(displayedJobs.length / DESKTOP_JOBS_PER_PAGE);
  const mobileTotalPages = Math.ceil(displayedJobs.length / MOBILE_JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * DESKTOP_JOBS_PER_PAGE;
  const mobileStartIndex = (currentPage - 1) * MOBILE_JOBS_PER_PAGE;
  const currentJobs = displayedJobs.slice(startIndex, startIndex + DESKTOP_JOBS_PER_PAGE);
  const currentMobileJobs = displayedJobs.slice(mobileStartIndex, mobileStartIndex + MOBILE_JOBS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > Math.max(totalPages, mobileTotalPages)) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="allJobs">
      <div className="desktopJobs">
        <div className="backHeader">
          <button className="backBtn" onClick={() => navigate(-1)}><ArrowLeft size={22} /><span></span></button>
        </div>
        <div className="jobsHero">
          <h1>Find Your <span>Dream Job</span></h1>
          <div className="searchBarWrapper">
            <div className="searchBar">
              <div className="searchInput"><Search size={18} /><input type="text" placeholder="Job title, skills, company" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} /></div>
              <div className="searchInput"><MapPin size={18} /><input type="text" placeholder="Country or City" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} /></div>
              <button>Search</button>
            </div>
            <div className="filterDropdownWrapper">
              <button className="filterBtn" onClick={() => setShowDropdown(!showDropdown)}><SlidersHorizontal size={20} />{activeFiltersCount > 0 && <span className="badge">{activeFiltersCount}</span>}</button>
              {showDropdown && ( <div className="filterDropdown"> <div className="dropdownHeader"><h4>Sort & Filter</h4><X size={18} onClick={() => setShowDropdown(false)} /></div> <div className="dropdownSection"> <p className="sectionTitle"><ArrowUpDown size={14}/> Sort By</p> {sortOptions.map(opt => ( <label key={opt} className="radioItem" onClick={() => setSortBy(opt)}><span><input type="radio" checked={sortBy === opt} readOnly /> {opt}</span>{sortBy === opt && <Check size={14} color="#22C55E" />}</label> ))} </div> <div className="dropdownActions"><button className="clearBtn" onClick={clearAll}>Clear All</button><button className="applyBtn" onClick={() => setShowDropdown(false)}>Show {displayedJobs.length} Jobs</button></div> </div> )}
            </div>
          </div>
          <div className="jobsTabs">
            <button className={`tabBtn ${activeTab === "find"? "active" : ""}`} onClick={() => setActiveTab("find")}>Find job</button>
            <button className={`tabBtn ${activeTab === "saved"? "active" : ""}`} onClick={() => setActiveTab("saved")}>Saved</button>
            <button className={`tabBtn ${activeTab === "applications"? "active" : ""}`} onClick={() => setActiveTab("applications")}>My applications</button>
            <button className={`tabBtn ${activeTab === "career"? "active" : ""}`} onClick={() => setActiveTab("career")}>Career</button>
          </div>
          <button className="yellowSearchBtn" onClick={() => setShowDropdown(true)}><Search size={20} />Click to search jobs</button>
          {activeFiltersCount > 0 && (<div className="filterChips">{filters.category.map(f => <span key={f}>{f} <X size={12} onClick={() => toggleFilter("category", f)} /></span>)}{filters.type.map(f => <span key={f}>{f} <X size={12} onClick={() => toggleFilter("type", f)} /></span>)}<button className="clearAllChip" onClick={clearAll}>Clear All</button></div>)}
        </div>

        <div className="jobsContainer">
          <aside className="filterSidebar">
            <h2>Filters</h2>
            <div className="filterGroup"><h4>Category</h4>{allCategories.map(opt => (<label key={opt}><input type="checkbox" checked={filters.category.includes(opt)} onChange={() => toggleFilter("category", opt)} /> {opt}</label>))}</div><hr />
            <div className="filterGroup"><h4>Work Schedule</h4>{["Full-time", "Part-time", "Contract", "Remote"].map(opt => (<label key={opt}><input type="checkbox" checked={filters.type.includes(opt)} onChange={() => toggleFilter("type", opt)} /> {opt}</label>))}</div><hr />
            <div className="filterGroup"><h4>Experience</h4>{["Junior", "Mid-Level", "Senior"].map(opt => (<label key={opt}><input type="checkbox" checked={filters.experience.includes(opt)} onChange={() => toggleFilter("experience", opt)} /> {opt}</label>))}</div><hr />
            <div className="filterGroup"><h4>Salary</h4>{["$1000+", "$3000+", "$5000+"].map(opt => (<label key={opt}><input type="checkbox" checked={filters.salary.includes(opt)} onChange={() => toggleFilter("salary", opt)} /> {opt}</label>))}</div>
          </aside>

        <div className="jobsGrid">
            {loading? <p>Loading jobs...</p> : currentJobs.length > 0? (
              currentJobs.map((job) => (
                <div className="jobCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                  <div className="jobHeader">
                    <img src={job.logo} alt={job.company} />
                    <Bookmark size={25} onClick={(e) => handleToggleSave(e, job.id)} fill={job.is_saved? "#16a34a" : "none"} color={job.is_saved? "#16a34a" : "currentColor"} style={{ cursor: 'pointer', position:"relative", left:"22rem" }} />
                  </div>
                  <h2>{job.title}</h2>
                  <h4>{job.company}</h4>
                  <div className="jobTags"><span>{job.category}</span><span>{job.type}</span><span>{job.location}</span></div>
                  <p className="des">{job.description}</p>
                  <div className="salaryRow">
                    <div>₦{job.salary.toLocaleString()}/mo</div> {/* CHANGED: $ to ₦ */}
                    <button onClick={(e) => handleApplyClick(e, job)}>Apply</button>
                  </div>
                </div>
              ))
            ) : (<p className="no-jobs">No jobs found</p>)}
          </div>
        </div>

        {totalPages > 1 && (<div className="pagination"><button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="pageBtn"><ChevronLeft size={18} /></button>{getPageNumbers(currentPage, totalPages).map((page, idx) => (page === '...'? <span key={`dots-${idx}`} className="pageDots">...</span> :<button key={page} onClick={() => goToPage(page)} className={`pageBtn ${currentPage === page? "active" : ""}`}>{page}</button>))}<button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="pageBtn"><ChevronRight size={18} /></button></div>)}
      </div>

      <div className="mobileJobs">
        <div className="mobileBack"><button className="backBtn" onClick={() => navigate(-1)}><ArrowLeft size={20} /><span></span></button></div>
       <div className="mobileSearch">
  <div className="mobileSearchBox">
    <Search size={18} />
    <input
      type="text"
      placeholder="Job title, skills, company"
      value={searchTitle}
      onChange={e => setSearchTitle(e.target.value)}
    />
    <SlidersHorizontal size={18} className="mobile-search-options" onClick={() => setShowDropdown(!showDropdown)} />
  </div>

  <div className="mobileSearchBox" style={{marginTop: "10px"}}>
    <MapPin size={18} />
    <input
      type="text"
      placeholder="Location"
      value={searchLocation}
      onChange={e => setSearchLocation(e.target.value)}
    />
  </div>

  {showDropdown && (
    <div className="mobileDropdown">
      <div className="dropdownHeader"><h4>Sort & Filter</h4><X size={18} onClick={() => setShowDropdown(false)} /></div>
      <div className="dropdownSection">
        <p className="sectionTitle"><ArrowUpDown size={14}/> Sort By</p>
        {sortOptions.map(opt => (
          <label key={opt} className="radioItem" onClick={() => setSortBy(opt)}>
            <span><input type="radio" checked={sortBy === opt} readOnly /> {opt}</span>
            {sortBy === opt && <Check size={14} color="#2563eb" />}
          </label>
        ))}
      </div>
    </div>
  )}
</div>
        <div className="jobsTabs">
          <button className={`tabBtn ${activeTab === "find"? "active" : ""}`} onClick={() => setActiveTab("find")}>Find job</button>
          <button className={`tabBtn ${activeTab === "saved"? "active" : ""}`} onClick={() => setActiveTab("saved")}>Saved</button>
          <button className={`tabBtn ${activeTab === "applications"? "active" : ""}`} onClick={() => setActiveTab("applications")}>My applications</button>
          <button className={`tabBtn ${activeTab === "career"? "active" : ""}`} onClick={() => setActiveTab("career")}>Career</button>
        </div>
        <button className="yellowSearchBtn" onClick={() => setShowDropdown(true)}><Search size={20} />Click to search jobs</button>
        <div className="mobileJobList">
          <p className="resultsCount">{displayedJobs.length} jobs found</p>
          {loading? <p>Loading jobs...</p> : currentMobileJobs.length > 0? (
            currentMobileJobs.map((job) => (
              <div className="mobileCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                <div className="mobileTop">
                  <img src={job.logo} alt={job.company} />
                  <Bookmark size={18} onClick={(e) => handleToggleSave(e, job.id)} fill={job.is_saved? "#16a34a" : "none"} color={job.is_saved? "#16a34a" : "currentColor"} style={{ cursor: 'pointer', position:"relative", left:"19.5rem" }} />
                </div>
                <h3>{job.title}</h3>
                <p className="companyName">{job.company}</p>
                <div className="mobileInfo"><span><MapPin size={14} />{job.location}</span><span><Briefcase size={14} />{job.type}</span><span>{job.category}</span></div>
                <p className="mobileDesc">{job.description}</p>
                <div className="mobileBottom">
                  <div className="salary">₦{job.salary.toLocaleString()}/mo</div> {/* CHANGED: $ to ₦ */}
                  <button onClick={(e) => handleApplyClick(e, job)}>Apply</button>
                </div>
              </div>
            ))
          ) : (<p className="no-jobs">No jobs found</p>)}

          {mobileTotalPages > 1 && (<div className="mobilePagination"><button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="pageBtn"><ChevronLeft size={18} /></button>{Array.from({ length: mobileTotalPages }, (_, i) => i + 1).map(page => (<button key={page} onClick={() => goToPage(page)} className={`pageBtn ${currentPage === page? "active" : ""}`}>{page}</button>))}<button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === mobileTotalPages} className="pageBtn"><ChevronRight size={18} /></button></div>)}
        </div>
      </div>
    </section>
  );
}