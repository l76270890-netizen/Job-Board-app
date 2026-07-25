
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
    title: "Product Manager", 
    company: "Paystack", 
    logo: "https://logo.clearbit.com/paystack.com",
    location: "Lagos, Nigeria", 
    type: "Full-time", 
    salary: 4000, 
    category: "Product",
    experience: "Senior",
    postedDate: "2026-09-29",
    description: "Lead product strategy and execution for Africa's leading payment platform. Work with engineering, design, and sales to ship features for 200k+ businesses.",
    responsibilities: [
      "Define product roadmap and priorities",
      "Work with cross-functional teams to launch features",
      "Analyze user data and market trends",
      "Gather and prioritize product requirements"
    ],
    skills: ["Product Strategy", "Roadmap", "Analytics", "Leadership", "Fintech"],
    benefits: ["Health Insurance", "Equity", "Remote Work", "Learning Budget"]
  },
  { 
    id: 2, 
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
    id: 3, 
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
    id: 4,
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
  {
    id: 5,
    title: "Backend Engineer",
    company: "Flutterwave",
    logo: "https://logo.clearbit.com/flutterwave.com",
    location: "Remote, Nigeria",
    type: "Full-time",
    salary: 3500,
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-27",
    description: "Build and scale payment APIs serving millions of transactions. Work with Node.js, PostgreSQL, and AWS.",
    responsibilities: ["Develop REST APIs", "Design database schemas", "Ensure system reliability", "Write tests"],
    skills: ["Node.js", "PostgreSQL", "AWS", "Docker", "Redis"],
    benefits: ["Health Insurance", "Equity", "Remote Work"]
  },
  {
    id: 6,
    title: "Digital Marketing Manager",
    company: "Andela",
    logo: "https://logo.clearbit.com/andela.com",
    location: "Abuja, Nigeria",
    type: "Full-time",
    salary: 2200,
    category: "Marketing",
    experience: "Mid-Level",
    postedDate: "2026-09-26",
    description: "Drive growth through SEO, content, and paid ads. Manage campaigns across Google, Meta, and LinkedIn.",
    responsibilities: ["Run paid campaigns", "Manage social media", "Analyze marketing data", "Create content strategy"],
    skills: ["SEO", "Google Ads", "Meta Ads", "Content Marketing", "Analytics"],
    benefits: ["Health Insurance", "Remote Work", "Training Budget"]
  },
  {
    id: 7,
    title: "Data Analyst",
    company: "Kuda Bank",
    logo: "https://logo.clearbit.com/kudabank.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 2000,
    category: "Data",
    experience: "Junior",
    postedDate: "2026-09-24",
    description: "Turn data into insights for product and business teams. Use SQL, Python, and dashboards.",
    responsibilities: ["Build dashboards", "Run A/B tests", "Create reports", "Support product decisions"],
    skills: ["SQL", "Python", "Excel", "Tableau", "Statistics"],
    benefits: ["Health Insurance", "Gym Membership"]
  },
  {
    id: 8,
    title: "UI Designer",
    company: "Interswitch",
    logo: "https://logo.clearbit.com/interswitchgroup.com",
    location: "Remote, Nigeria",
    type: "Contract",
    salary: 1500,
    category: "Design",
    experience: "Mid-Level",
    postedDate: "2026-09-23",
    description: "Design beautiful mobile app screens for our fintech products. Must have strong Figma and design system skills.",
    responsibilities: ["Design mobile UI", "Create prototypes", "Work with developers", "Maintain design system"],
    skills: ["Figma", "Mobile Design", "Prototyping", "UI Design"],
    benefits: ["Flexible Hours", "Contract Bonus"]
  },
  {
    id: 9,
    title: "DevOps Engineer",
    company: "Mono",
    logo: "https://logo.clearbit.com/withmono.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 3200,
    category: "Engineering",
    experience: "Senior",
    postedDate: "2026-09-22",
    description: "Manage cloud infrastructure and CI/CD pipelines for high-traffic fintech APIs.",
    responsibilities: ["Manage AWS infrastructure", "Setup CI/CD", "Monitor systems", "Ensure security"],
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    benefits: ["Health Insurance", "Equity", "Learning Budget"]
  },
  {
    id: 10,
    title: "HR Manager",
    company: "Jobberman",
    logo: "https://logo.clearbit.com/jobberman.com",
    location: "Abuja, Nigeria",
    type: "Full-time",
    salary: 1800,
    category: "HR",
    experience: "Senior",
    postedDate: "2026-09-21",
    description: "Lead HR operations and talent acquisition for Nigeria's top job platform.",
    responsibilities: ["Recruitment", "Employee relations", "Policy development", "Performance management"],
    skills: ["Recruitment", "HR Policies", "Employee Engagement", "Onboarding"],
    benefits: ["Health Insurance", "Paid Time Off"]
  },
  {
    id: 11,
    title: "Mobile Developer - React Native",
    company: "Cowrywise",
    logo: "https://logo.clearbit.com/cowrywise.com",
    location: "Remote, Nigeria",
    type: "Full-time",
    salary: 2800,
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-20",
    description: "Build investment apps for thousands of users using React Native.",
    responsibilities: ["Build mobile apps", "Integrate APIs", "Fix bugs", "Release to app stores"],
    skills: ["React Native", "JavaScript", "Redux", "REST API"],
    benefits: ["Remote Work", "Health Insurance"]
  },
  {
    id: 12,
    title: "Content Writer",
    company: "TechCabal",
    logo: "https://logo.clearbit.com/techcabal.com",
    location: "Remote, Nigeria",
    type: "Contract",
    salary: 900,
    category: "Marketing",
    experience: "Junior",
    postedDate: "2026-09-19",
    description: "Write tech news and analysis about African startups.",
    responsibilities: ["Write articles", "Interview founders", "Research industry trends"],
    skills: ["Writing", "Research", "SEO", "Tech Knowledge"],
    benefits: ["Flexible Hours"]
  },
  {
    id: 13,
    title: "Sales Executive",
    company: "B2B SaaS Co",
    logo: "https://logo.clearbit.com/slack.com",
    location: "Port Harcourt, Nigeria",
    type: "Full-time",
    salary: 1600,
    category: "Sales",
    experience: "Mid-Level",
    postedDate: "2026-09-18",
    description: "Sell SaaS products to enterprise clients across South-South Nigeria.",
    responsibilities: ["Generate leads", "Close deals", "Manage client relationships"],
    skills: ["Sales", "Negotiation", "CRM", "Communication"],
    benefits: ["Commission", "Health Insurance", "Car Allowance"]
  },
  {
    id: 14,
    title: "QA Engineer",
    company: "Chipper Cash",
    logo: "https://logo.clearbit.com/chippercash.com",
    location: "Remote, Nigeria",
    type: "Full-time",
    salary: 2100,
    category: "Engineering",
    experience: "Mid-Level",
    postedDate: "2026-09-17",
    description: "Ensure quality of mobile and web apps through manual and automated testing.",
    responsibilities: ["Write test cases", "Automate tests", "Report bugs", "Work with devs"],
    skills: ["QA", "Cypress", "Jest", "Manual Testing"],
    benefits: ["Health Insurance", "Remote Work"]
  },
  {
    id: 15,
    title: "Customer Support Lead",
    company: "Carbon",
    logo: "https://logo.clearbit.com/getcarbon.co",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 1400,
    category: "Customer Service",
    experience: "Senior",
    postedDate: "2026-09-16",
    description: "Lead a team of support agents for a digital bank with 2M+ users.",
    responsibilities: ["Manage support team", "Handle escalations", "Improve processes"],
    skills: ["Customer Service", "Leadership", "Zendesk", "Communication"],
    benefits: ["Health Insurance", "Paid Time Off"]
  },
  {
    id: 16,
    title: "Blockchain Developer",
    company: "Yellow Card",
    logo: "https://logo.clearbit.com/yellowcard.io",
    location: "Remote, Nigeria",
    type: "Full-time",
    salary: 4500,
    category: "Engineering",
    experience: "Senior",
    postedDate: "2026-09-15",
    description: "Build Web3 products and smart contracts for crypto trading platform.",
    responsibilities: ["Develop smart contracts", "Integrate blockchains", "Build dApps"],
    skills: ["Solidity", "Web3", "React", "Node.js", "Ethereum"],
    benefits: ["Equity", "Remote Work", "Crypto Allowance"]
  },
  {
    id: 17,
    title: "Business Analyst",
    company: "Dangote Group",
    logo: "https://logo.clearbit.com/dangote.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 2700,
    category: "Business",
    experience: "Mid-Level",
    postedDate: "2026-09-14",
    description: "Analyze business processes and recommend improvements for manufacturing operations.",
    responsibilities: ["Data analysis", "Process improvement", "Stakeholder management"],
    skills: ["Business Analysis", "Excel", "SQL", "Presentation"],
    benefits: ["Health Insurance", "Housing Allowance"]
  },
  {
    id: 18,
    title: "SEO Specialist",
    company: "Nairametrics",
    logo: "https://logo.clearbit.com/nairametrics.com",
    location: "Remote, Nigeria",
    type: "Contract",
    salary: 1000,
    category: "Marketing",
    experience: "Mid-Level",
    postedDate: "2026-09-13",
    description: "Grow organic traffic for Africa's leading financial news site.",
    responsibilities: ["Keyword research", "On-page SEO", "Link building", "Reporting"],
    skills: ["SEO", "Google Analytics", "Content Strategy"],
    benefits: ["Flexible Hours"]
  },
  {
    id: 19,
    title: "Product Designer",
    company: "PiggyVest",
    logo: "https://logo.clearbit.com/piggyvest.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 2300,
    category: "Design",
    experience: "Mid-Level",
    postedDate: "2026-09-12",
    description: "Design savings and investment products for millions of Nigerians.",
    responsibilities: ["Design user flows", "Create wireframes", "User testing"],
    skills: ["Figma", "UI/UX", "User Research"],
    benefits: ["Health Insurance", "Remote Work"]
  },
  {
    id: 20,
    title: "Cybersecurity Analyst",
    company: "GTBank",
    logo: "https://logo.clearbit.com.gtbank.com",
    location: "Abuja, Nigeria",
    type: "Full-time",
    salary: 3300,
    category: "Engineering",
    experience: "Senior",
    postedDate: "2026-09-11",
    description: "Protect bank infrastructure and customer data from threats.",
    responsibilities: ["Monitor security", "Incident response", "Vulnerability testing"],
    skills: ["Cybersecurity", "SIEM", "Network Security", "Pen Testing"],
    benefits: ["Health Insurance", "Training Budget"]
  },
  {
    id: 21,
    title: "Graphic Designer",
    company: "Spar Nigeria",
    logo: "https://logo.clearbit.com.spar.com.ng",
    location: "Lagos, Nigeria",
    type: "Contract",
    salary: 800,
    category: "Design",
    experience: "Junior",
    postedDate: "2026-09-10",
    description: "Create marketing materials for retail campaigns and social media.",
    responsibilities: ["Design posters", "Social media graphics", "Brand assets"],
    skills: ["Photoshop", "Illustrator", "Branding"],
    benefits: ["Flexible Hours"]
  },
  {
    id: 22,
    title: "Machine Learning Engineer",
    company: "Ubenwa",
    logo: "https://logo.clearbit.com.ubenwa.ai",
    location: "Remote, Nigeria",
    type: "Full-time",
    salary: 5000,
    category: "Data",
    experience: "Senior",
    postedDate: "2026-09-09",
    description: "Build AI models to detect health issues from audio.",
    responsibilities: ["Train ML models", "Deploy to production", "Research"],
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
    benefits: ["Equity", "Remote Work", "Research Budget"]
  },
  {
    id: 23,
    title: "Accountant",
    company: "MTN Nigeria",
    logo: "https://logo.clearbit.com.mtn.ng",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 1900,
    category: "Finance",
    experience: "Mid-Level",
    postedDate: "2026-09-08",
    description: "Manage financial records and reporting for telecom operations.",
    responsibilities: ["Financial reporting", "Budgeting", "Audit support"],
    skills: ["Accounting", "Excel", "SAP", "Financial Analysis"],
    benefits: ["Health Insurance", "Pension"]
  },
  {
    id: 24,
    title: "Community Manager",
    company: "Lazerpay",
    logo: "https://logo.clearbit.com.lazerpay.com",
    location: "Remote, Nigeria",
    type: "Contract",
    salary: 1200,
    category: "Marketing",
    experience: "Junior",
    postedDate: "2026-09-07",
    description: "Grow and engage developer community for crypto payment API.",
    responsibilities: ["Manage Discord", "Host events", "Create content"],
    skills: ["Community", "Social Media", "Communication"],
    benefits: ["Flexible Hours", "Crypto Bonus"]
  },
  {
    id: 25,
    title: "Project Manager",
    company: "Jumia",
    logo: "https://logo.clearbit.com.jumia.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 2600,
    category: "Operations",
    experience: "Senior",
    postedDate: "2026-09-06",
    description: "Manage e-commerce projects from planning to delivery.",
    responsibilities: ["Plan projects", "Manage teams", "Track KPIs"],
    skills: ["Project Management", "Agile", "Leadership"],
    benefits: ["Health Insurance", "Staff Discount"]
  },
  {
    id: 26,
    title: "Full Stack Engineer",
    company: "Risevest",
    logo: "https://logo.clearbit.com.risevest.com",
    location: "Remote, Nigeria",
    type: "Full-time",
    salary: 3600,
    category: "Engineering",
    experience: "Senior",
    postedDate: "2026-09-05",
    description: "Build investment platform using React, Node, and PostgreSQL.",
    responsibilities: ["Build features", "API development", "Database design"],
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    benefits: ["Equity", "Remote Work"]
  },
  {
    id: 27,
    title: "Legal Counsel",
    company: "54gene",
    logo: "https://logo.clearbit.com.54gene.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 4000,
    category: "Legal",
    experience: "Senior",
    postedDate: "2026-09-04",
    description: "Handle legal matters for health-tech startup.",
    responsibilities: ["Contract review", "Compliance", "Legal advice"],
    skills: ["Corporate Law", "Compliance", "Negotiation"],
    benefits: ["Health Insurance", "Bonus"]
  },
  {
    id: 28,
    title: "Talent Acquisition Specialist",
    company: "Decagon",
    logo: "https://logo.clearbit.com.decagonhq.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 1700,
    category: "HR",
    experience: "Mid-Level",
    postedDate: "2026-09-03",
    description: "Recruit software engineers for training program.",
    responsibilities: ["Sourcing", "Interviewing", "Onboarding"],
    skills: ["Recruitment", "Sourcing", "ATS"],
    benefits: ["Health Insurance", "Training"]
  },
  {
    id: 29,
    title: "E-commerce Manager",
    company: "Konga",
    logo: "https://logo.clearbit.com.konga.com",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: 2400,
    category: "Operations",
    experience: "Senior",
    postedDate: "2026-09-02",
    description: "Manage online store operations and vendor relationships.",
    responsibilities: ["Manage catalog", "Optimize conversions", "Vendor management"],
    skills: ["E-commerce", "Analytics", "Vendor Management"],
    benefits: ["Health Insurance", "Staff Discount"]
  },
  {
    id: 30,
    title: "Technical Writer",
    company: "API Corp",
    logo: "https://logo.clearbit.com.github.com",
    location: "Remote, Nigeria",
    type: "Contract",
    salary: 1300,
    category: "Marketing",
    experience: "Mid-Level",
    postedDate: "2026-09-01",
    description: "Write documentation and developer guides for SaaS APIs.",
    responsibilities: ["Write docs", "Create tutorials", "Maintain knowledge base"],
    skills: ["Technical Writing", "Markdown", "API", "Git"],
    benefits: ["Flexible Hours"]
  }
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
  const [jobsList, setJobsList] = useState([]); // CHANGED: now state
  const [filters, setFilters] = useState({
    category: [],
    type: [],
    experience: [],
    salary: []
  });

  const sortOptions = ["Newest", "Oldest", "A-Z", "Z-A", "Salary: High-Low", "Salary: Low-High"];
  const allCategories = ["Design", "Engineering", "Marketing", "Product", "Sales", "Data", "Human Resources", "Writing", "Finance", "Customer Service", "Operations"];

  // NEW: Load jobs + saved state from localStorage on mount
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const jobsWithSaved = jobs.map(job => ({
     ...job,
      is_saved: savedIds.includes(job.id) // add is_saved flag
    }));
    setJobsList(jobsWithSaved);
  }, []);

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

  // NEW: Handle Save with localStorage
  const handleToggleSave = (e, jobId) => {
    e.stopPropagation();

    const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    let newSavedIds;

    if (savedIds.includes(jobId)) {
      newSavedIds = savedIds.filter(id => id!== jobId); // remove
    } else {
      newSavedIds = [...savedIds, jobId]; // add
    }

    localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));

    // Update UI
    setJobsList(prev => prev.map(job =>
      job.id === jobId? {...job, is_saved:!job.is_saved } : job
    ));

    if(activeTab === "saved" && savedIds.includes(jobId)) {
      setCurrentPage(1);
    }
  };

  const filteredJobs = useMemo(() => {
    let result = [...jobsList]; // use jobsList state
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
  }, [searchTitle, searchLocation, filters, sortBy, jobsList]);

  const displayedJobs = useMemo(() => {
    if (activeTab === "saved") return filteredJobs.filter(j => j.is_saved); // FIXED: was isSaved
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
                        {sortBy === opt && <Check size={14} color="#22C55E" />}
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
                    {/* UPDATED BOOKMARK */}
                    <Bookmark
                      size={20}
                      onClick={(e) => handleToggleSave(e, job.id)}
                      fill={job.is_saved? "#16a34a" : "none"}
                      color={job.is_saved? "#16a34a" : "currentColor"}
                      style={{ cursor: 'pointer' }}
                    />
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
          </div>

          <button className="yellowSearchBtn" onClick={() => setShowDropdown(true)}>
            <Search size={20} />
            Click to search jobs
          </button>

        <div className="mobileJobList">
          <p className="resultsCount">{displayedJobs.length} jobs found</p>
          {currentMobileJobs.length > 0? (
            currentMobileJobs.map((job) => (
              <div className="mobileCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                {/* UPDATED BOOKMARK */}
                <div className="mobileTop">
                  <img src={job.logo} alt={job.company} />
                  <Bookmark
                    size={18}
                    onClick={(e) => handleToggleSave(e, job.id)}
                    fill={job.is_saved? "#16a34a" : "none"}
                    color={job.is_saved? "#16a34a" : "currentColor"}
                    style={{ cursor: 'pointer' }}
                  />
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
