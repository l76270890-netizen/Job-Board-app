import React from "react";
import "./Footer.css";
import { useAuth } from "../context/AuthContext"; // 1. ADD
import { Link } from "react-router-dom"; // 2. ADD for navigation

function Footer() {
  const { userData } = useAuth(); // 3. ADD
  const isEmployer = userData?.role === 'employer'; // 4. ADD
  const isJobseeker = userData?.role === 'jobseeker'; // 5. ADD
  const isGuest = !userData; // 6. ADD

  return (
    <footer className={`footer ${isEmployer ? 'employer-footer' : ''}`}> {/* 7. ADD CLASS */}

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>JobFinder</h2>
          <p>
            {isEmployer 
              ? "Hire top talent faster with tools built for African companies." 
              : "Connecting talented people with companies looking for great skills."}
          </p>

          {/* 8. ADD ROLE-BASED CTA BUTTON */}
          {isEmployer && (
            <Link to="/employer/post-job" className="footer-cta-btn">Post a Job</Link>
          )}
          {isJobseeker && (
            <Link to="/jobs" className="footer-cta-btn">Find Jobs</Link>
          )}
          {isGuest && (
            <div className="footer-cta-group">
              <Link to="/jobs" className="footer-cta-btn">Find Jobs</Link>
              <Link to="/employer/post-job" className="footer-cta-btn-outline">Hire Talent</Link>
            </div>
          )}
        </div>

        {/* DYNAMIC COLUMN 1 */}
        <div className="footer-column">
          <h3>{isEmployer ? 'For Employers' : 'For Job Seekers'}</h3>
          {isEmployer ? (
            <>
              <Link to="/employer/post-job">Post a Job</Link>
              <Link to="/employer/dashboard">Dashboard</Link>
              <Link to="/employer/candidates">Browse Candidates</Link>
              <Link to="/employer/pricing">Pricing</Link>
            </>
          ) : (
            <>
              <Link to="/jobs">Find Jobs</Link>
              <Link to="/profile">Create Profile</Link>
              <Link to="/career-advice">Career Advice</Link>
              <Link to="/saved-jobs">Saved Jobs</Link>
            </>
          )}
        </div>

        {/* DYNAMIC COLUMN 2 */}
        <div className="footer-column">
          <h3>{isEmployer ? 'Hiring Resources' : 'Company'}</h3>
          {isEmployer ? (
            <>
              <Link to="/employer/resources">Hiring Guide</Link>
              <Link to="/employer/tools">Recruitment Tools</Link>
              <Link to="/employer/success-stories">Success Stories</Link>
              <Link to="/contact">Support</Link>
            </>
          ) : (
            <>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms</Link>
            </>
          )}
        </div>

        {/* 9. ALWAYS SHOW THIS COLUMN FOR EMPLOYERS TO CROSS-SELL */}
        {(isEmployer || isGuest) && (
          <div className="footer-column">
            <h3>For Job Seekers</h3>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/companies">Top Companies</Link>
          </div>
        )}
        {(isJobseeker || isGuest) && (
          <div className="footer-column">
            <h3>For Employers</h3>
            <Link to="/employer/post-job">Post a Job</Link>
            <Link to="/employer/pricing">Pricing</Link>
            <Link to="/employer/contact">Sales Contact</Link>
          </div>
        )}

      </div>

      <div className="footer-bottom">
        <p>© 2026 JobFinder. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;