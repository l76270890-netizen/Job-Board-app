import { UserPlus, Search, FileCheck } from "lucide-react";
import "./HowItWorks.css";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    desc: "Sign up in 30 seconds. Add your resume, skills, and job preferences.",
  },
  {
    icon: Search,
    step: "02", 
    title: "Find Your Dream Job",
    desc: "Browse thousands of jobs or let our AI match you with the right roles.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Apply & Get Hired",
    desc: "Apply with 1-click and get updates directly from top companies in Nigeria.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-section">
      <div className="how-container">
        <div className="how-header">
          <h2>Get Hired in 3 Simple Steps</h2>
          <p>Your next career move is just a few clicks away</p>
        </div>

        <div className="how-steps">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="how-step">
              <div className="step-badge">{step}</div>
              <div className="step-icon">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}