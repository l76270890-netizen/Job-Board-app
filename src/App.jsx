import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
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

function App() {
  return (
    <AuthProvider>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/employer/profile" element={<EmployerProfile />} />

          {/* Protected - Must Login */}
          <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
          <Route path="/message" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

          {/* 2. EMPLOYER ROUTES - Protected */}
          <Route 
            path="/employer/post-job"
            element={<ProtectedRoute><PostJobs /></ProtectedRoute>} 
          />
          <Route 
            path="/employer/jobs" 
            element={<ProtectedRoute><ManageJobs /></ProtectedRoute>} 
          />
        
          <Route path="/employer/edit-job/:id" element={<EditJob />} />

          <Route 
            path="/employer/applicants/:jobId" 
            element={<ProtectedRoute><ApplicantsPage /></ProtectedRoute>} 
          />
          
         <Route path="/messages/:chatId?" element={<MessagesPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;