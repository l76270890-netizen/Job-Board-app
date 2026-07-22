import "./AllJobs.css";
import {
  Search, MapPin, Bookmark, Briefcase, DollarSign, ArrowLeft,
  SlidersHorizontal, X, ArrowUpDown, Check, ChevronLeft, ChevronRight, Building2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabase";

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

// 1. FALLBACK LOGO COMPONENT - no internet needed
const CompanyLogo = ({ company }) => (
  <div className="companyFallbackLogo">
    <Building2 size={20} />
  </div>
);

export default function AllJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("find");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: [],
    type: [],
    experience: [],
    salary: []
  });

  const sortOptions = ["Newest", "Oldest", "A-Z", "Z-A", "Salary: High-Low", "Salary: Low-High"];
  const allCategories = ["Design", "Engineering", "Marketing", "Product", "Sales", "Data", "Human Resources", "Writing", "Finance", "Customer Service", "Operations"];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("jobboard-app").select("*");

      if (error) {
        console.log("SUPABASE ERROR:", error);
        setError(error.message);
      } else {
        console.log("DATA:", data);
        setJobs(data || []);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setFilters(prev => ({...prev, category: [categoryFromUrl] }));
    }
  }, [searchParams]);

  useEffect(() => setCurrentPage(1), [searchTitle, searchLocation, filters, sortBy, activeTab]);

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
   ...prev,
      [category]: prev[category].includes(value)
     ? prev[category].filter(v => v!== value)
        : [...prev[category], value]
    }));
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

  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (searchTitle) result = result.filter(j => j.title?.toLowerCase().includes(searchTitle.toLowerCase()));
    if (searchLocation) result = result.filter(j => j.location?.toLowerCase().includes(searchLocation.toLowerCase()));
    if (filters.category.length) result = result.filter(j => filters.category.includes(j.category));
    if (filters.type.length) result = result.filter(j => filters.type.includes(j.type));
    if (filters.experience.length) result = result.filter(j => filters.experience.includes(j.experience));
    if (filters.salary.length) {
      result = result.filter(j => {
        return filters.salary.some(s => {
          if (s === "$1000+") return j.salary >= 1000;
          if (s === "$3000+") return j.salary >= 3000;
          if (s === "$5000+") return j.salary >= 5000;
          return false;
        })
      })
    }
    if (sortBy === "Newest") result.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    if (sortBy === "Oldest") result.sort((a, b) => new Date(a.posted_date) - new Date(b.posted_date));
    if (sortBy === "A-Z") result.sort((a, b) => a.title?.localeCompare(b.title));
    if (sortBy === "Z-A") result.sort((a, b) => b.title?.localeCompare(a.title));
    if (sortBy === "Salary: High-Low") result.sort((a, b) => (b.salary || 0) - (a.salary || 0)); // 2. safe sort
    if (sortBy === "Salary: Low-High") result.sort((a, b) => (a.salary || 0) - (b.salary || 0));
    return result;
  }, [jobs, searchTitle, searchLocation, filters, sortBy]);

  const displayedJobs = useMemo(() => {
    if (activeTab === "saved") return filteredJobs.filter(j => j.is_saved);
    if (activeTab === "applications") return filteredJobs.filter(j => j.has_applied);
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

  if (loading) return <section className="allJobs"><p>Loading jobs...</p></section>;
  if (error) return <section className="allJobs"><p>Error: {error}</p></section>;
  if (displayedJobs.length === 0) return <section className="allJobs"><p>No jobs found</p></section>;

  return (
    <section className="allJobs">
      <div className="desktopJobs">
        <div className="backHeader">
          <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span></span>
          </button>
        </div>
        <div className="header-heart">
          <span className="heart-icon">♡</span>
        </div>

        <div className="jobsHero">
          <h1>Find Your <span>Dream Job</span></h1>

          <div className="searchBarWrapper">
            <div className="searchBar">
              <div className="searchInput">
                <Search size={18} />
                <input type="text" placeholder="Job title or keyword" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
              </div>
              <div className="searchInput">
                <MapPin size={18} />
                <input type="text" placeholder="Country or City" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} />
              </div>
              <button>Search</button>
            </div>

            <div className="filterDropdownWrapper">
              <button className="filterBtn" onClick={() => setShowDropdown(!showDropdown)}>
                <SlidersHorizontal size={20} />
                {activeFiltersCount > 0 && <span className="badge">{activeFiltersCount}</span>}
              </button>

              {showDropdown && (
                <div className="filterDropdown">
                  <div className="dropdownHeader">
                    <h4>Sort & Filter</h4>
                    <X size={18} onClick={() => setShowDropdown(false)} />
                  </div>

                  <div className="dropdownSection">
                    <p className="sectionTitle"><ArrowUpDown size={14}/> Sort By</p>
                    {sortOptions.map(opt => (
                      <label key={opt} className="radioItem" onClick={() => setSortBy(opt)}>
                        <span><input type="radio" checked={sortBy === opt} readOnly /> {opt}</span>
                        {sortBy === opt && <Check size={14} color="#2563eb" />}
                      </label>
                    ))}
                  </div>

                  <div className="dropdownActions">
                    <button className="clearBtn" onClick={clearAll}>Clear All</button>
                    <button className="applyBtn" onClick={() => setShowDropdown(false)}>Show {displayedJobs.length} Jobs</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="jobsTabs">
            <button className={`tabBtn ${activeTab === "find"? "active" : ""}`} onClick={() => setActiveTab("find")}>Find job</button>
            <button className={`tabBtn ${activeTab === "saved"? "active" : ""}`} onClick={() => setActiveTab("saved")}>Saved</button>
            <button className={`tabBtn ${activeTab === "applications"? "active" : ""}`} onClick={() => setActiveTab("applications")}>My applications</button>
            <button className={`tabBtn ${activeTab === "career"? "active" : ""}`} onClick={() => setActiveTab("career")}>Career</button>
          </div>

          <button className="yellowSearchBtn" onClick={() => setShowDropdown(true)}>
            <Search size={20} />
            Click to search jobs
          </button>

          {activeFiltersCount > 0 && (
            <div className="filterChips">
              {filters.category.map(f => <span key={f}>{f} <X size={12} onClick={() => toggleFilter("category", f)} /></span>)}
              {filters.type.map(f => <span key={f}>{f} <X size={12} onClick={() => toggleFilter("type", f)} /></span>)}
              {filters.experience.map(f => <span key={f}>{f} <X size={12} onClick={() => toggleFilter("experience", f)} /></span>)}
              <button className="clearAllChip" onClick={clearAll}>Clear All</button>
            </div>
          )}
        </div>

        <div className="jobsContainer">
          <aside className="filterSidebar">
            <h2>Filters</h2>

            <div className="filterGroup">
              <h4>Category</h4>
              {allCategories.map(opt => (
                <label key={opt}><input type="checkbox" checked={filters.category.includes(opt)} onChange={() => toggleFilter("category", opt)} /> {opt}</label>
              ))}
            </div>
                 <hr />
            <div className="filterGroup">
              <h4>Work Schedule</h4>
              {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map(opt => (
                <label key={opt}><input type="checkbox" checked={filters.type.includes(opt)} onChange={() => toggleFilter("type", opt)} /> {opt}</label>
              ))}
            </div>

             <hr />
            <div className="filterGroup">
              <h4>Experience</h4>
              {["Entry-Level", "Mid-Level", "Senior"].map(opt => (
                <label key={opt}><input type="checkbox" checked={filters.experience.includes(opt)} onChange={() => toggleFilter("experience", opt)} /> {opt}</label>
              ))}
            </div>
              <hr />
            <div className="filterGroup">
              <h4>Salary</h4>
              {["$1000+", "$3000+", "$5000+"].map(opt => (
                <label key={opt}><input type="checkbox" checked={filters.salary.includes(opt)} onChange={() => toggleFilter("salary", opt)} /> {opt}</label>
              ))}
            </div>
          </aside>

          <div className="jobsGrid">
            {currentJobs.length > 0? (
              currentJobs.map((job) => (
                <div className="jobCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                  <div className="jobHeader">
                    {/* 3. FIX: Use fallback logo instead of external URL */}
                    <CompanyLogo company={job.company} />
                    <Bookmark onClick={(e) => e.stopPropagation()} />
                  </div>
                  <h2>{job.title}</h2>
                  <h4>{job.company}</h4>
                  <div className="jobTags">
                    <span>{job.category}</span>
                    <span>{job.type}</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="des">{job.description}</p>
                  <div className="salaryRow">
                    {/* 4. FIX: Safe salary with fallback */}
                    <div><DollarSign size={18} />${job.salary?.toLocaleString() || 0}/mo</div>
                    <button onClick={(e) => { e.stopPropagation(); alert(`Applying for ${job.title}`); }}>Apply</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-jobs">No jobs found</p>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="pageBtn">
              <ChevronLeft size={18} />
            </button>
            {getPageNumbers(currentPage, totalPages).map((page, idx) => (
              page === '...'?
              <span key={`dots-${idx}`} className="pageDots">...</span> :
              <button key={page} onClick={() => goToPage(page)} className={`pageBtn ${currentPage === page? "active" : ""}`}>
                {page}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="pageBtn">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

    {/* MOBILE VIEW */}
      <div className="mobileJobs">
        <div className="mobileBack">
          <button className="backBtn" onClick={() => navigate(-1)}><ArrowLeft size={20} /><span></span></button>
        </div>

        <div className="mobileSearch">
          <div className="mobileSearchBox">
            <Search size={18} />
            <input type="text" placeholder="Search jobs..." value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
            <SlidersHorizontal size={18} className="mobile-search-options" onClick={() => setShowDropdown(!showDropdown)} />
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

          <button className="yellowSearchBtn" onClick={() => setShowDropdown(true)}>
            <Search size={20} />
            Click to search jobs
          </button>

        <div className="mobileJobList">
          <p className="resultsCount">{filteredJobs.length} jobs found</p>
          {currentMobileJobs.length > 0? (
            currentMobileJobs.map((job) => (
              <div className="mobileCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}> {/* 5. Removed state */}
                <div className="mobileTop">
                  <CompanyLogo company={job.company} /> {/* 6. Fallback logo */}
                  <Bookmark size={18} onClick={(e) => e.stopPropagation()} />
                </div>
                <h3>{job.title}</h3>
                <p className="companyName">{job.company}</p>
                <div className="mobileInfo">
                  <span><MapPin size={14} />{job.location}</span>
                  <span><Briefcase size={14} />{job.type}</span>
                  <span>{job.category}</span>
                </div>
                <p className="mobileDesc">{job.description}</p>
                <div className="mobileBottom">
                  <div className="salary"><DollarSign size={16} />${job.salary?.toLocaleString() || 0}/mo</div> {/* 7. Safe salary */}
                  <button onClick={(e) => { e.stopPropagation(); alert(`Applying for ${job.title}`); }}>Apply</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-jobs">No jobs found</p>
          )}

           {/* MOBILE PAGINATION */}
          {mobileTotalPages > 1 && (
            <div className="mobilePagination">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="pageBtn">
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: mobileTotalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => goToPage(page)} className={`pageBtn ${currentPage === page? "active" : ""}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === mobileTotalPages} className="pageBtn">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}