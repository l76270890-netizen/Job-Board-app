import { useState, useEffect } from "react"; // ADD useEffect
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Briefcase, UserCheck } from "lucide-react";
import { FaApple, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Auth.css";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("jobseeker");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithProvider, userData } = useAuth();

  const from = location.state?.from?.pathname || "/";

  // 1. AUTO REDIRECT WHEN userData LOADS
  useEffect(() => {
    if (userData) {
      if(userData.role === "employer") navigate("/employer/post-job", { replace: true });
      else navigate(from, { replace: true });
    }
  }, [userData, navigate, from]);

  useEffect(() => {
    const oauthError = new URLSearchParams(location.search).get("oauth_error");
    if (oauthError) setError(oauthError);
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password, role);
      // don't navigate here, useEffect will handle it
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider) => {
    setLoading(true);
    setError("");
    try {
      await loginWithProvider(provider, role);
    } catch (err) {
      setError(err.message || `Could not start ${provider} sign-in.`);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Sign in to continue</p>
        
        {error && <div className="auth-error">{error}</div>}

        <div className="role-toggle">
          <p>I am logging in as:</p>
          <div className="role-options">
            <label className={role === "jobseeker" ? "active" : ""}>
              <input 
                type="radio" 
                name="loginRole" 
                value="jobseeker" 
                checked={role === "jobseeker"} 
                onChange={e => setRole(e.target.value)} 
              />
              <UserCheck size={16} /> Job Seeker
            </label>
            <label className={role === "employer" ? "active" : ""}>
              <input 
                type="radio" 
                name="loginRole" 
                value="employer" 
                checked={role === "employer"} 
                onChange={e => setRole(e.target.value)} 
              />
              <Briefcase size={16} /> Employer
            </label>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input 
              type={showPass? "text" : "password"} 
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider">or continue with</div>
        <div className="social-login">
          <button type="button" className="social-btn google" onClick={() => handleProviderLogin("google")} disabled={loading}>
            <FcGoogle size={20} aria-hidden="true" /> Continue with Google
          </button>
          <button type="button" className="social-btn apple" onClick={() => handleProviderLogin("apple")} disabled={loading}>
            <FaApple size={20} aria-hidden="true" /> Continue with Apple
          </button>
          <button type="button" className="social-btn github" onClick={() => handleProviderLogin("github")} disabled={loading}>
            <FaGithub size={20} aria-hidden="true" /> Continue with GitHub
          </button>
        </div>

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}




































