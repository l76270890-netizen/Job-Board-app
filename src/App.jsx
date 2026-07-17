import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AllJobs from "./pages/AllJobs";
import JobDetail from "./pages/JobDetail";
import CompaniesPages from "./pages/CompaniesPages";
import CompanyDetail from "./pages/CompanyDetail";
import SettingPage from "./pages/SettingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Jobs */}
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Companies */}
        <Route path="/companies" element={<CompaniesPages />} />
        <Route
          path="/company/:companyName"
          element={<CompanyDetail />}
        />

        {/* Settings */}
        <Route path="/settings" element={<SettingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;