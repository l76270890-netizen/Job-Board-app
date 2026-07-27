import "./AllJobs.css";
import {
  Search, MapPin, Bookmark, Briefcase, DollarSign, ArrowLeft, SlidersHorizontal,
  X, ArrowUpDown, Check, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const jobs = [
  // TEACHING - 7
  { id: 1, title: "Mathematics Teacher", company: "Greenspring School", logo: "https://logo.clearbit.com/greenspringschool.com", location: "Lagos, Nigeria", type: "Full-time", salary: 3500, category: "Teaching", experience: "Mid-Level", postedDate: "2026-09-29", description: "Teach Mathematics to SS1-SS3 students. Prepare students for WAEC and JAMB.", responsibilities: ["Teach classes", "Prepare lesson plans", "Grade assignments"], skills: ["Teaching", "Mathematics", "Curriculum"], benefits: ["Health Insurance", "Housing Allowance"] },
  { id: 2, title: "English Tutor", company: "LearnHub", logo: "https://logo.clearbit.com/learnhub.com", location: "Remote, Nigeria", type: "Part-time", salary: 1500, category: "Teaching", experience: "Junior", postedDate: "2026-09-28", description: "Teach English online to secondary school students.", responsibilities: ["Online classes", "Create notes"], skills: ["English", "Communication"], benefits: ["Flexible Hours"] },
  { id: 3, title: "Computer Science Lecturer", company: "UNILAG", logo: "https://logo.clearbit.com/unilag.edu.ng", location: "Lagos, Nigeria", type: "Full-time", salary: 5000, category: "Teaching", experience: "Senior", postedDate: "2026-09-27", description: "Lecture Computer Science courses.", responsibilities: ["Teach", "Research", "Supervise projects"], skills: ["Computer Science", "Research"], benefits: ["Health Insurance"] },
  { id: 4, title: "Primary School Head Teacher", company: "Bright Minds", logo: "https://logo.clearbit.com/brightminds.com", location: "Abuja, Nigeria", type: "Full-time", salary: 4000, category: "Teaching", experience: "Senior", postedDate: "2026-09-26", description: "Manage primary school operations.", responsibilities: ["Manage staff", "Curriculum oversight"], skills: ["Leadership", "Education"], benefits: ["Housing Allowance"] },
  { id: 5, title: "Physics Teacher", company: "Kings College", logo: "https://logo.clearbit.com/kingscollege.com", location: "Port Harcourt, Nigeria", type: "Full-time", salary: 3200, category: "Teaching", experience: "Mid-Level", postedDate: "2026-09-25", description: "Teach Physics to senior students.", responsibilities: ["Teach", "Lab management"], skills: ["Physics", "Lab"], benefits: ["Health Insurance"] },
  { id: 6, title: "Special Education Teacher", company: "Hope Center", logo: "https://logo.clearbit.com/hopecenter.com", location: "Kano, Nigeria", type: "Full-time", salary: 2800, category: "Teaching", experience: "Mid-Level", postedDate: "2026-09-24", description: "Teach children with special needs.", responsibilities: ["IEP", "Therapy support"], skills: ["Special Education"], benefits: ["Health Insurance"] },
  { id: 7, title: "Curriculum Developer", company: "EduTech", logo: "https://logo.clearbit.com/edutech.com", location: "Kaduna, Nigeria", type: "Contract", salary: 2500, category: "Teaching", experience: "Senior", postedDate: "2026-09-23", description: "Develop curriculum for schools.", responsibilities: ["Write curriculum", "Train teachers"], skills: ["Curriculum", "Training"], benefits: ["Remote Work"] },

  // BUSINESS - 7
  { id: 8, title: "Business Development Manager", company: "Dangote Group", logo: "https://logo.clearbit.com/dangote.com", location: "Abuja, Nigeria", type: "Full-time", salary: 8000, category: "Business", experience: "Senior", postedDate: "2026-09-22", description: "Lead B2B sales and partnerships.", responsibilities: ["Sales", "Partnerships"], skills: ["Sales", "Negotiation"], benefits: ["Car Allowance"] },
  { id: 9, title: "Sales Executive", company: "Nestle", logo: "https://logo.clearbit.com/nestle.com", location: "Lagos, Nigeria", type: "Full-time", salary: 3000, category: "Business", experience: "Mid-Level", postedDate: "2026-09-21", description: "Sell FMCG products to retailers.", responsibilities: ["Sales", "Client visits"], skills: ["Sales", "CRM"], benefits: ["Commission"] },
  { id: 10, title: "Operations Manager", company: "BUA Group", logo: "https://logo.clearbit.com/buagroup.com", location: "Kano, Nigeria", type: "Full-time", salary: 7000, category: "Business", experience: "Senior", postedDate: "2026-09-20", description: "Oversee daily operations.", responsibilities: ["Operations", "Team management"], skills: ["Operations", "Leadership"], benefits: ["Housing Allowance"] },
  { id: 11, title: "Account Manager", company: "MTN", logo: "https://logo.clearbit.com.mtn.ng", location: "Port Harcourt, Nigeria", type: "Contract", salary: 4000, category: "Business", experience: "Mid-Level", postedDate: "2026-09-19", description: "Manage key accounts.", responsibilities: ["Client management"], skills: ["Account Management"], benefits: ["Commission"] },
  { id: 12, title: "Business Analyst", company: "Access Bank", logo: "https://logo.clearbit.com.accessbank.com", location: "Cross Rivers, Nigeria", type: "Full-time", salary: 5000, category: "Business", experience: "Mid-Level", postedDate: "2026-09-18", description: "Analyze business processes.", responsibilities: ["Data analysis"], skills: ["Analysis", "SQL"], benefits: ["Health Insurance"] },
  { id: 13, title: "Retail Manager", company: "Shoprite", logo: "https://logo.clearbit.com.shoprite.com", location: "Kaduna, Nigeria", type: "Part-time", salary: 2000, category: "Business", experience: "Junior", postedDate: "2026-09-17", description: "Manage retail store.", responsibilities: ["Inventory", "Staff"], skills: ["Retail"], benefits: ["Staff Discount"] },
  { id: 14, title: "Customer Success Manager", company: "Kuda", logo: "https://logo.clearbit.com.kudabank.com", location: "Remote, Nigeria", type: "Full-time", salary: 4500, category: "Business", experience: "Mid-Level", postedDate: "2026-09-16", description: "Ensure customer satisfaction.", responsibilities: ["Support", "Onboarding"], skills: ["Customer Success"], benefits: ["Remote Work"] },

  // IT - 7
  { id: 15, title: "Frontend Engineer", company: "Paystack", logo: "https://logo.clearbit.com.paystack.com", location: "Lagos, Nigeria", type: "Full-time", salary: 6000, category: "IT", experience: "Mid-Level", postedDate: "2026-09-15", description: "Build React apps.", responsibilities: ["React", "UI"], skills: ["React", "JS"], benefits: ["Equity"] },
  { id: 16, title: "DevOps Engineer", company: "Flutterwave", logo: "https://logo.clearbit.com.flutterwave.com", location: "Remote, Nigeria", type: "Contract", salary: 15000, category: "IT", experience: "Senior", postedDate: "2026-09-14", description: "Manage AWS infra.", responsibilities: ["AWS", "CI/CD"], skills: ["AWS", "Docker"], benefits: ["Remote Work"] },
  { id: 17, title: "Backend Engineer", company: "Interswitch", logo: "https://logo.clearbit.com.interswitchgroup.com", location: "Abuja, Nigeria", type: "Full-time", salary: 8000, category: "IT", experience: "Senior", postedDate: "2026-09-13", description: "Build APIs.", responsibilities: ["API", "DB"], skills: ["Node.js", "Postgres"], benefits: ["Health Insurance"] },
  { id: 18, title: "Mobile Developer", company: "Opay", logo: "https://logo.clearbit.com.opay.com", location: "Port Harcourt, Nigeria", type: "Full-time", salary: 7000, category: "IT", experience: "Mid-Level", postedDate: "2026-09-12", description: "Build mobile apps.", responsibilities: ["React Native"], skills: ["React Native"], benefits: ["Health Insurance"] },
  { id: 19, title: "QA Engineer", company: "Andela", logo: "https://logo.clearbit.com.andela.com", location: "Remote, Nigeria", type: "Contract", salary: 4000, category: "IT", experience: "Mid-Level", postedDate: "2026-09-11", description: "Test applications.", responsibilities: ["Testing"], skills: ["QA", "Cypress"], benefits: ["Flexible Hours"] },
  { id: 20, title: "System Admin", company: "Airtel", logo: "https://logo.clearbit.com.airtel.com", location: "Kano, Nigeria", type: "Full-time", salary: 3500, category: "IT", experience: "Mid-Level", postedDate: "2026-09-10", description: "Manage servers.", responsibilities: ["Servers"], skills: ["Linux"], benefits: ["Health Insurance"] },
  { id: 21, title: "IT Support", company: "UNICAL", logo: "https://logo.clearbit.com.unical.edu.ng", location: "Cross Rivers, Nigeria", type: "Part-time", salary: 1500, category: "IT", experience: "Junior", postedDate: "2026-09-09", description: "Support staff.", responsibilities: ["Support"], skills: ["Troubleshooting"], benefits: [] },

  // FINANCE - 7
  { id: 22, title: "Financial Analyst", company: "GTBank", logo: "https://logo.clearbit.com.gtbank.com", location: "Lagos, Nigeria", type: "Full-time", salary: 4500, category: "Finance", experience: "Mid-Level", postedDate: "2026-09-08", description: "Analyze financial data.", responsibilities: ["Analysis"], skills: ["Excel", "SQL"], benefits: ["Health Insurance"] },
  { id: 23, title: "Accountant", company: "MTN", logo: "https://logo.clearbit.com.mtn.ng", location: "Lagos, Nigeria", type: "Full-time", salary: 3800, category: "Finance", experience: "Mid-Level", postedDate: "2026-09-07", description: "Manage accounts.", responsibilities: ["Accounting"], skills: ["Accounting"], benefits: ["Pension"] },
  { id: 24, title: "Investment Banker", company: "Stanbic", logo: "https://logo.clearbit.com.stanbicibtc.com", location: "Abuja, Nigeria", type: "Full-time", salary: 12000, category: "Finance", experience: "Senior", postedDate: "2026-09-06", description: "M&A deals.", responsibilities: ["Deals"], skills: ["Investment"], benefits: ["Bonus"] },
  { id: 25, title: "Risk Manager", company: "Zenith", logo: "https://logo.clearbit.com.zenithbank.com", location: "Port Harcourt, Nigeria", type: "Full-time", salary: 9000, category: "Finance", experience: "Senior", postedDate: "2026-09-05", description: "Manage risk.", responsibilities: ["Risk"], skills: ["Risk"], benefits: ["Health Insurance"] },
  { id: 26, title: "Tax Consultant", company: "KPMG", logo: "https://logo.clearbit.com.kpmg.com", location: "Remote, Nigeria", type: "Contract", salary: 6000, category: "Finance", experience: "Senior", postedDate: "2026-09-04", description: "Tax advisory.", responsibilities: ["Tax"], skills: ["Tax"], benefits: ["Remote Work"] },
  { id: 27, title: "Credit Officer", company: "First Bank", logo: "https://logo.clearbit.com.firstbanknigeria.com", location: "Kaduna, Nigeria", type: "Full-time", salary: 3500, category: "Finance", experience: "Mid-Level", postedDate: "2026-09-03", description: "Loan assessment.", responsibilities: ["Credit"], skills: ["Credit"], benefits: ["Health Insurance"] },
  { id: 28, title: "Payroll Specialist", company: "Shell", logo: "https://logo.clearbit.com.shell.com", location: "Cross Rivers, Nigeria", type: "Part-time", salary: 2500, category: "Finance", experience: "Junior", postedDate: "2026-09-02", description: "Manage payroll.", responsibilities: ["Payroll"], skills: ["Payroll"], benefits: [] },

  // HEALTHCARE - 7
  { id: 29, title: "Registered Nurse", company: "LUTH", logo: "https://logo.clearbit.com.luthnigeria.org", location: "Lagos, Nigeria", type: "Full-time", salary: 3000, category: "Healthcare", experience: "Mid-Level", postedDate: "2026-09-01", description: "Patient care.", responsibilities: ["Nursing"], skills: ["Nursing"], benefits: ["Health Insurance"] },
  { id: 30, title: "Telehealth Doctor", company: "Reliance Health", logo: "https://logo.clearbit.com.reliancehealth.com", location: "Remote, Nigeria", type: "Contract", salary: 8000, category: "Healthcare", experience: "Senior", postedDate: "2026-08-30", description: "Online consultations.", responsibilities: ["Consultations"], skills: ["Medicine"], benefits: ["Remote Work"] },
  { id: 31, title: "Pharmacist", company: "Emzor", logo: "https://logo.clearbit.com.emzor.com", location: "Abuja, Nigeria", type: "Full-time", salary: 4000, category: "Healthcare", experience: "Mid-Level", postedDate: "2026-08-29", description: "Dispense drugs.", responsibilities: ["Pharmacy"], skills: ["Pharmacy"], benefits: ["Health Insurance"] },
  { id: 32, title: "Lab Scientist", company: "Reddington", logo: "https://logo.clearbit.com.reddingtonhospital.com", location: "Port Harcourt, Nigeria", type: "Full-time", salary: 3500, category: "Healthcare", experience: "Mid-Level", postedDate: "2026-08-28", description: "Lab tests.", responsibilities: ["Lab"], skills: ["Lab"], benefits: ["Health Insurance"] },
  { id: 33, title: "Public Health Officer", company: "WHO", logo: "https://logo.clearbit.com.who.int", location: "Kaduna, Nigeria", type: "Contract", salary: 4500, category: "Healthcare", experience: "Senior", postedDate: "2026-08-27", description: "Public health programs.", responsibilities: ["Programs"], skills: ["Public Health"], benefits: ["Allowance"] },
  { id: 34, title: "Dental Surgeon", company: "AKTH", logo: "https://logo.clearbit.com.akth.gov.ng", location: "Kano, Nigeria", type: "Full-time", salary: 6000, category: "Healthcare", experience: "Senior", postedDate: "2026-08-26", description: "Dental care.", responsibilities: ["Dental"], skills: ["Dentistry"], benefits: ["Health Insurance"] },
  { id: 35, title: "Healthcare Assistant", company: "UCTH", logo: "https://logo.clearbit.com.ucth.gov.ng", location: "Cross Rivers, Nigeria", type: "Part-time", salary: 1200, category: "Healthcare", experience: "Junior", postedDate: "2026-08-25", description: "Assist patients.", responsibilities: ["Assistance"], skills: ["Care"], benefits: [] },

  // MARKETING - 7
  { id: 36, title: "Digital Marketing Manager", company: "Jumia", logo: "https://logo.clearbit.com.jumia.com", location: "Abuja, Nigeria", type: "Full-time", salary: 5500, category: "Marketing", experience: "Senior", postedDate: "2026-08-24", description: "Run ads.", responsibilities: ["Ads"], skills: ["SEO", "Ads"], benefits: ["Health Insurance"] },
  { id: 37, title: "Social Media Manager", company: "Coca Cola", logo: "https://logo.clearbit.com.coca-cola.com", location: "Lagos, Nigeria", type: "Full-time", salary: 4000, category: "Marketing", experience: "Mid-Level", postedDate: "2026-08-23", description: "Manage socials.", responsibilities: ["Social"], skills: ["Social Media"], benefits: ["Health Insurance"] },
  { id: 38, title: "Brand Manager", company: "Unilever", logo: "https://logo.clearbit.com.unilever.com", location: "Port Harcourt, Nigeria", type: "Full-time", salary: 7000, category: "Marketing", experience: "Senior", postedDate: "2026-08-22", description: "Brand strategy.", responsibilities: ["Brand"], skills: ["Branding"], benefits: ["Health Insurance"] },
  { id: 39, title: "Content Writer", company: "TechCabal", logo: "https://logo.clearbit.com.techcabal.com", location: "Remote, Nigeria", type: "Contract", salary: 1800, category: "Marketing", experience: "Junior", postedDate: "2026-08-21", description: "Write articles.", responsibilities: ["Writing"], skills: ["Writing"], benefits: ["Flexible Hours"] },
  { id: 40, title: "SEO Specialist", company: "Jobberman", logo: "https://logo.clearbit.com.jobberman.com", location: "Kaduna, Nigeria", type: "Part-time", salary: 1500, category: "Marketing", experience: "Mid-Level", postedDate: "2026-08-20", description: "SEO.", responsibilities: ["SEO"], skills: ["SEO"], benefits: [] },
  { id: 41, title: "Marketing Coordinator", company: "Kano Mills", logo: "https://logo.clearbit.com.kanomills.com", location: "Kano, Nigeria", type: "Full-time", salary: 2000, category: "Marketing", experience: "Junior", postedDate: "2026-08-19", description: "Marketing support.", responsibilities: ["Support"], skills: ["Marketing"], benefits: ["Health Insurance"] },
  { id: 42, title: "PR Manager", company: "Cross River Govt", logo: "https://logo.clearbit.com.crossriver.gov.ng", location: "Cross Rivers, Nigeria", type: "Full-time", salary: 5000, category: "Marketing", experience: "Senior", postedDate: "2026-08-18", description: "PR.", responsibilities: ["PR"], skills: ["PR"], benefits: ["Housing Allowance"] },

  // TECHNOLOGY - 7
  { id: 43, title: "Product Manager", company: "Andela", logo: "https://logo.clearbit.com.andela.com", location: "Port Harcourt, Nigeria", type: "Full-time", salary: 10000, category: "Technology", experience: "Senior", postedDate: "2026-08-17", description: "Own product.", responsibilities: ["Product"], skills: ["Product"], benefits: ["Equity"] },
  { id: 44, title: "UI/UX Designer", company: "TechCabal", logo: "https://logo.clearbit.com.techcabal.com", location: "Kaduna, Nigeria", type: "Part-time", salary: 2500, category: "Technology", experience: "Mid-Level", postedDate: "2026-08-16", description: "Design UI.", responsibilities: ["Design"], skills: ["Figma"], benefits: [] },
  { id: 45, title: "Data Scientist", company: "Google", logo: "https://logo.clearbit.com.google.com", location: "Lagos, Nigeria", type: "Full-time", salary: 15000, category: "Technology", experience: "Senior", postedDate: "2026-08-15", description: "Build ML models.", responsibilities: ["ML"], skills: ["Python", "ML"], benefits: ["Equity"] },
  { id: 46, title: "Cloud Engineer", company: "Microsoft", logo: "https://logo.clearbit.com.microsoft.com", location: "Remote, Nigeria", type: "Contract", salary: 20000, category: "Technology", experience: "Senior", postedDate: "2026-08-14", description: "AWS/Azure.", responsibilities: ["Cloud"], skills: ["AWS"], benefits: ["Remote Work"] },
  { id: 47, title: "Blockchain Developer", company: "Yellow Card", logo: "https://logo.clearbit.com.yellowcard.io", location: "Abuja, Nigeria", type: "Full-time", salary: 12000, category: "Technology", experience: "Senior", postedDate: "2026-08-13", description: "Web3.", responsibilities: ["Blockchain"], skills: ["Solidity"], benefits: ["Crypto"] },
  { id: 48, title: "AI Engineer", company: "Ubenwa", logo: "https://logo.clearbit.com.ubenwa.ai", location: "Kano, Nigeria", type: "Full-time", salary: 9000, category: "Technology", experience: "Senior", postedDate: "2026-08-12", description: "AI models.", responsibilities: ["AI"], skills: ["Python", "AI"], benefits: ["Research Budget"] },
  { id: 49, title: "Technical Writer", company: "GitHub", logo: "https://logo.clearbit.com.github.com", location: "Cross Rivers, Nigeria", type: "Contract", salary: 3000, category: "Technology", experience: "Mid-Level", postedDate: "2026-08-11", description: "Write docs.", responsibilities: ["Docs"], skills: ["Writing"], benefits: ["Flexible Hours"] },
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
  const [jobsList, setJobsList] = useState([]);
  const [filters, setFilters] = useState({ category: [], type: [], experience: [], salary: [] });

  const sortOptions = ["Newest", "Oldest", "A-Z", "Z-A", "Salary: High-Low", "Salary: Low-High"];
  const allCategories = ["Teaching", "Business", "IT", "Finance", "Healthcare", "Marketing", "Technology"];

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const jobsWithSaved = jobs.map(job => ({...job, is_saved: savedIds.includes(job.id) }));
    setJobsList(jobsWithSaved);
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

    // 1. SEARCH FILTER: title, company, description, skills, category
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

    // 2. LOCATION SEARCH
    if (searchLocation) {
      const locQuery = searchLocation.toLowerCase();
      result = result.filter(j => j.location.toLowerCase().includes(locQuery));
    }

    // 3. OTHER FILTERS
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

    // 4. SORT
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
            {currentJobs.length > 0? (
              currentJobs.map((job) => (
                <div className="jobCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                  <div className="jobHeader">
                    <img src={job.logo} alt={job.company} />
                    <Bookmark size={20} onClick={(e) => handleToggleSave(e, job.id)} fill={job.is_saved? "#16a34a" : "none"} color={job.is_saved? "#16a34a" : "currentColor"} style={{ cursor: 'pointer' }} />
                  </div>
                  <h2>{job.title}</h2>
                  <h4>{job.company}</h4>
                  <div className="jobTags"><span>{job.category}</span><span>{job.type}</span><span>{job.location}</span></div>
                  <p className="des">{job.description}</p>
                  <div className="salaryRow">
                    <div><DollarSign size={18} />${job.salary.toLocaleString()}/mo</div>
                    <button onClick={(e) => handleApplyClick(e, job)}>Apply</button> {/* 8. UPDATED */}
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
          {currentMobileJobs.length > 0? (
            currentMobileJobs.map((job) => (
              <div className="mobileCard" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                <div className="mobileTop">
                  <img src={job.logo} alt={job.company} />
                  <Bookmark size={18} onClick={(e) => handleToggleSave(e, job.id)} fill={job.is_saved? "#16a34a" : "none"} color={job.is_saved? "#16a34a" : "currentColor"} style={{ cursor: 'pointer' }} />
                </div>
                <h3>{job.title}</h3>
                <p className="companyName">{job.company}</p>
                <div className="mobileInfo"><span><MapPin size={14} />{job.location}</span><span><Briefcase size={14} />{job.type}</span><span>{job.category}</span></div>
                <p className="mobileDesc">{job.description}</p>
                <div className="mobileBottom">
                  <div className="salary"><DollarSign size={16} />${job.salary.toLocaleString()}/mo</div>
                  <button onClick={(e) => handleApplyClick(e, job)}>Apply</button> {/* 9. UPDATED */}
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