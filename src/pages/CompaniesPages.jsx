import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Search, X, ArrowLeft } from "lucide-react";
import "./CompaniesPages.css";
import { jobs as allJobs } from "./AllJobs";

function CompaniesPages() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // GENERATE COMPANIES FROM JOBS ARRAY
  const companiesFromJobs = useMemo(() => {
    const companyMap = new Map();

    allJobs.forEach(job => {
      if (!companyMap.has(job.company)) {
        companyMap.set(job.company, {
          name: job.company,
          logo: job.logo,
          location: job.location,
          industry: job.category,
          jobCount: 0
        });
      }
      companyMap.get(job.company).jobCount += 1;
    });

    return Array.from(companyMap.values());
  }, []);

  const filteredCompanies = companiesFromJobs.filter((company) => {
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
          Explore {companiesFromJobs.length} companies with {allJobs.length} open jobs
        </span>
      </div>

      <div className="searchPage-wrapper">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search companies, location or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <X size={18} className="clear-btn" onClick={() => setSearch("")} />}
      </div>

      <div className="companiesPage-grid">
        {filteredCompanies.length > 0? (
          filteredCompanies.sort((a, b) => b.jobCount - a.jobCount).map((company) => (
            <article
              key={company.name}
              className="companyPage-card"
              onClick={() => handleViewJobs(company.name)}
            >
              <div className="companyPage-card-top">
                <div className="logoPage-wrapper">
                  <img
                    src={company.logo}
                    alt={company.name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=22C55E&color=fff`;
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
                <span className="job-count-badge">
                  {company.jobCount} {company.jobCount === 1? 'Job' : 'Jobs'}
                </span>
                <button className="view-jobs-btn-Page" onClick={(e) => { e.stopPropagation(); handleViewJobs(company.name); }}>
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