import { useState, useMemo, useEffect } from "react";
import { MapPin, Briefcase, Users, Edit, Plus, TrendingUp, Eye } from "lucide-react";
import "./CompaniesHiring.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobs as staticJobs } from "../pages/AllJobs";
import { db } from "../firebase";
import { collection, query, where, getDocs, onSnapshot, doc, getDoc } from "firebase/firestore";

function CompaniesHiring() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [search, setSearch] = useState("");
  const [myCompanyStats, setMyCompanyStats] = useState({ jobCount: 0, applicantCount: 0, profileViews: 0 });
  const [firestoreJobs, setFirestoreJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEmployer = userData?.role === 'employer';

  useEffect(() => {
    fetchAllJobs();
  }, []);

  // LIVE STATS FOR EMPLOYER - FIXED TO USE companyId
  useEffect(() => {
    if (!isEmployer ||!currentUser) return;

    setLoading(true);

    // 1. Get profileViews from user doc
    const fetchProfile = async () => {
      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      if(userSnap.exists()) {
        setMyCompanyStats(prev => ({...prev, profileViews: userSnap.data().profileViews || 0}));
      }
    }
    fetchProfile();

    // 2. LIVE JOB COUNT - use companyId not companyName
    const jobsQ = query(collection(db, "jobs"), where("companyId", "==", currentUser.uid));
    const unsubJobs = onSnapshot(jobsQ, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
      const jobCount = jobs.filter(j => j.status!== 'closed').length;

      setMyCompanyStats(prev => ({...prev, jobCount }));
    });

    // 3. LIVE APPLICANT COUNT - use companyId not companyName
    const appsQ = query(collection(db, "applications"), where("companyId", "==", currentUser.uid));
    const unsubApps = onSnapshot(appsQ, (snapshot) => {
      setMyCompanyStats(prev => ({...prev, applicantCount: snapshot.size }));
      setLoading(false);
    });

    return () => { unsubJobs(); unsubApps(); }
  }, [isEmployer, currentUser]);

  const fetchAllJobs = async () => {
    try {
      const snapshot = await getDocs(collection(db, "jobs"));
      const jobs = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
      setFirestoreJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setLoading(false);
  };

  const allJobs = useMemo(() => [...staticJobs,...firestoreJobs], [firestoreJobs]);

  const companies = useMemo(() => {
    const companyMap = new Map();
    allJobs.forEach(job => {
      const companyName = job.company || job.companyName;
      if (!companyName) return;

      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, {
          name: companyName,
          location: job.location,
          industry: job.category || job.industry,
          logo: job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=22C55E&color=fff`,
          jobCount: 0
        });
      }
      const company = companyMap.get(companyName);
      if(job.status!== 'closed') company.jobCount += 1;
      if (job.logo) company.logo = job.logo;
      if (job.location) company.location = job.location;
    });
    return Array.from(companyMap.values());
  }, [allJobs]);

  const similarCompanies = useMemo(() => {
    if (!isEmployer ||!userData?.industry) return [];
    return companies
   .filter(c => c.industry === userData.industry && c.name!== userData.companyName)
   .sort((a, b) => b.jobCount - a.jobCount)
   .slice(0, 3);
  }, [companies, isEmployer, userData]);

  const filteredCompanies = companies.filter((company) => {
    const value = search.toLowerCase();
    return (
      company.name.toLowerCase().includes(value) ||
      company.location?.toLowerCase().includes(value) ||
      company.industry?.toLowerCase().includes(value)
    );
  }).sort((a, b) => b.jobCount - a.jobCount);

  const companiesToShow = filteredCompanies.slice(0, 6);

  const handleViewJobs = (companyName) => {
    navigate(`/company/${encodeURIComponent(companyName)}`);
  };

  if (loading && isEmployer) return <p style={{textAlign: 'center', padding: '40px'}}>Loading stats...</p>
  if (loading) return <p style={{textAlign: 'center', padding: '40px'}}>Loading...</p>

  // EMPLOYER VIEW - FIXED WITH REAL NUMBERS
  if (isEmployer) {
    const myCompany = {
      name: userData.companyName,
      logo: userData.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.companyName)}&background=22C55E&color=fff`,
      location: userData.companyLocation || "Nigeria",
      industry: userData.industry || "Company"
    }

    return (
      <section className="companies-section">
        <div className="companies-header">
          <h2 className="companies-title">Your Company Profile</h2>
          <button className="view-jobs-btn" onClick={() => navigate('/employer/profile')}>
            <Edit size={14} /> Edit Profile
          </button>
        </div>

        <div className="companies-grid1">
          <article className="company-card employer-card">
            <div className="company-card-top">
              <div className="logo-wrapper">
                <img
                  src={myCompany.logo}
                  alt={myCompany.name}
                  onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(myCompany.name)}&background=22C55E&color=fff`}
                />
              </div>
              <div className="company-meta">
                <h3 className="company-name">{myCompany.name}</h3>
                <span className="company-tag">
                  <Briefcase size={12} />
                  {myCompany.industry}
                </span>
              </div>
            </div>

            <div className="company-stats-row">
              <div className="stat-item">
                <Briefcase size={16} />
                <div>
                  <h4>{myCompanyStats.jobCount || 0}</h4> {/* || 0 to prevent NaN */}
                  <p>Active Jobs</p>
                </div>
              </div>
              <div className="stat-item">
                <Users size={16} />
                <div>
                  <h4>{myCompanyStats.applicantCount || 0}</h4>
                  <p>Applicants</p>
                </div>
              </div>
              <div className="stat-item">
                <Eye size={16} />
                <div>
                  <h4>{myCompanyStats.profileViews || 0}</h4>
                  <p>Views</p>
                </div>
              </div>
            </div>

            <div className="company-card-bottom">
              <div className="company-location">
                <MapPin size={14} />
                <span>{myCompany.location}</span>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                <button className="view-jobs-btn secondary" onClick={() => navigate('/employer/jobs')}>
                  Manage Jobs
                </button>
                <button className="view-jobs-btn" onClick={() => navigate('/employer/post-job')}>
                  <Plus size={14} /> Post Job
                </button>
              </div>
            </div>
          </article>
        </div>

        {similarCompanies.length > 0 && (
          <>
            <div className="companies-header" style={{marginTop: '40px'}}>
              <h2 className="companies-title">
                <TrendingUp size={20} style={{verticalAlign: 'middle', marginRight: '8px'}} />
                Companies similar to you
              </h2>
              <span className="companies-subtitle">See what others in {myCompany.industry} are hiring for</span>
            </div>

            <div className="companies-grid">
              {similarCompanies.map((company) => (
                <CompanyCardWithLiveCount
                  key={company.name}
                  company={company}
                  onClick={() => handleViewJobs(company.name)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  // JOBSEEKER VIEW - UNTOUCHED
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
        {companiesToShow.length > 0? (
          companiesToShow.map((company) => (
            <article key={company.name} className="company-card" onClick={() => handleViewJobs(company.name)}>
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
                  {company.jobCount} {company.jobCount === 1? 'Job' : 'Jobs'}
                </span>
                <button
                  className="view-jobs-btn"
                  onClick={(e) => { e.stopPropagation(); handleViewJobs(company.name) }}
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

// Component for live job count on similar companies
function CompanyCardWithLiveCount({ company, onClick }) {
  const [jobCount, setJobCount] = useState(company.jobCount);

  useEffect(() => {
    // FIX: query by companyName to match jobs
    const q = query(collection(db, "jobs"), where("companyName", "==", company.name));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeJobs = snapshot.docs.filter(d => d.data().status!== 'closed').length;
      setJobCount(activeJobs);
    });
    return () => unsubscribe();
  }, [company.name]);

  return (
    <article className="company-card" onClick={onClick}>
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
          {jobCount} {jobCount === 1? 'Job' : 'Jobs'}
        </span>
      </div>
    </article>
  );
}

export default CompaniesHiring;