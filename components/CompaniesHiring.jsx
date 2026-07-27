
import { useState, useMemo } from "react";
import { MapPin, Briefcase, Search, X } from "lucide-react"; 
import "./CompaniesHiring.css";
import { useNavigate } from "react-router-dom";
import { jobs as allJobs } from "../pages/AllJobs"; // import your jobs

function CompaniesHiring() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // 1. GENERATE COMPANIES FROM JOBS + ADD JOB COUNT
  const companies = useMemo(() => {
    const companyMap = new Map();

    allJobs.forEach(job => {
      if (!companyMap.has(job.company)) {
        companyMap.set(job.company, {
          name: job.company,
          location: job.location,
          industry: job.category,
          logo: job.logo,
          jobCount: 0
        });
      }
      companyMap.get(job.company).jobCount += 1;
    });

    return Array.from(companyMap.values());
  }, []);

  // 2. FILTER COMPANIES
  const filteredCompanies = companies.filter((company) => {
    const value = search.toLowerCase();
    return (
      company.name.toLowerCase().includes(value) ||
      company.location.toLowerCase().includes(value) ||
      company.industry.toLowerCase().includes(value)
    );
  }).sort((a, b) => b.jobCount - a.jobCount); // most jobs first

  // Show only first 6 on homepage. Remove .slice(0,6) if you want all
  const companiesToShow = filteredCompanies.slice(0, 6);

  const handleViewJobs = (companyName) => {
    navigate(`/company/${encodeURIComponent(companyName)}`); // goes to company detail page
  };
  
  return (
    <section className="companies-section">
      <div className="companies-header">
        <h2 className="companies-title">Companies hiring now</h2>
        <span className="companies-subtitle">Explore opportunities at top workplaces</span>
      </div>

     
      <div className="View1-button" onClick={() => navigate('/companies')}>
        View all ({companies.length})
      </div>
      <div className="companies-grid">
        {companiesToShow.length > 0 ? (
          companiesToShow.map((company) => (
            <article 
              key={company.name} 
              className="company-card"
              onClick={() => handleViewJobs(company.name)} // whole card clickable
            >
              <div className="company-card-top">
                <div className="logo-wrapper">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=22C55E&color=fff`}
                  />
                </div>
                <div className="company-meta">
                  <h3 className="company-name">{company.name}</h3>
                  <span className="company-tag">
                    <Briefcase size={12} />
                    {company.industry}
                  </span>
                </div>
              </div>
              
              <div className="company-card-bottom">
                <div className="company-location">
                  <MapPin size={14} />
                  <span>{company.location}</span>
                </div>

                <span className="job-count-badge">
                  {company.jobCount} {company.jobCount === 1 ? 'Job' : 'Jobs'}
                </span>

                <button 
                  className="view-jobs-btn" 
                  onClick={(e) => {
                    e.stopPropagation(); // stop card click when button is clicked
                    handleViewJobs(company.name)
                  }}
                >
                  View Jobs
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="no-results">No companies found</div>
        )}
      </div>

    
    </section>
  );
};

export default CompaniesHiring;
