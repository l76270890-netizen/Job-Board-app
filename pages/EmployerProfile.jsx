import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import './EmployerProfile.css';
import { Building2, Upload, Globe, Users, Save, X, Plus, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

function EmployerProfile() {
   const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    description: '',
    website: '',
    industry: '',
    companySize: '',
    location: '',
    logo: '',
    banner: '',
    benefits: [],
    socials: { linkedin: '', facebook: '', instagram: '', twitter: '' }
  });

  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      const docRef = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          companyName: data.companyName || '',
          description: data.companyDescription || '',
          website: data.companyWebsite || '',
          industry: data.industry || '',
          companySize: data.companySize || '',
          location: data.location || '',
          logo: data.companyLogo || '',
          banner: data.companyBanner || '',
          benefits: data.companyBenefits || [],
          socials: data.companySocials || { linkedin: '', facebook: '', instagram: '', twitter: '' }
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setForm({...form, socials: {...form.socials, [e.target.name]: e.target.value } });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({...form, [type]: reader.result }); // base64 for now. Use cloudinary/firebase storage later
    };
    reader.readAsDataURL(file);
  };

  const addBenefit = () => {
    if (newBenefit.trim() &&!form.benefits.includes(newBenefit.trim())) {
      setForm({...form, benefits: [...form.benefits, newBenefit.trim()] });
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefit) => {
    setForm({...form, benefits: form.benefits.filter(b => b!== benefit) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        companyName: form.companyName,
        companyDescription: form.description,
        companyWebsite: form.website,
        industry: form.industry,
        companySize: form.companySize,
        location: form.location,
        companyLogo: form.logo,
        companyBanner: form.banner,
        companyBenefits: form.benefits,
        companySocials: form.socials
      });
      alert('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    }
    setSaving(false);
  };

  if (loading) return <div className="profile-container"><h2>Loading...</h2></div>;

  return (
    <div className="profile-container">
       <button className="detailBackBtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
      <div className="profile-header">
        <h1><Building2 /> Company Profile</h1>
        {!editing? (
          <button className="btn-edit" onClick={() => setEditing(true)}>Edit Profile</button>
        ) : (
          <div className="btn-group">
            <button className="btn-cancel" onClick={() => setEditing(false)}><X size={16} /> Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={saving}><Save size={16} /> {saving? 'Saving...' : 'Save'}</button>
          </div>
        )}
      </div>

      <div className="profile-banner">
        <img src={form.banner || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'} alt="banner" />
        {editing && (
          <label className="upload-btn">
            <Upload size={16} /> Change Banner
            <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'banner')} />
          </label>
        )}
      </div>

      <div className="profile-body">
        <div className="profile-logo-section">
          <div className="profile-logo">
            <img src={form.logo || `https://ui-avatars.com/api/?name=${form.companyName}&background=22C55E&color=fff`} alt="logo" />
            {editing && (
              <label className="upload-btn-small">
                <Upload size={14} />
                <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'logo')} />
              </label>
            )}
          </div>
          <div className="profile-title">
            <h2>{form.companyName || 'Your Company Name'}</h2>
            <p><CheckCircle size={14} color="#22c55e" /> Verified Employer</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* Left Column */}
          <div className="profile-card">
            <h3>About Company</h3>
            {!editing? <p>{form.description || 'No description yet'}</p> :
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Tell us about your company" rows={5} />
            }
          </div>

          <div className="profile-card">
            <h3>Company Info</h3>
            <div className="info-item"><Users size={16} />
              {!editing? <span>{form.companySize || 'Not set'} employees</span> :
              <select name="companySize" value={form.companySize} onChange={handleChange}>
                <option value="">Company Size</option>
                <option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option>
              </select>}
            </div>
            <div className="info-item"><Building2 size={16} />
              {!editing? <span>{form.industry || 'Not set'}</span> :
              <input name="industry" value={form.industry} onChange={handleChange} placeholder="Industry" />}
            </div>
            <div className="info-item"><Globe size={16} />
              {!editing? <a href={form.website} target="_blank">{form.website || 'No website'}</a> :
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://website.com" />}
            </div>
          </div>

          {/* Benefits */}
          <div className="profile-card">
            <h3>Benefits & Perks</h3>
            <div className="benefits-list">
              {form.benefits.map(b => (
                <div key={b} className="benefit-tag">
                  {b} {editing && <Trash2 size={14} onClick={() => removeBenefit(b)} />}
                </div>
              ))}
            </div>
            {editing && (
              <div className="add-benefit">
                <input value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} placeholder="Add benefit" />
                <button onClick={addBenefit}><Plus size={16} /></button>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="profile-card">
            <h3>Social Links</h3>
            {!editing? (
              <div className="socials">
                {Object.entries(form.socials).map(([key, val]) => val && <a key={key} href={val} target="_blank">{key}</a>)}
              </div>
            ) : (
              <div className="social-inputs">
                <input name="linkedin" value={form.socials.linkedin} onChange={handleSocialChange} placeholder="LinkedIn URL" />
                <input name="facebook" value={form.socials.facebook} onChange={handleSocialChange} placeholder="Facebook URL" />
                <input name="instagram" value={form.socials.instagram} onChange={handleSocialChange} placeholder="Instagram URL" />
                <input name="twitter" value={form.socials.twitter} onChange={handleSocialChange} placeholder="Twitter URL" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerProfile;
