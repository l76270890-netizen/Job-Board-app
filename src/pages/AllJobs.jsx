
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
  Check,
  ChevronLeft,
  ChevronRight
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
    location: "Remote, Nigeria", 
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

  // 11 NEW JOBS ADDED
  { 
    id: 5, 
    title: "Product Manager", 
    company: "Fuzu Ltd", 
    logo: "https://logo.clearbit.com/fuzu.com",
    location: "Abuja, Nigeria", 
    type: "Full-time", 
    salary: 3500, 
    category: "Product",
    experience: "Senior",
    postedDate: "2026-09-27",
    description: "Lead product vision and strategy for Fuzu's career platform serving 2M+ users in Africa. Work directly with C-level to define roadmap and KPIs. 5+ years PM experience in tech required.",
    responsibilities: [
      "Define product roadmap and prioritize features",
      "Conduct market research and user interviews",
      "Work with engineering and design to ship products",
      "Track metrics and drive product growth"
    ],
    skills: ["Product Strategy", "Agile", "Data Analysis", "User Research", "Roadmapping"],
    benefits: ["Health Insurance", "Equity", "Remote Work", "Conference Budget"]
  },
  { 
    id: 6, 
    title: "UI/UX Designer", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Remote, Nigeria", 
    type: "Full-time", 
    salary: 1500, 
    category: "Design",
    experience: "Mid-Level",
    postedDate: "2026-09-26",
    description: "Design beautiful and intuitive interfaces for TechNova's mobile and web apps. You'll work on our design system and collaborate with product teams. Portfolio required.",
    responsibilities: [
      "Create wireframes, prototypes and high-fidelity designs",
      "Maintain and expand our design system",
      "Run usability tests and iterate designs",
      "Collaborate with developers for implementation"
    ],
    skills: ["Figma", "Adobe XD", "User Flows", "Wireframing", "Mobile Design"],
    benefits: ["Remote Work", "Learning Budget", "Health Insurance"]
  },
  { 
    id: 7, 
    title: "Sales Executive", 
    company: "Oriental Mills Ltd", 
    logo: "https://logo.clearbit.com/orientalmills.com",
    location: "Port Harcourt, Nigeria", 
    type: "Full-time", 
    salary: 1200, 
    category: "Sales",
    experience: "Entry-Level",
    postedDate: "2026-09-24",
    description: "Drive B2B sales for Oriental Mills food products across South-South Nigeria. Target: distributors, retailers, and supermarkets. Commission + base salary.",
    responsibilities: [
      "Identify and onboard new distributors",
      "Meet monthly sales targets",
      "Build relationships with key accounts",
      "Prepare sales reports and forecasts"
    ],
    skills: ["B2B Sales", "Negotiation", "CRM", "Communication", "FMCG"],
    benefits: ["Commission", "Transport Allowance", "Health Insurance"]
  },
  { 
    id: 8, 
    title: "Data Analyst", 
    company: "Microsoft", 
    logo: "https://logo.clearbit.com/microsoft.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 4000, 
    category: "Data",
    experience: "Mid-Level",
    postedDate: "2026-09-29",
    description: "Analyze user behavior and business metrics for Microsoft Nigeria. Build dashboards in PowerBI and provide insights to leadership. SQL + Python required.",
    responsibilities: [
      "Build dashboards and reports in PowerBI",
      "Analyze user data and business KPIs",
      "Write SQL queries for data extraction",
      "Present insights to stakeholders"
    ],
    skills: ["SQL", "Python", "PowerBI", "Excel", "Data Visualization"],
    benefits: ["Health Insurance", "Stock Options", "Remote Work", "Learning Stipend"]
  },
  { 
    id: 9, 
    title: "HR Manager", 
    company: "GIZ KE", 
    logo: "https://logo.clearbit.com/giz.de",
    location: "Kano, Nigeria", 
    type: "Full-time", 
    salary: 2800, 
    category: "Human Resources",
    experience: "Senior",
    postedDate: "2026-09-22",
    description: "Manage HR operations for GIZ Nigeria North region. Handle recruitment, employee relations, and policy implementation for 200+ staff.",
    responsibilities: [
      "Lead recruitment and onboarding",
      "Manage employee relations and grievances",
      "Implement HR policies and compliance",
      "Coordinate training and development"
    ],
    skills: ["HR Management", "Recruitment", "Labor Law", "Employee Relations", "HRIS"],
    benefits: ["Health Insurance", "Housing Allowance", "Paid Leave"]
  },
  { 
    id: 10, 
    title: "Mobile App Developer", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Ibadan, Nigeria", 
    type: "Full-time", 
    salary: 3200, 
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-28",
    description: "Build TechNova's Flutter mobile app for iOS and Android. 3+ years mobile dev experience. Must have published apps on Play Store/App Store.",
    responsibilities: [
      "Develop cross-platform mobile applications",
      "Integrate with REST APIs and third-party SDKs",
      "Fix bugs and improve app performance",
      "Publish updates to app stores"
    ],
    skills: ["Flutter", "Dart", "Firebase", "REST API", "Git"],
    benefits: ["Health Insurance", "Remote Work", "Device Allowance"]
  },
  { 
    id: 11, 
    title: "Content Writer", 
    company: "Fuzu Ltd", 
    logo: "https://logo.clearbit.com/fuzu.com",
    location: "Remote, Nigeria", 
    type: "Part-time", 
    salary: 800, 
    category: "Writing",
    experience: "Entry-Level",
    postedDate: "2026-09-23",
    description: "Write career advice articles, CV templates, and job descriptions for Fuzu blog. 2 posts per week. SEO experience is a plus.",
    responsibilities: [
      "Write SEO-optimized blog articles",
      "Create job descriptions and career guides",
      "Research trending career topics",
      "Edit and proofread content"
    ],
    skills: ["Content Writing", "SEO", "Research", "Grammar", "WordPress"],
    benefits: ["Flexible Hours", "Remote Work", "Byline Credit"]
  },
  { 
    id: 12, 
    title: "Finance Officer", 
    company: "GIZ KE", 
    logo: "https://logo.clearbit.com/giz.de",
    location: "Abuja, Nigeria", 
    type: "Full-time", 
    salary: 2500, 
    category: "Finance",
    experience: "Mid-Level",
    postedDate: "2026-09-21",
    description: "Manage budgeting, donor reporting, and financial compliance for GIZ projects. ACCA/CPA preferred. 3+ years NGO finance experience.",
    responsibilities: [
      "Prepare monthly financial reports",
      "Manage donor fund disbursements",
      "Ensure compliance with financial policies",
      "Support audit processes"
    ],
    skills: ["Accounting", "Excel", "Budgeting", "SAP", "NGO Finance"],
    benefits: ["Health Insurance", "Pension", "Paid Leave"]
  },
  { 
    id: 13, 
    title: "DevOps Engineer", 
    company: "Google", 
    logo: "https://logo.clearbit.com/google.com",
    location: "Remote, Nigeria", 
    type: "Full-time", 
    salary: 5000, 
    category: "Engineering",
    experience: "Senior",
    postedDate: "2026-09-29",
    description: "Manage GCP infrastructure for Google products in Africa. Focus on CI/CD, monitoring, and reliability. Terraform + Kubernetes required.",
    responsibilities: [
      "Manage Kubernetes clusters on GCP",
      "Build and maintain CI/CD pipelines",
      "Monitor system performance and uptime",
      "Automate infrastructure with Terraform"
    ],
    skills: ["GCP", "Kubernetes", "Docker", "Terraform", "Jenkins", "Linux"],
    benefits: ["Health Insurance", "Stock Options", "Remote Work", "Wellness Budget"]
  },
  { 
    id: 14, 
    title: "Customer Support Lead", 
    company: "TechNova Ltd", 
    logo: "https://logo.clearbit.com/technova.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 1400, 
    category: "Customer Service",
    experience: "Mid-Level",
    postedDate: "2026-09-26",
    description: "Lead a team of 8 support agents for TechNova. Handle escalations and improve CSAT. Experience with Zendesk required.",
    responsibilities: [
      "Manage and train support team",
      "Handle customer escalations",
      "Improve support processes and CSAT",
      "Report on support metrics weekly"
    ],
    skills: ["Customer Support", "Zendesk", "Team Leadership", "Communication", "Problem Solving"],
    benefits: ["Health Insurance", "Performance Bonus", "Training"]
  },
  { 
    id: 15, 
    title: "Supply Chain Manager", 
    company: "Oriental Mills Ltd", 
    logo: "https://logo.clearbit.com/orientalmills.com",
    location: "Kaduna, Nigeria", 
    type: "Full-time", 
    salary: 3000, 
    category: "Operations",
    experience: "Senior",
    postedDate: "2026-09-25",
    description: "Oversee end-to-end supply chain for Oriental Mills. Manage vendors, logistics, and inventory across 10+ states.",
    responsibilities: [
      "Manage procurement and vendor relationships",
      "Optimize logistics and distribution",
      "Control inventory levels and costs",
      "Ensure on-time delivery to customers"
    ],
    skills: ["Supply Chain", "Logistics", "Procurement", "ERP", "Negotiation"],
    benefits: ["Health Insurance", "Car Allowance", "Housing Allowance"]
  },
];

