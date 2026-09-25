import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 1. ALREADY IMPORTED
import ProtectedRoute from "./components/ProtectedRoute"; 

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
import EditJob from "./pages/EditJob";
import EmployerProfile from "./pages/EmployerProfile";

// 1. IMPORT EMPLOYER PAGES
import PostJobs from "./pages/PostJobs";
import ManageJobs from "./pages/ManageJobs";
import ApplicantsPage from "./pages/ApplicantsPage";
import CompanyJobsPage from "./pages/CompanyJobsPage";
import MyApplications from "./pages/MyApplications";

function NotFound() {
  return <main style={{ minHeight: "55vh", display: "grid", placeItems: "center", padding: "48px 20px", textAlign: "center" }}>
    <div><p style={{ color: "#16a34a", fontWeight: 700, marginBottom: 8 }}>404</p><h1 style={{ color: "#0f172a", marginBottom: 10 }}>Page not found</h1><p style={{ color: "#64748b", marginBottom: 22 }}>The page may have moved or the link may be incorrect.</p><Link to="/" style={{ color: "#fff", background: "#16a34a", padding: "11px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Back to home</Link></div>
  </main>;
}

function App() {
  return (
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ // 2. ADD THIS HERE. This enables the popups
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }} />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          <Route path="/articles" element={<ArticlePage />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/companies" element={<CompaniesPages />} />
          <Route path="/company/:companyName" element={<CompanyDetail />} />
          <Route path="/company/:companyName/jobs" element={<CompanyJobsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/employer/profile" element={<ProtectedRoute roles={["employer"]}><EmployerProfile /></ProtectedRoute>} />

          {/* Protected - Must Login */}
          <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute roles={["jobseeker"]}><MyApplications /></ProtectedRoute>} />
          <Route path="/message" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

          {/* 2. EMPLOYER ROUTES - Protected */}
          <Route 
            path="/employer/post-job"
            element={<ProtectedRoute roles={["employer"]}><PostJobs /></ProtectedRoute>} 
          />
          <Route 
            path="/employer/jobs" 
            element={<ProtectedRoute roles={["employer"]}><ManageJobs /></ProtectedRoute>} 
          />
        
          <Route path="/employer/edit-job/:id" element={<ProtectedRoute roles={["employer"]}><EditJob /></ProtectedRoute>} />

          <Route 
            path="/employer/applicants/:jobId" 
            element={<ProtectedRoute roles={["employer"]}><ApplicantsPage /></ProtectedRoute>} 
          />
          
         <Route path="/messages/:chatId?" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
         <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;
