import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // use context
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import "./Auth.css";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth(); // get from context

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(form.email, form.password, form.name);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSocialSignup = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="divider">or sign up with</div>

        <div className="social-login">
          <button className="social-btn google" onClick={handleSocialSignup}>
            <FcGoogle size={20} /> Continue with Google
          </button>
          <button className="social-btn apple" onClick={() => alert("Enable Apple in Firebase first")}>
            <FaApple size={20} /> Continue with Apple
          </button>
          <button className="social-btn facebook" onClick={() => alert("Enable Facebook in Firebase first")}>
            <FaFacebook size={20} /> Continue with Facebook
          </button>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}