const DESKTOP_JOBS_PER_PAGE = 9;
const MOBILE_JOBS_PER_PAGE = 6;

// Smart pagination with...
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
  const [searchParams] = useSearchParams();

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
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setFilters(prev => ({...prev, category: [categoryFromUrl] }));
    }
  }, [searchParams]);

  // Reset to page 1 when filters/search/tab change
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
    if (searchTitle) result = result.filter(j => j.title.toLowerCase().includes(searchTitle.toLowerCase()));
    if (searchLocation) result = result.filter(j => j.location.toLowerCase().includes(searchLocation.toLowerCase()));
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
    if (sortBy === "Newest") result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    if (sortBy === "Oldest") result.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    if (sortBy === "A-Z") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "Z-A") result.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === "Salary: High-Low") result.sort((a, b) => b.salary - a.salary);
    if (sortBy === "Salary: Low-High") result.sort((a, b) => a.salary - b.salary);
    return result;
  }, [searchTitle, searchLocation, filters, sortBy]);

  const displayedJobs = useMemo(() => {
    if (activeTab === "saved") return filteredJobs.filter(j => j.isSaved);
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

          {/* TABS + QUICK SEARCH BUTTON */}
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
              ))
            ) : (
              <p className="no-jobs">No jobs found</p>
            )}
          </div>
        </div>

        {/* DESKTOP PAGINATION */}
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

         {/* TABS + QUICK SEARCH BUTTON */}
          <div className="jobsTabs">
            <button className={`tabBtn ${activeTab === "find"? "active" : ""}`} onClick={() => setActiveTab("find")}>Find job</button>
            <button className={`tabBtn ${activeTab === "saved"? "active" : ""}`} onClick={() => setActiveTab("saved")}>Saved</button>
            <button className={`tabBtn ${activeTab === "applications"? "active" : ""}`} onClick={() => setActiveTab("applications")}>My applications</button>
            <button className={`tabBtn ${activeTab === "career"? "active" : ""}`} onClick={() => setActiveTab("career")}>Career</button>
                        <button className={`tabBtn ${activeTab === "saved"? "active" : ""}`} onClick={() => setActiveTab("saved")}>Saved</button>

          </div>

          <button className="yellowSearchBtn" onClick={() => setShowDropdown(true)}>
            <Search size={20} />
            Click to search jobs
          </button>

        <div className="mobileJobList">
          <p className="resultsCount">{filteredJobs.length} jobs found</p>
          {currentMobileJobs.length > 0? (
            currentMobileJobs.map((job) => (
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
