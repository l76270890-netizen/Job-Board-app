
import React, { useState } from 'react'; // 1. added useState
import './CompanyDetail.css';
import { ArrowLeft, MapPin, Briefcase, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { jobs } from "./AllJobs"; 

const companies = [
  {
    id: 1,
    name: "GIZ KE",
    location: "Nairobi, Kenya",
    industry: "Governmental",
    logo: "https://logo.clearbit.com/giz.de",
    banner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200", // 2. added banner
    employees: "1000-5000",
    about: "GIZ is a German development agency working worldwide for sustainable development. We support the Kenyan government in key sectors."
  },
  {
    id: 2,
    name: "Fuzu Ltd",
    location: "Nairobi, Kenya", 
    industry: "Computers, software dev",
    logo: "https://logo.clearbit.com/fuzu.com",
    banner: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200", // 2. added banner
    employees: "51-200",
    about: "Fuzu is Africa's leading career development, recruitment and talent platform. We help professionals find jobs and grow their careers."
  },
  {
    id: 3,
    name: "Oriental Mills Ltd",
    location: "India, India",
    industry: "Manufacturing",
    logo: "https://logo.clearbit.com/orientalmills.com",
    banner: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200",
    employees: "201-500",
    about: "Oriental Mills is a leading manufacturer of food products with operations across India and Africa."
  },
  {
    id: 4,
    name: "TechNova Ltd",
    location: "Lagos, Nigeria",
    industry: "Technology",
    logo: "https://logo.clearbit.com/technova.com",
    banner: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
    employees: "51-200",
    about: "TechNova is a product-driven tech company building the future of work in Africa. We’re hiring top talent to help us scale our platform to millions of users."
  },
  {
    id: 5,
    name: "Google",
    location: "California, USA", 
    industry: "Internet",
    logo: "https://logo.clearbit.com/google.com",
    banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
    employees: "100000+",
    about: "Google's mission is to organize the world's information and make it universally accessible and useful."
  },
  {
    id: 6,
    name: "Microsoft",
    location: "Washington, USA",
    industry: "Software",
    logo: "https://logo.clearbit.com/microsoft.com",
    banner: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200",
    employees: "200000+",
    about: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge."
  },
];

function CompanyDetail(){
  const navigate = useNavigate();
  const { companyName } = useParams();
  const [activeTab, setActiveTab] = useState('overview'); // 3. added tab state

  const company = companies.find(
    c => c.name.toLowerCase() === decodeURIComponent(companyName).toLowerCase()
  );

  const companyJobs = jobs.filter(
    job => job.company?.toLowerCase() === company?.name.toLowerCase()
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

  return (
    <div className="company-page-fuzu"> {/* 4. changed wrapper class */}
      <button className="detailBack" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      {/* 5. NEW BANNER + LOGO */}
      <div className="company-banner">
        <img src={company.banner} alt="banner" />
        <div className="company-logo-badge">
          <img 
            src={company.logo} 
            alt={company.name} 
            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=2563eb&color=fff&size=70`}
          />
        </div>
      </div>

      <div className="container">
        {/* 6. NEW HEADER INFO + VIEW JOBS BUTTON */}
        <div className="company-header-info">
          <h1 className="company-name">{company.name}</h1>
          <div className="company-meta">
            <span><Briefcase size={14}/> {company.industry}</span>
            <span><MapPin size={14}/> {company.location}</span>
            <span><Users size={14}/> {company.employees} employees</span>
          </div>
          <button className="view-jobs-main-btn" onClick={() => setActiveTab('jobs')}>
            View Jobs
          </button>
        </div>

        {/* 7. NEW TABS */}
        <div className="company-tabs">
          <button 
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'jobs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs ({companyJobs.length})
          </button>
        </div>

        {/* 8. CONDITIONAL TAB CONTENT */}
        {activeTab === 'overview' && (
          <div className="OverView">
            <div className="about-card">
              <h3>About Us</h3>
              <p>{company.about}</p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h3>Open Jobs ({companyJobs.length})</h3>
            {companyJobs.length === 0 ? (
              <p style={{color: '#6b7280'}}>No open jobs at {company.name} right now.</p>
            ) : (
              <div className="jobs-grid">
                {companyJobs.map(job => (
                  <div className="job-card" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, {state: job})}>
                    <div className="job-info">
                      <h4>{job.title}</h4>
                      <p><MapPin size={14}/> {job.location} • <span className="job-tag">{job.type}</span></p>
                    </div>
                    <button className="btn">View Job</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <hr />

        {/* RELATED JOBS - always visible at bottom */}
        <div className='Related-jobs'>
          <h2>Related Jobs</h2>
          <div className="jobs-grid">
            {jobs.filter(j => j.company !== company.name).slice(0,4).map(job => (
              <div className="job-card" key={job.id + 100} onClick={() => navigate(`/jobs/${job.id}`, {state: job})}>
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p><MapPin size={14}/> {job.location} • <span className="job-tag">{job.type}</span></p>
                </div>
                <button className="btn">View Job</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
