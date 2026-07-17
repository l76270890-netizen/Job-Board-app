import React from "react";

import "./Footer.css";


function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>JobFinder</h2>
          <p>
            Connecting talented people with companies
            looking for great skills.
          </p>

        
        </div>


        {/* Job Seekers */}
        <div className="footer-column">
          <h3>For Job Seekers</h3>
          <a href="#">Find Jobs</a>
          <a href="#">Create Profile</a>
          <a href="#">Career Advice</a>
          <a href="#">Saved Jobs</a>
        </div>


        {/* Employers */}
        <div className="footer-column">
          <h3>For Employers</h3>
          <a href="#">Post a Job</a>
          <a href="#">Browse Candidates</a>
          <a href="#">Pricing</a>
          <a href="#">Recruitment Tools</a>
        </div>


        {/* Company */}
        <div className="footer-column">
          <h3>Company</h3>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </div>

      </div>


      <div className="footer-bottom">
        <p>
          © 2026 JobFinder. All rights reserved.
        </p>
      </div>

    </footer>
  );
}


export default Footer;