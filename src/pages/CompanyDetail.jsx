import React, { useState, useMemo } from 'react';
import './CompanyDetail.css';
import { ArrowLeft, MapPin, Briefcase, Users, Building2, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { jobs as allJobs } from "./AllJobs";

const baseCompanies = [ // keep this for banner/about/links. Add more as needed
  {
    name: "GIZ KE", banner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200",
    employees: "1000-5000", about: "GIZ is a German development agency...",
    links: { linkedin: "#", facebook: "#", instagram: "#", website: "#" }
  },
  {
    name: "Google", banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
    employees: "100000+", about: "Google's mission is to organize the world's information...",
    links: { linkedin: "#", facebook: "#", instagram: "#", website: "#" }
  },
  // Add more custom details here
];

const CompanyLogo = ({ logo, name }) => (
  <img src={logo} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
);

function CompanyDetail(){
  const navigate = useNavigate();
  const { companyName } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const decodedName = decodeURIComponent(companyName);

  // 1. FIND COMPANY DATA FROM JOBS
  const companyData = useMemo(() => {
    const firstJob = allJobs.find(j => j.company.toLowerCase() === decodedName.toLowerCase());
    if(!firstJob) return null;

    const baseInfo = baseCompanies.find(c => c.name.toLowerCase() === decodedName.toLowerCase());

    return {
      name: firstJob.company,
      logo: firstJob.logo,
      location: firstJob.location,
      industry: firstJob.category,
      banner: baseInfo?.banner || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
      employees: baseInfo?.employees || "51-200",
      about: baseInfo?.about || `${firstJob.company} is hiring in ${firstJob.category}. Join our team and grow your career.`,
      links: baseInfo?.links || { website: "#", linkedin: "#", facebook: "#", instagram: "#" }
    }
  }, [decodedName]);

  if (!companyData) {
    return <div className="company-page"><button className="detailBack" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button><div className="container"><h2>Company not found</h2></div></div>
  }

  // 2. FILTER JOBS FOR THIS COMPANY
  const companyJobs = allJobs.filter(job => job.company.toLowerCase() === companyData.name.toLowerCase());

  // 3. RELATED JOBS: same category
  const relatedJobs = allJobs
  .filter(j => j.company!== companyData.name && j.category === companyData.industry)
  .slice(0,4);

  // 4. RELATED COMPANIES: same industry
  const allCompanies = Array.from(new Map(allJobs.map(j => [j.company, j])).values());
  const relatedCompanies = allCompanies
  .filter(c => c.category === companyData.industry && c.company!== companyData.name)
  .slice(0,4)
  .map(c => ({ name: c.company, logo: c.logo, industry: c.category }));

  return (
    <div className="company-page-fuzu">
      <button className="detailBack" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>

      <div className="company-banner">
        <img src={companyData.banner} alt="banner" />
        <div className="company-logo-badge">
          <CompanyLogo logo={companyData.logo} name={companyData.name} />
          <div className="companyFallbackLogoBig" style={{display: 'none'}}><Building2 size={30} /></div>
        </div>
      </div>

      <div className="container">
        <div className="company-header-info">
          <h1 className="company-name">{companyData.name}</h1>
          <div className="company-meta">
            <span><Briefcase size={14}/> {companyData.industry}</span>
            <span><MapPin size={14}/> {companyData.location}</span>
            <span><Users size={14}/> {companyData.employees} employees</span>
          </div>
          <div className="company-stats">
            <div><strong>{companyJobs.length}</strong><span>Open Jobs</span></div>
            <div><strong>{companyData.employees}</strong><span>Employees</span></div>
            <div><strong>{companyData.industry}</strong><span>Industry</span></div>
          </div>
          <button className="view-jobs-main-btn" onClick={() => setActiveTab('jobs')}>
            View Jobs ({companyJobs.length})
          </button>
        </div>

        <div className="company-tabs">
          <button className={activeTab === 'overview'? 'tab active' : 'tab'} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'jobs'? 'tab active' : 'tab'} onClick={() => setActiveTab('jobs')}>Jobs ({companyJobs.length})</button>
          <button className={activeTab === 'culture'? 'tab active' : 'tab'} onClick={() => setActiveTab('culture')}>Culture</button>
        </div>

        {activeTab === 'overview' && (
          <div className="OverView">
            <div className="about-card">
              <h3>About {companyData.name}</h3>
              <p>{companyData.about}</p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h3>Open Jobs at {companyData.name} ({companyJobs.length})</h3>
            {companyJobs.length === 0? (
              <p style={{color: '#6b7280'}}>No open jobs at {companyData.name} right now.</p>
            ) : (
              <div className="jobs-grid">
                {companyJobs.map(job => (
                  <div className="job-card" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                    <div className="job-info">
                      <h4>{job.title}</h4>
                      <p><MapPin size={14}/> {job.location} • <span className="job-tag">{job.type}</span></p>
                      <p className="salary"><strong>${job.salary.toLocaleString()}/mo</strong></p>
                    </div>
                    <button className="btn">View Job</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="culture-section">
            <div className="about-card">
              <h3>Life at {companyData.name}</h3>
              <div className="benefits-list">
                {["Remote Friendly", "Health Insurance", "Learning Budget", "Flexible Hours"].map(b => (
                  <div key={b} className="benefit-item"><CheckCircle size={16} color="#22c55e"/>{b}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        <hr />
        <div className='Related-jobs'>
          <h2>Related Jobs</h2>
          <div className="jobs-grid">
            {relatedJobs.map(job => (
              <div className="job-card" key={job.id + 100} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}>
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p className="company-name-small">{job.company}</p>
                  <p><MapPin size={14}/> {job.location} • <span className="job-tag">{job.type}</span></p>
                </div>
                <button className="btn">View Job</button>
              </div>
            ))}
          </div>
        </div>
        <hr />

        {relatedCompanies.length > 0 && (
          <>
          <div className='Related-jobs'>
            <h2>Similar Companies</h2>
            <div className="jobs-grid">
              {relatedCompanies.map(comp => (
                <div className="company-mini-card" key={comp.name} onClick={() => navigate(`/company/${encodeURIComponent(comp.name)}`)}>
                  <img src={comp.logo} alt={comp.name} />
                  <h4>{comp.name}</h4>
                  <p>{comp.industry}</p>
                </div>
              ))}
            </div>
          </div>
          <hr />
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
