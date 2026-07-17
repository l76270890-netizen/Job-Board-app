import "./AllJobs.css";
import {
  Search,
  MapPin,
  Bookmark,
  Briefcase,
  DollarSign,
  ArrowLeft,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Check
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const jobs = [
  { 
    id: 1, 
    title: "Senior Product Designer", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 2500, 
    category: "Design",
    experience: "Senior",
    postedDate: "2026-09-28",
    description: "We are looking for a Senior Product Designer to lead the design of our flagship SaaS product. You will own the end-to-end design process from user research to high-fidelity prototypes. Must have 5+ years experience with Figma, design systems, and working with product managers. You'll be working on products used by 1M+ users across Africa.",
    responsibilities: [
      "Lead product design from concept to launch",
      "Conduct user research and usability testing",
      "Create design systems and component libraries in Figma",
      "Collaborate with PMs and Engineers to ship features"
    ],
    skills: ["Figma", "UI/UX", "Design Systems", "User Research", "Prototyping"],
    benefits: ["Health Insurance", "Remote Work", "Learning Budget", "Paid Time Off"]
  },
  { 
    id: 2, 
    title: "Frontend Engineer", 
    company: "Fuzu Ltd", 
    logo: "https://logo.clearbit.com/fuzu.com",
    location: "Remote", 
    type: "Contract", 
    salary: 1800, 
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-25",
    description: "Join Fuzu as a Frontend Engineer to build scalable React applications. You will work on our job search platform and company pages. Required: 3+ years React, Tailwind CSS, REST APIs, and Git. Experience with performance optimization is a plus. This is a 6 month contract with possibility to extend.",
    responsibilities: [
      "Build responsive web applications using React",
      "Collaborate with designers and backend teams",
      "Optimize applications for speed and scalability",
      "Write reusable and clean components"
    ],
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git", "REST API"],
    benefits: ["Remote Work", "Flexible Hours", "Contract Bonus"]
  },
  { 
    id: 3, 
    title: "Marketing Manager", 
    company: "GIZ KE", 
    logo: "https://logo.clearbit.com/giz.de",
    location: "Abuja, Nigeria", 
    type: "Full-time", 
    salary: 2200, 
    category: "Marketing",
    experience: "Senior",
    postedDate: "2026-09-20",
    description: "GIZ Nigeria is seeking a Marketing Manager to drive awareness for our development programs. Responsibilities include campaign management, social media strategy, and stakeholder communications. Bachelor's degree in Marketing/Communications required. 4+ years experience in NGO or development sector preferred.",
    responsibilities: [
      "Develop and execute marketing campaigns",
      "Manage social media and content strategy",
      "Coordinate with stakeholders and partners",
      "Track and report campaign performance"
    ],
    skills: ["Digital Marketing", "Content Strategy", "Communication", "Analytics", "NGO"],
    benefits: ["Health Insurance", "Paid Leave", "Professional Development"]
  },
  { 
    id: 4, 
    title: "Backend Engineer", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 3000, 
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-29",
    description: "Build and scale the APIs that power TechNova's platform. Tech stack: Node.js, Express, PostgreSQL, Redis, Docker, AWS. You will design microservices, optimize database queries, and ensure 99.9% uptime. 4+ years backend experience required.",
    responsibilities: [
      "Design and build RESTful APIs",
      "Optimize database performance",
      "Deploy and maintain services on AWS",
      "Write unit and integration tests"
    ],
    skills: ["Node.js", "Express", "PostgreSQL", "Docker", "AWS", "Redis"],
    benefits: ["Health Insurance", "Remote Work", "Stock Options", "Gym Membership"]
  },
];

export default function AllJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [filters, setFilters] = useState({
    category: [],
    type: [],
    experience: [],
    salary: []
  });

  const sortOptions = ["Newest", "Oldest", "A-Z", "Z-A", "Salary: High-Low", "Salary: Low-High"];
  const allCategories = ["Technology", "Marketing", "Business", "Human Resources", "Healthcare", "Finance"];

  // Read category from URL on page load
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setFilters(prev => ({
       ...prev,
        category: [categoryFromUrl]
      }));
    }
  }, [searchParams]);

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
    navigate('/jobs');
  };

  // FILTER + SORT ENGINE
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // 1. SEARCH
    if (searchTitle) result = result.filter(j => j.title.toLowerCase().includes(searchTitle.toLowerCase()));
    if (searchLocation) result = result.filter(j => j.location.toLowerCase().includes(searchLocation.toLowerCase()));

    // 2. FILTER
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

    // 3. SORT
    if (sortBy === "Newest") result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    if (sortBy === "Oldest") result.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    if (sortBy === "A-Z") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "Z-A") result.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === "Salary: High-Low") result.sort((a, b) => b.salary - a.salary);
    if (sortBy === "Salary: Low-High") result.sort((a, b) => a.salary - b.salary);

    return result;
  }, [searchTitle, searchLocation, filters, sortBy]);

  const activeFiltersCount = filters.category.length + filters.type.length + filters.experience.length + filters.salary.length;

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
                    <button className="applyBtn" onClick={() => setShowDropdown(false)}>Show {filteredJobs.length} Jobs</button>
                  </div>
                </div>
              )}
            </div>
          </div>

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
              {["Full Time", "Part Time", "Internship", "Remote", "Hybrid"].map(opt => (
                <label key={opt}><input type="checkbox" checked={filters.type.includes(opt)} onChange={() => toggleFilter("type", opt)} /> {opt}</label>
              ))}
            </div>
             
             <hr />
            <div className="filterGroup">
              <h4>Experience</h4>
              {["Entry", "Junior", "Senior"].map(opt => (
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
            {filteredJobs.map((job) => (
              <div className="jobCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                <div className="jobHeader">
                  <img src={job.logo} alt={job.company} />
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
                  <div><DollarSign size={18} />${job.salary.toLocaleString()}/mo</div>
                  <button onClick={(e) => { e.stopPropagation(); alert(`Applying for ${job.title}`); }}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
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

        <div className="mobileJobList">
          <p className="resultsCount">{filteredJobs.length} jobs found</p>
          {filteredJobs.map((job) => (
            <div className="mobileCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
              <div className="mobileTop"><img src={job.logo} alt={job.company} /><Bookmark size={18} onClick={(e) => e.stopPropagation()} /></div>
              <h3>{job.title}</h3>
              <p className="companyName">{job.company}</p>
              <div className="mobileInfo">
                <span><MapPin size={14} />{job.location}</span>
                <span><Briefcase size={14} />{job.type}</span>
                <span>{job.category}</span>
              </div>
              <p className="mobileDesc">{job.description}</p>
              <div className="mobileBottom">
                <div className="salary"><DollarSign size={16} />${job.salary.toLocaleString()}/mo</div>
                <button onClick={(e) => { e.stopPropagation(); alert(`Applying for ${job.title}`); }}>Apply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}