
import React, { useState, useEffect } from 'react';
import './CompanyDetail.css';
import {
  ArrowLeft, MapPin, Briefcase, Users, Building2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { jobs as allJobs } from "./AllJobs"; // 1. Use local jobs instead of supabase

// 2. Added links + more details
const companies = [
  {
    id: 1,
    name: "GIZ KE",
    location: "Abuja, Nigeria",
    industry: "NGO / Development",
    logo: "https://logo.clearbit.com/giz.de",
    banner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200",
    employees: "1000-5000",
    about: "GIZ is a German development agency working worldwide for sustainable development. We support the Nigerian government in key sectors including energy, governance and economic development.",
    links: { linkedin: "https://linkedin.com/company/giz", facebook: "https://facebook.com/giz", instagram: "https://instagram.com/giz", website: "https://giz.de" }
  },
  {
    id: 2,
    name: "Fuzu Ltd",
    location: "Remote, Nigeria",
    industry: "HR Tech",
    logo: "https://logo.clearbit.com/fuzu.com",
    banner: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    employees: "51-200",
    about: "Fuzu is Africa's leading career development, recruitment and talent platform. We help 2M+ professionals find jobs and grow their careers through AI-powered recommendations.",
    links: { linkedin: "https://linkedin.com/company/fuzu", facebook: "https://facebook.com/fuzu", instagram: "https://instagram.com/fuzu", website: "https://fuzu.com" }
  },
  {
    id: 3,
    name: "Oriental Mills Ltd",
    location: "Port Harcourt, Nigeria",
    industry: "FMCG",
    logo: "https://logo.clearbit.com/orientalmills.com",
    banner: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200",
    employees: "201-500",
    about: "Oriental Mills is a leading manufacturer of flour, pasta and noodles with operations across Nigeria and West Africa. Committed to feeding the nation.",
    links: { linkedin: "https://linkedin.com/company/orientalmills", facebook: "https://facebook.com/orientalmills", instagram: "https://instagram.com/orientalmills", website: "https://orientalmills.com" }
  },
  {
    id: 4,
    name: "TechNova Ltd",
    location: "Lagos, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/technova.com",
    banner: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
    employees: "51-200",
    about: "TechNova is a product-driven tech company building the future of work in Africa. We’re hiring top talent to help us scale our platform to millions of users.",
    links: { linkedin: "https://linkedin.com/company/technova", facebook: "https://facebook.com/technova", instagram: "https://instagram.com/technova", website: "https://technova.com" }
  },
  {
    id: 5,
    name: "Google",
    location: "Remote, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/google.com",
    banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
    employees: "100000+",
    about: "Google's mission is to organize the world's information and make it universally accessible and useful. We have teams across Africa building for the next billion users.",
    links: { linkedin: "https://linkedin.com/company/google", facebook: "https://facebook.com/google", instagram: "https://instagram.com/google", website: "https://google.com" }
  },
  {
    id: 6,
    name: "Microsoft",
    location: "Lagos, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/microsoft.com",
    banner: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200",
    employees: "200000+",
    about: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Empowering every person and organization to achieve more.",
    links: { linkedin: "https://linkedin.com/company/microsoft", facebook: "https://facebook.com/microsoft", instagram: "https://instagram.com/microsoft", website: "https://microsoft.com" }
  },
];

// Fallback logo component
const CompanyLogo = ({ logo, name }) => (
  <img
    src={logo}
    alt={name}
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
);

function CompanyDetail(){
  const navigate = useNavigate();
  const { companyName } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);

  // 3. Load jobs from local array instead of supabase
  useEffect(() => {
    setJobs(allJobs);
  }, []);

  const company = companies.find(
    c => c.name.toLowerCase() === decodeURIComponent(companyName).toLowerCase()
  );

  if (!company) {
    return (
      <div className="company-page">
        <button className="detailBack" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="container"><h2>Company not found</h2></div>
      </div>
    )
  }

  // 4. Company Jobs
  const companyJobs = jobs.filter(
    job => job.company?.toLowerCase() === company?.name.toLowerCase()
  );

  // 5. Related Jobs: same industry, exclude current company
  const relatedJobs = jobs
   .filter(j => j.company?.toLowerCase()!== company.name.toLowerCase() && j.category?.toLowerCase().includes(company.industry.toLowerCase().split(' ')[0]))
   .slice(0,4);

  // 6. NEW: Related Companies: same industry
  const relatedCompanies = companies
   .filter(c => c.industry === company.industry && c.id!== company.id)
   .slice(0,4);

  return (
    <div className="company-page-fuzu">
      <button className="detailBack" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      <div className="company-banner">
        <img src={company.banner} alt="banner" />
        <div className="company-logo-badge">
          <CompanyLogo logo={company.logo} name={company.name} />
          <div className="companyFallbackLogoBig" style={{display: 'none'}}>
            <Building2 size={30} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="company-header-info">
          <h1 className="company-name">{company.name}</h1>
          <div className="company-meta">
            <span><Briefcase size={14}/> {company.industry}</span>
            <span><MapPin size={14}/> {company.location}</span>
            <span><Users size={14}/> {company.employees} employees</span>
          </div>

          {/* UNIQUE FEATURE 1: Quick Stats */}
          <div className="company-stats">
            <div><strong>{companyJobs.length}</strong><span>Open Jobs</span></div>
            <div><strong>{company.employees}</strong><span>Employees</span></div>
            <div><strong>{company.industry}</strong><span>Industry</span></div>
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
              <h3>About {company.name}</h3>
              <p>{company.about}</p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h3>Open Jobs at {company.name} ({companyJobs.length})</h3>
            {companyJobs.length === 0? (
              <p style={{color: '#6b7280'}}>No open jobs at {company.name} right now.</p>
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

        {/* UNIQUE FEATURE 2: Culture Tab */}
        {activeTab === 'culture' && (
          <div className="culture-section">
            <div className="about-card">
              <h3>Life at {company.name}</h3>
              <div className="benefits-list">
                {["Remote Friendly", "Health Insurance", "Learning Budget", "Flexible Hours"].map(b => (
                  <div key={b} className="benefit-item"><CheckCircle size={16} color="#22c55e"/>{b}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        <hr />

        {/* RELATED JOBS SECTION */}
        <div className='Related-jobs'>
          <h2>Related Jobs</h2>
          {relatedJobs.length === 0? (
            <p style={{color: '#6b7280'}}>No other jobs available</p>
          ) : (
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
          )}
        </div>
        <hr />

        {/* UNIQUE FEATURE 3: Related Companies */}
        {relatedCompanies.length > 0 && (
          <>
          <div className='Related-jobs'>
            <h2>Similar Companies</h2>
            <div className="jobs-grid">
              {relatedCompanies.map(comp => (
                <div className="company-mini-card" key={comp.id} onClick={() => navigate(`/company/${encodeURIComponent(comp.name)}`)}>
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

        {/* FIXED: Company Links */}
        <div className="LinkList">
          <h2>Connect with {company.name}</h2>
          <div className="Links">
            <a href={company.links.website} target="_blank" rel="noreferrer"> Website</a>
            <a href={company.links.linkedin} target="_blank" rel="noreferrer"> LinkedIn</a>
            <a href={company.links.facebook} target="_blank" rel="noreferrer"> Facebook</a>
            <a href={company.links.instagram} target="_blank" rel="noreferrer"> Instagram</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
