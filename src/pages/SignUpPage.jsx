import { useState, useEffect } from "react"; // ADD useEffect
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { Mail, Lock, User, Eye, EyeOff, Briefcase, UserCheck } from "lucide-react";
import "./Auth.css";

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => ({ name: "", email: "", password: "", role: searchParams.get("role") === "employer" ? "employer" : "jobseeker" }));
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, userData } = useAuth();

  // AUTO REDIRECT AFTER SIGNUP
  useEffect(() => {
    if (userData) {
      if(userData.role === "employer") navigate("/employer/post-job", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [userData, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(form.email, form.password, form.name, form.role); 
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join and find your dream job</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <User size={18} />
            <input 
              type="text" 
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
          </div>

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

          <div className="role-toggle">
            <p>I am a:</p>
            <div className="role-options">
              <label className={form.role === "jobseeker" ? "active" : ""}>
                <input 
                  type="radio" 
                  name="role" 
                  value="jobseeker" 
                  checked={form.role === "jobseeker"} 
                  onChange={e => setForm({...form, role: e.target.value})} 
                />
                <UserCheck size={16} /> Job Seeker
              </label>
              <label className={form.role === "employer" ? "active" : ""}>
                <input 
                  type="radio" 
                  name="role" 
                  value="employer" 
                  checked={form.role === "employer"} 
                  onChange={e => setForm({...form, role: e.target.value})} 
                />
                <Briefcase size={16} /> Employer
              </label>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
