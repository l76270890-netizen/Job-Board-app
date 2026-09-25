import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, apiUrl } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api("/api/auth/me")
      .then((user) => { if (active) setCurrentUser(user); })
      .catch(() => { if (active) setCurrentUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const signup = async (email, password, name, role = "jobseeker") => {
    const user = await api("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password, name, role }) });
    setCurrentUser(user);
    return { user };
  };

  const login = async (email, password, selectedRole) => {
    const user = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (selectedRole && selectedRole !== user.role) {
      await api("/api/auth/logout", { method: "POST" });
      throw new Error(`This account is registered as a ${user.role}. Choose the matching account type.`);
    }
    setCurrentUser(user);
    return { user };
  };

  const loginWithProvider = async (provider, role = "jobseeker") => {
    const { authorizationUrl } = await api(`/api/auth/oauth/${provider}/start?role=${encodeURIComponent(role)}`);
    window.location.assign(authorizationUrl);
  };

  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      return true;
    } catch {
      // A failed API request must not leave the UI stuck in an authenticated
      // state. The caller can warn that server-side revocation was not confirmed.
      setCurrentUser(null);
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const user = await api("/api/auth/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) });
    setCurrentUser(user);
  };

  const updateUserProfile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const uploaded = await api("/api/users/me/upload", { method: "POST", body: formData });
    const photoURL = apiUrl(uploaded.url);
    const updated = await api("/api/users/me", { method: "PATCH", body: JSON.stringify({ profile: { photoURL } }) });
    setCurrentUser(updated);
    return updated;
  };

  const userData = currentUser;
  const value = useMemo(() => ({ currentUser, userData, loading, signup, login, loginWithProvider, logout, changePassword, updateUserProfile }), [currentUser, loading]);
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
