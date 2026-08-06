
import "./WhyChooseUs.css";
import {
  Search,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  DollarSign
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 1. ADD
import { useNavigate } from "react-router-dom"; // 2. ADD

function WhyChooseUs() {
  const { userData } = useAuth(); // 3. ADD
  const navigate = useNavigate(); // 4. ADD
  
  const isEmployer = userData?.role === 'employer'; // 5. ADD

  // 6. EMPLOYER CONTENT
  if (isEmployer) {
    return (
      <section className="why employer-why">
        <div className="why-header">
          <h2>Why 500+ Companies Hire With JobConnect</h2>
          <p>
            Find the right talent faster. Post jobs, get quality applicants, and grow your team.
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">
              <Users size={34} />
            </div>
            <h3>Quality Applicants</h3>
            <p>
              Get pre-screened candidates that match your job requirements in 24 hours.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <Zap size={34} />
            </div>
            <h3>Faster Hiring</h3>
            <p>
              Average time to hire is 14 days vs 45 days industry average. Save time.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <BarChart3 size={34} />
            </div>
            <h3>Hiring Insights</h3>
            <p>
              Track applicants, views, and performance of all your job posts in one dashboard.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <DollarSign size={34} />
            </div>
            <h3>Free to Start</h3>
            <p>
              Post your first job for free. Pay only when you find the right hire.
            </p>
          </div>
        </div>

        <button 
          className="why-cta-btn" 
          onClick={() => navigate('/employer/post-job')}
        >
          Post Your First Job Free
        </button>
      </section>
    );
  }

  // 7. JOBSEEKER VIEW - YOUR ORIGINAL CODE UNCHANGED
  return (
    <section className="why">
      <div className="why-header">
        <h2>Why Choose JobConnect?</h2>
        <p>
          We make finding your dream job simple, fast, and reliable.
        </p>
      </div>

      <div className="why-grid">
        <div className="why-card">
          <div className="why-icon">
            <Search size={34} />
          </div>
          <h3>Smart Job Search</h3>
          <p>
            Search thousands of jobs using keywords,
            location, and category filters.
          </p>
        </div>

        <div className="why-card">
          <div className="why-icon">
            <Briefcase size={34} />
          </div>
          <h3>Top Companies</h3>
          <p>
            Connect with trusted employers and
            discover exciting career opportunities.
          </p>
        </div>

        <div className="why-card">
          <div className="why-icon">
            <ShieldCheck size={34} />
          </div>
          <h3>Verified Jobs</h3>
          <p>
            Every job listing is verified to ensure
            safety and authenticity.
          </p>
        </div>

        <div className="why-card">
          <div className="why-icon">
            <TrendingUp size={34} />
          </div>
          <h3>Career Growth</h3>
          <p>
            Build your future with opportunities
            that match your skills and goals.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
