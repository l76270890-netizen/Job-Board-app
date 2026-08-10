import "./Testimonials.css";
import { Star, Quote } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 1. ADD

const jobseekerTestimonials = [ // 2. RENAME YOURS
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

// 3. NEW: EMPLOYER TESTIMONIALS
const employerTestimonials = [
  {
    id: 1,
    name: "Tunde Adeleke",
    role: "HR Manager",
    company: "Paystack",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    review:
      "We hired 4 developers in 30 days. The quality of applicants here is way better than LinkedIn and Jobberman combined.",
    rating: 5,
  },
  {
    id: 2,
    name: "Grace Okoro",
    role: "Founder",
    company: "Kuda Bank",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    review:
      "Posting a job took 2 minutes. We got 200+ qualified applications in the first week. The dashboard analytics are amazing.",
    rating: 5,
  },
  {
    id: 3,
    name: "Chidi Nwosu",
    role: "CTO",
    company: "Flutterwave",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    review:
      "Finally a platform that understands African hiring. Fast, affordable, and the candidates are actually qualified.",
    rating: 5,
  },
];

function Testimonials() {
  const { userData } = useAuth(); // 4. ADD
  const isEmployer = userData?.role === 'employer'; // 5. ADD
  
  const testimonials = isEmployer ? employerTestimonials : jobseekerTestimonials; // 6. ADD

  return (
    <section className={`testimonials ${isEmployer ? 'employer-testimonials' : ''}`}> {/* 7. ADD CLASS */}
      <div className="testimonial-heading">
        <span>💬 Testimonials</span>
        <h2>{isEmployer ? 'What Companies Are Saying' : 'What Our Users Say'}</h2> {/* 8. DYNAMIC TITLE */}
        <p>
          {isEmployer 
            ? '500+ companies are hiring top talent faster with JobConnect' 
            : 'Thousands of professionals have found their dream jobs through our platform.'}
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