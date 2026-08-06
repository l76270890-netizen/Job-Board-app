import { useState, useMemo, useEffect } from "react"; // added useEffect
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Search, X, ArrowLeft } from "lucide-react";
import "./CompaniesPages.css";
import { jobs as staticJobs } from "./AllJobs"; // renamed
import { db } from "../firebase"; // ADD
import { collection, getDocs } from "firebase/firestore"; // ADD

function CompaniesPages() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [firestoreJobs, setFirestoreJobs] = useState([]); // ADD
  const [loading, setLoading] = useState(true); // ADD

  // FETCH JOBS FROM FIRESTORE
  useEffect(() => { // ADD THIS WHOLE useEffect
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"));
        const jobs = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
        setFirestoreJobs(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // GENERATE COMPANIES FROM BOTH STATIC + FIRESTORE JOBS
  const companiesFromJobs = useMemo(() => {
    const companyMap = new Map();
    const allJobs = [...staticJobs,...firestoreJobs]; // MERGE

    allJobs.forEach(job => {
      const companyName = job.company || job.companyName; // handle both
      if (!companyName) return;

      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, {
          name: companyName,
          logo: job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=22C55E&color=fff`,
          location: job.location,
          industry: job.category || job.industry,
          jobCount: 0,
          description: job.companyDescription || "" // ADD
        });
      }
      const company = companyMap.get(companyName);
      company.jobCount += 1;
      // Use first non-empty description/logo/location we find
      if (!company.description && job.companyDescription) company.description = job.companyDescription;
      if (job.logo) company.logo = job.logo;
      if (job.location) company.location = job.location;
    });

    return Array.from(companyMap.values());
  }, [firestoreJobs]); // re-run when firestore jobs load

  const filteredCompanies = companiesFromJobs.filter((company) => {
    const value = search.toLowerCase();
    return (
      company.name.toLowerCase().includes(value) ||
      company.location?.toLowerCase().includes(value) ||
      company.industry?.toLowerCase().includes(value)
    );
  });

  const handleViewJobs = (companyName) => {
    navigate(`/company/${encodeURIComponent(companyName)}`);
  };

  if (loading) return <p style={{textAlign: 'center', marginTop: '40px'}}>Loading companies...</p>

  return (
    <section className="companiesPage-section">
     <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
            <span></span>
          </button>

      <div className="companiesPage-header">
        <h2 className="companiesPage-title">Companies Hiring Now</h2>
        <span className="companiesPage-subtitle">
          Explore {companiesFromJobs.length} companies with {staticJobs.length + firestoreJobs.length} open jobs
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
                    {company.industry || "General"}
                  </span>
                </div>
              </div>

              <div className="companyPage-card-bottom">
                <div className="companyPage-location">
                  <MapPin size={14} />
                  <span>{company.location || "Nigeria"}</span>
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
