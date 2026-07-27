import { Briefcase, Building2, Users, CheckCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import "./StatsSection.css";

const stats = [
  {
    icon: Briefcase,
    target: 50000,
    suffix: "+",
    label: "Jobs Posted",
  },
  {
    icon: Building2,
    target: 10000,
    suffix: "+",
    label: "Companies Hiring",
  },
  {
    icon: Users,
    target: 200000,
    suffix: "+",
    label: "Job Seekers",
  },
  {
    icon: CheckCircle,
    target: 85,
    suffix: "%",
    label: "Hiring Success Rate",
  },
];

// Custom hook for counting animation
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting &&!started.current) {
          started.current = true;
          let startTime = null;

          const animate = (time) => {
            if (startTime === null) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 } // start when 50% visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

// Helper to format 200000 -> 200,000
const formatNumber = (num) => num.toLocaleString();

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map(({ icon: Icon, target, suffix, label }) => {
          const [count, ref] = useCountUp(target);
          return (
            <div key={label} className="stat-card" ref={ref}>
              <div className="stat-icon">
                <Icon size={28} />
              </div>
              <h3 className="stat-number">
                {formatNumber(count)}{suffix}
              </h3>
              <p className="stat-label">{label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}