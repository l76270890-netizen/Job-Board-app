import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Search,
  X,
   ArrowLeft,
} from "lucide-react";
import "./CompaniesPages.css";

const companies = [
  {
    id: 1,
    name: "GIZ KE",
    location: "Nairobi, Kenya",
    industry: "Governmental",
    logo: "https://logo.clearbit.com/giz.de",
  },
  {
    id: 2,
    name: "Fuzu Ltd",
    location: "Nairobi, Kenya",
    industry: "Computers, software",
    logo: "https://logo.clearbit.com/fuzu.com",
  },
  {
    id: 3,
    name: "Oriental Mills Ltd",
    location: "India, India",
    industry: "Manufacturing",
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
    location: "California, USA",
    industry: "Internet",
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    id: 6,
    name: "Microsoft",
    location: "Washington, USA",
    industry: "Software",
    logo: "https://logo.clearbit.com/microsoft.com",
  },
];

function CompaniesPages() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter((company) => {
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
    <section className="companies-section">
<button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span></span>
          </button>
      <div className="companies-header">
        <h2 className="companies-title">Companies Hiring Now</h2>
        <span className="companies-subtitle">
          Explore opportunities at top workplaces
        </span>
      </div>

      {/* Search */}

      <div className="search-wrapper">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search companies, location or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <X
            size={18}
            className="clear-btn"
            onClick={() => setSearch("")}
          />
        )}

      </div>

      {/* Companies */}

      <div className="companies-grid">

        {filteredCompanies.length > 0 ? (

          filteredCompanies.map((company) => (

            <article
              key={company.id}
              className="company-card"
              onClick={() => handleViewJobs(company.name)}
            >

              <div className="company-card-top">

                <div className="logo-wrapper">
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

                <div className="company-meta">
                  <h3 className="company-name">
                    {company.name}
                  </h3>

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

                <button
                  className="view-jobs-btn"
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

          <div className="no-results">
            No companies found.
          </div>

        )}

      </div>

    
    </section>
  );
}

export default CompaniesPages;