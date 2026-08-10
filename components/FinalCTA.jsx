import "./FinalCTA.css";
import { ArrowRight, Users, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const isEmployer = userData?.role === 'employer';

  if (isEmployer) {
    return (
      <section className="final-cta employer-cta">
        <div className="cta-container">
          <div className="cta-text">
            <h2>Ready to Hire Your Next Star?</h2>
            <p>Join 500+ companies finding top talent on JobConnect. Post your job and get applicants in 24 hours.</p>
            
            <div className="cta-stats">
              <div><Users size={20} /> 200,000+ Jobseekers</div>
              <div><Briefcase size={20} /> 50,000+ Jobs Filled</div>
            </div>

            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => navigate('/employer/post-job')}>
                Post a Job Free <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => navigate('/employer/pricing')}>
                View Pricing
              </button>
            </div>
          </div>
          <img src="https://illustrations.popsy.co/gray/hiring.svg" alt="hiring" className="cta-img" />
        </div>
      </section>
    )
  }

  // JOBSEEKER
  return (
    <section className="final-cta">
      <div className="cta-container">
        <div className="cta-text">
          <h2>Find Your Dream Job Today</h2>
          <p>Join 200,000+ jobseekers and get hired by 10,000+ top companies. Your next opportunity is one click away.</p>
          
          <div className="cta-stats">
            <div><Building2 size={20} /> 10,000+ Companies</div>
            <div><Briefcase size={20} /> 50,000+ Active Jobs</div>
          </div>

          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/jobs')}>
              Browse Jobs <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>
              Create Free Account
            </button>
          </div>
        </div>
        <img src="https://illustrations.popsy.co/gray/job-search.svg" alt="job search" className="cta-img" />
      </div>
    </section>
  );
}