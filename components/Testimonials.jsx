import "./Testimonials.css";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "I landed my dream job within three weeks of using this platform. The application process was simple and the job recommendations were spot on.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "UI/UX Designer",
    company: "Microsoft",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "The personalized recommendations saved me so much time. I received interview invitations from multiple companies.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Software Engineer",
    company: "Amazon",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "Beautiful interface, easy navigation, and thousands of quality job opportunities. Highly recommended for every job seeker.",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonial-heading">
        <span>💬 Testimonials</span>
        <h2>What Our Users Say</h2>
        <p>
          Thousands of professionals have found their dream jobs through our
          platform.
        </p>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <div className="testimonial-card" key={item.id}>
            <Quote className="quote-icon" />

            <div className="stars">
              {[...Array(item.rating)].map((_, index) => (
                <Star key={index} size={18} fill="#facc15" stroke="#facc15" />
              ))}
            </div>

            <p className="review">"{item.review}"</p>

            <div className="user">
              <img src={item.image} alt={item.name} />

              <div>
                <h4>{item.name}</h4>
                <span>
                  {item.role} • {item.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;