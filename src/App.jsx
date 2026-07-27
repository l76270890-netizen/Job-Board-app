import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 1. IMPORT
import ProtectedRoute from "./components/ProtectedRoute"; // 2. IMPORT

import Home from "./pages/Home";
import AllJobs from "./pages/AllJobs";
import JobDetail from "./pages/JobDetail";
import CompaniesPages from "./pages/CompaniesPages";
import CompanyDetail from "./pages/CompanyDetail";
import SettingPage from "./pages/SettingPage";
import ArticleDetail from "./pages/ArticleDetail";
import ArticlePage from "./pages/ArticlePage";
import SavedJobs from "./pages/SavedJobs";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <AuthProvider> {/* 3. WRAP EVERYTHING */}
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/articles" element={<ArticlePage />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/companies" element={<CompaniesPages />} />
          <Route path="/company/:companyName" element={<CompanyDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected - Must Login */}
          <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
          <Route path="/message" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;