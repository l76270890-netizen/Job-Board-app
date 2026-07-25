import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Search,
  X,
  ArrowLeft,
} from "lucide-react";
import "./CompaniesPages.css";
import { jobs as allJobs } from "./AllJobs"; // import jobs to count

const companies = [
  {
    id: 1,
    name: "GIZ KE",
    location: "Abuja, Nigeria", // matched to AllJobs
    industry: "NGO / Development",
    logo: "https://logo.clearbit.com/giz.de",
  },
  {
    id: 2,
    name: "Fuzu Ltd",
    location: "Remote, Nigeria",
    industry: "HR Tech",
    logo: "https://logo.clearbit.com/fuzu.com",
  },
  {
    id: 3,
    name: "Oriental Mills Ltd",
    location: "Port Harcourt, Nigeria",
    industry: "FMCG",
    logo: "https://logo.clearbit.com/orientalmills.com",
  },
  {
    id: 4,
    name: "TechNova Ltd",
    location: "Lagos, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/technova.com",
  },
  {
    id: 5,
    name: "Google",
    location: "Remote, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    id: 6,
    name: "Microsoft",
    location: "Lagos, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/microsoft.com",
  },
];

function CompaniesPages() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Add job count to each company
  const companiesWithJobs = useMemo(() => {
    return companies.map(company => ({
      ...company,
      jobCount: allJobs.filter(job => job.company === company.name).length
    }))
  }, []);

  const filteredCompanies = companiesWithJobs.filter((company) => {
    const value = search.toLowerCase();
    return (
      company.name.toLowerCase().includes(value) ||
      company.location.toLowerCase().includes(value) ||
      company.industry.toLowerCase().includes(value)
    );
  });

  const handleViewJobs = (companyName) => {
    navigate(`/company/${encodeURIComponent(companyName)}`);
  };
  
  return (
    <section className="companiesPage-section">
     <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span></span>
          </button>

      <div className="companiesPage-header">
        <h2 className="companiesPage-title">Companies Hiring Now</h2>
        <span className="companiesPage-subtitle">
          Explore opportunities at top workplaces
        </span>
      </div>

      {/* Search */}
      <div className="searchPage-wrapper">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search companies, location or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <X size={18} className="clear-btn" onClick={() => setSearch("")} />
        )}
      </div>

      {/* Companies */}
      <div className="companiesPage-grid">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <article
              key={company.id}
              className="companyPage-card"
              onClick={() => handleViewJobs(company.name)}
            >
              <div className="companyPage-card-top">
                <div className="logoPage-wrapper">
                  <img
                    src={company.logo}
                    alt={company.name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        company.name
                      )}&background=22C55E&color=fff`;
                    }}
                  />
                </div>

                <div className="companyPage-meta">
                  <h3 className="companyPage-name">{company.name}</h3>
                  <span className="companyPage-tag">
                    <Briefcase size={12} />
                    {company.industry}
                  </span>
                </div>
              </div>

              <div className="companyPage-card-bottom">
                <div className="companyPage-location">
                  <MapPin size={14} />
                  <span>{company.location}</span>
                </div>

                {/* NEW: Job Count Badge */}
                <span className="job-count-badge">
                  {company.jobCount} {company.jobCount === 1 ? 'Job' : 'Jobs'}
                </span>

                <button
                  className="view-jobs-btn-Page"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewJobs(company.name);
                  }}
                >
                  View Jobs
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="no-results-Page">No companies found.</div>
        )}
      </div>
    </section>
  );
}

export default CompaniesPages;