import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedJobs from "../components/FeaturedJobs";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsSection from "../components/StatsSection"
import HowItWorks from "../components/HowItWorks"
import NewsLetter from "../components/NewsLetter"
import CompaniesHiring from "../components/CompaniesHiring";
import ArticleCard from "../components/ArticleCard";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
       <Navbar />
      <Hero />
      <FeaturedJobs />
      <Categories />
      <CompaniesHiring />
      <WhyChooseUs />
      <StatsSection />      {/* ADD HERE */}
      <HowItWorks />        {/* ADD HERE */}
      <Testimonials />
      <ArticleCard />
      <NewsLetter />
      <Footer />
    </>
  );
}

export default Home;