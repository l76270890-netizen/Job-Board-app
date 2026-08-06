import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedJobs from "../components/FeaturedJobs";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsSection from "../components/StatsSection"
import HowItWorks from "../components/HowItWorks"
import FinalCTA from "../components/FinalCTA.jsx"
import CompaniesHiring from "../components/CompaniesHiring";
import ArticleCard from "../components/ArticleCard";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext"; // 1. ADD

function Home() {
  const { userData } = useAuth(); // 2. ADD
  const isEmployer = userData?.role === 'employer'; // 3. ADD

  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedJobs />
      
      {!isEmployer && <Categories />} {/* 4. HIDE FOR EMPLOYERS */}

      <CompaniesHiring />
      <WhyChooseUs />
      <StatsSection />      
      {!isEmployer && <HowItWorks />} {/* 5. HIDE FOR EMPLOYERS */}
      
      <Testimonials />
      {!isEmployer && <ArticleCard />} {/* 6. HIDE FOR EMPLOYERS */}
      
      <FinalCTA />
      <Footer />
    </>
  );
}

export default Home;