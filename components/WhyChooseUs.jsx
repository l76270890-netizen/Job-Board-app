import "./WhyChooseUs.css";
import {
  Search,
  Briefcase,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

function WhyChooseUs() {
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