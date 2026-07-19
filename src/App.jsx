import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AllJobs from "./pages/AllJobs";
import JobDetail from "./pages/JobDetail";
import CompaniesPages from "./pages/CompaniesPages";
import CompanyDetail from "./pages/CompanyDetail";
import SettingPage from "./pages/SettingPage";
import ArticleDetail from "./pages/ArticleDetail";
import ArticleCard from "./components/ArticleCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Jobs - FIXED */}
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Articles - FIXED */}
        <Route path="/articles" element={<ArticleCard />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />

        {/* Companies */}
        <Route path="/companies" element={<CompaniesPages />} />
        <Route path="/company/:companyName" element={<CompanyDetail />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;