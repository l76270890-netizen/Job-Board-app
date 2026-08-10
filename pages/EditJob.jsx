import React, { useState, useEffect } from "react";
import "./PostJobs.css";
import { ArrowLeft, Briefcase, MapPin, FileText, Plus, X, Building2, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // separate loading for save
  const [requirements, setRequirements] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [responsibilities, setResponsibilities] = useState([""]);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    category: "",
    jobType: "Full-time",
    workMode: "On-site",
    location: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
    description: "",
    deadline: ""
  });

  useEffect(() => {
    const fetchJob = async () => {
      if(!currentUser) return;
      const docRef = doc(db, "jobs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if(data.companyId!== currentUser.uid) return navigate('/employer/jobs'); // security
        setFormData({
         ...data,
          salaryMin: data.salaryMin || "",
          salaryMax: data.salaryMax || "",
          deadline: data.deadline || ""
        });
        setRequirements(data.requirements?.length? data.requirements : [""]);
        setBenefits(data.benefits?.length? data.benefits : [""]);
        setResponsibilities(data.responsibilities?.length? data.responsibilities : [""]);
      } else {
        alert("Job not found");
        navigate('/employer/jobs');
      }
      setLoading(false);
    };
    fetchJob();
  }, [id, currentUser, navigate]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (type, index, value) => {
    const setters = {req: setRequirements, ben: setBenefits, res: setResponsibilities};
    const arrs = {req: requirements, ben: benefits, res: responsibilities};
    const newArr = [...arrs[type]]; newArr[index] = value; setters[type](newArr);
  };

  const addField = (type) => {
    const setters = {req: setRequirements, ben: setBenefits, res: setResponsibilities};
    setters[type](prev => [...prev, ""]);
  };

  const removeField = (type, index) => {
    const setters = {req: setRequirements, ben: setBenefits, res: setResponsibilities};
    const arrs = {req: requirements, ben: benefits, res: responsibilities};
    if(arrs[type].length === 1) return; // keep at least 1 field
    setters[type](arrs[type].filter((_, i) => i!== index));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "jobs", id), {
       ...formData,
        salaryMin: Number(formData.salaryMin) || 0,
        salaryMax: Number(formData.salaryMax) || 0,
        requirements: requirements.filter(r => r.trim()),
        responsibilities: responsibilities.filter(r => r.trim()),
        benefits: benefits.filter(b => b.trim()),
        updatedAt: serverTimestamp()
      });
      alert("Job updated successfully!");
      navigate("/employer/jobs");
    } catch (error) {
      alert("Failed to update: " + error.message);
    }
    setSaving(false);
  };

  if (loading) return <p style={{textAlign: 'center', padding: '40px'}}>Loading job...</p>

  return (
    <div className="postjob-container">
      <div className="postjob-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1><Save size={24} style={{verticalAlign: 'middle'}}/> Edit Job</h1> {/* FIXED */}
        <p>Update the details below and save changes.</p> {/* FIXED */}
      </div>

      <form className="postjob-form" onSubmit={handleUpdate}> {/* FIXED */}
        {/* Section 1: Job Details */}
        <div className="form-section">
          <h2><Briefcase size={20}/> Job Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Job Title *</label>
              <input type="text" name="title" value={formData.title || ""} onChange={handleChange} placeholder="e.g. Frontend Developer" required />
            </div>

            <div className="form-group">
              <label><Building2 size={16} style={{verticalAlign: 'middle'}}/> Company Name *</label>
              <input type="text" name="companyName" value={formData.companyName || ""} onChange={handleChange} placeholder="e.g. TechCorp Ltd" required />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category || ""} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="IT">IT & Software</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div className="form-group">
              <label>Job Type *</label>
              <select name="jobType" value={formData.jobType || "Full-time"} onChange={handleChange}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label>Work Mode *</label>
              <select name="workMode" value={formData.workMode || "On-site"} onChange={handleChange}>
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Salary */}
        <div className="form-section">
          <h2><MapPin size={20}/> Location & Compensation</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Location *</label>
              <input type="text" name="location" value={formData.location || ""} onChange={handleChange} placeholder="e.g. Abuja, Nigeria" required />
            </div>
            <div className="form-group">
              <label>Experience</label>
              <input type="text" name="experience" value={formData.experience || ""} onChange={handleChange} placeholder="e.g. 2-4 Years" />
            </div>
            <div className="form-group">
              <label>Min Salary ₦</label>
              <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="100000" />
            </div>
            <div className="form-group">
              <label>Max Salary ₦</label>
              <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="300000" />
            </div>
          </div>
        </div>

        {/* Section 3: Description */}
        <div className="form-section">
          <h2><FileText size={20}/> Job Description</h2>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={formData.description || ""} onChange={handleChange} rows="6" placeholder="Describe the role, responsibilities..." required></textarea>
          </div>
        </div>

        {/* Section 4: Responsibilities */}
        <div className="form-section">
          <h2>Responsibilities</h2>
          {responsibilities.map((res, i) => (
            <div key={i} className="array-input">
              <input type="text" value={res} onChange={(e) => handleArrayChange('res', i, e.target.value)} placeholder="e.g. Teach mathematics to SS1-SS3 students" />
              <button type="button" onClick={() => removeField('res', i)}><X size={16}/></button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addField('res')}><Plus size={16}/> Add Responsibility</button>
        </div>

        {/* Section 5: Requirements */}
        <div className="form-section">
          <h2>Requirements</h2>
          {requirements.map((req, i) => (
            <div key={i} className="array-input">
              <input type="text" value={req} onChange={(e) => handleArrayChange('req', i, e.target.value)} placeholder="e.g. 3+ years React experience" />
              <button type="button" onClick={() => removeField('req', i)}><X size={16}/></button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addField('req')}><Plus size={16}/> Add Requirement</button>
        </div>

        {/* Section 6: Benefits */}
        <div className="form-section">
          <h2>Benefits</h2>
          {benefits.map((ben, i) => (
            <div key={i} className="array-input">
              <input type="text" value={ben} onChange={(e) => handleArrayChange('ben', i, e.target.value)} placeholder="e.g. Health Insurance" />
              <button type="button" onClick={() => removeField('ben', i)}><X size={16}/></button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addField('ben')}><Plus size={16}/> Add Benefit</button>
        </div>

        {/* Section 7: Deadline */}
        <div className="form-section">
          <h2>Application Deadline</h2>
          <div className="form-group">
            <label>Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/employer/jobs')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving? "Saving..." : "Save Changes"} {/* FIXED */}
          </button>
        </div>
      </form>
    </div>
  );
}
export default EditJob;
