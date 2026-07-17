import { MapPin, Briefcase } from "lucide-react"; 
import "./CompaniesHiring.css";
import { useNavigate } from "react-router-dom";

const companies = [
  {
    id: 1,
    name: "GIZ KE",
    location: "Nairobi, Kenya",
    industry: "Governmental",
    logo: "https://logo.clearbit.com/giz.de"
  },
  {
    id: 2,
    name: "Fuzu Ltd",
    location: "Nairobi, Kenya", 
    industry: "Computers, software de...",
    logo: "https://logo.clearbit.com/fuzu.com"
  },
  {
    id: 3,
    name: "Oriental Mills Ltd",
    location: "India, India",
    industry: "Manufacturing",
    logo: "https://logo.clearbit.com/orientalmills.com"
  },
  {
    id: 4, // fixed duplicate ids
    name: "TechNova Ltd",
    location: "Lagos, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/technova.com"
  },
  {
    id: 5,
    name: "Google",
    location: "California, USA", 
    industry: "Internet",
    logo: "https://logo.clearbit.com/google.com"
  },
  {
    id: 6,
    name: "Microsoft",
    location: "Washington, USA",
    industry: "Software",
    logo: "https://logo.clearbit.com/microsoft.com"
  },
];

function CompaniesHiring  () {
  const navigate = useNavigate();

  const handleViewJobs = (companyName) => {
    navigate(`/company/${encodeURIComponent(companyName)}`); // goes to company detail page
  };
  
  return (
    <section className="companies-section">
      <div className="companies-header">
        <h2 className="companies-title">Companies hiring now</h2>
        <span className="companies-subtitle">Explore opportunities at top workplaces</span>
      </div>
      
      <div className="companies-grid">
        {companies.map((company) => (
          <article 
            key={company.id} 
            className="company-card"
            onClick={() => handleViewJobs(company.name)} // 1. Make whole card clickable
            style={{cursor: 'pointer'}}
          >
            <div className="company-card-top">
              <div className="logo-wrapper">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=2563eb&color=fff`}
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
              <button 
                className="view-jobs-btn" 
                onClick={(e) => {
                  e.stopPropagation(); // 2. Stop card click when button is clicked
                  handleViewJobs(company.name)
                }}
                aria-label={`View jobs at ${company.name}`}
              >
                View Jobs
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="View-button" onClick={() => navigate('/companies')}>
        View more
      </div>
    </section>
  );
};

export default CompaniesHiring;