import React, { useState, useMemo, useEffect } from 'react';
import './CompanyDetail.css';
import { ArrowLeft, MapPin, Briefcase, Users, Building2, CheckCircle, Share2, Filter, ExternalLink, Bookmark, Plus, Star, ShieldCheck } from "lucide-react"; // added Star, ShieldCheck
import { useNavigate, useParams } from "react-router-dom";
import { jobs as staticJobs } from "./AllJobs";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, increment, setDoc, deleteDoc, getDoc, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"; // added review imports
import { useAuth } from '../context/AuthContext';

const baseCompanies = [ 
  {
    name: "GIZ KE", banner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200",
    employees: "1000-5000", about: "GIZ is a German development agency working worldwide...",
    benefits: ["Health Insurance", "Remote Friendly", "Training Budget", "Paid Leave"],
    links: { linkedin: "#", facebook: "#", instagram: "#", website: "#" }
  },
  {
    name: "Google", banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
    employees: "100000+", about: "Google's mission is to organize the world's information...",
    benefits: ["Free Meals", "Gym", "Stock Options", "20% Time"],
    links: { linkedin: "#", facebook: "#", instagram: "#", website: "#" }
  },
];

const CompanyLogo = ({ logo, name }) => (
  <img src={logo} alt={name} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22C55E&color=fff`}} />
);

const StarRating = ({ rating }) => ( // NEW
  <div className="stars">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={16} fill={i < Math.round(rating)? "#f59e0b" : "none"} color="#f59e0b" />
    ))}
  </div>
);

function CompanyDetail(){
  const navigate = useNavigate();
  const { companyName } = useParams();
  const { currentUser, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [firestoreJobs, setFirestoreJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobFilters, setJobFilters] = useState({ location: '', type: '' });
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviews, setReviews] = useState([]); // NEW
  const [showReviewForm, setShowReviewForm] = useState(false); // NEW
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', pros: '', cons: '' }); // NEW
  const decodedName = decodeURIComponent(companyName);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const jobs = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
      setFirestoreJobs(jobs);
      setLoading(false);
    };
    fetchJobs();
    incrementProfileView();
    checkIfFollowing();
    
    // NEW: LIVE FETCH REVIEWS
    const q = query(collection(db, "reviews"), where("companyName", "==", decodedName));
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id,...d.data() })));
    });
    return () => unsub();
  }, [decodedName, currentUser]);

  const allJobs = useMemo(() => [...staticJobs,...firestoreJobs], [firestoreJobs]);

  const incrementProfileView = async () => {
    const companyDoc = allJobs.find(j => String(j.company || j.companyName).toLowerCase() === decodedName.toLowerCase());
    if(companyDoc?.employerId) {
      await updateDoc(doc(db, 'users', companyDoc.employerId), {
        profileViews: increment(1)
      }).catch(()=>{});
    }
  }

  const checkIfFollowing = async () => {
    if(!currentUser) return;
    const snap = await getDoc(doc(db, 'users', currentUser.uid, 'following', decodedName));
    setIsFollowing(snap.exists());
  }
  const handleFollow = async () => {
    if(!currentUser) return navigate('/login');
    const ref = doc(db, 'users', currentUser.uid, 'following', decodedName);
    if(isFollowing) {
      await deleteDoc(ref);
      setIsFollowing(false);
    } else {
      await setDoc(ref, { companyName: decodedName, followedAt: new Date() });
      setIsFollowing(true);
    }
  }

  // NEW: SUBMIT REVIEW
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return navigate('/login');

    await addDoc(collection(db, "reviews"), {
     ...reviewForm,
      companyName: decodedName,
      employerId: companyData?.employerId,
      userId: currentUser.uid,
      userName: userData.name,
      isVerified: true,
      createdAt: serverTimestamp()
    });
    setShowReviewForm(false);
    setReviewForm({ rating: 5, title: '', pros: '', cons: '' });
    alert("Review submitted. Thank you!");
  }

  const companyData = useMemo(() => {
    const companyJobs = allJobs.filter(j => String(j.company || j.companyName).toLowerCase() === decodedName.toLowerCase());
    if(companyJobs.length === 0) return null;

    const firstJob = companyJobs[0];
    const baseInfo = baseCompanies.find(c => c.name.toLowerCase() === decodedName.toLowerCase());
    const allBenefits = [...new Set(companyJobs.flatMap(j => j.benefits || []))];

    const avgRating = reviews.length > 0 // NEW
     ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return {
      name: firstJob.company || firstJob.companyName,
      logo: firstJob.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstJob.company || firstJob.companyName)}&background=22C55E&color=fff`,
      location: firstJob.location,
      industry: firstJob.category || firstJob.industry,
      banner: baseInfo?.banner || firstJob.companyBanner || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
      employees: baseInfo?.employees || firstJob.companySize || "51-200",
      about: baseInfo?.about || firstJob.companyDescription || `${firstJob.company || firstJob.companyName} is hiring in ${firstJob.category}. Join our team and grow your career.`,
      benefits: baseInfo?.benefits?.length > 0 ? baseInfo.benefits : allBenefits.length > 0 ? allBenefits : ["Health Insurance", "Flexible Hours", "Career Growth"],
      links: baseInfo?.links || { website: firstJob.companyWebsite || "#", linkedin: "#", facebook: "#", instagram: "#" },
      website: firstJob.companyWebsite || "#",
      verified: firstJob.verified || false,
      jobCount: companyJobs.length,
      employerId: firstJob.employerId,
      avgRating, // NEW
      reviewCount: reviews.length // NEW
    }
  }, [decodedName, allJobs, reviews]);

  if (loading) return <div className="company-page"><div className="container"><h2>Loading company...</h2></div></div>
  if (!companyData) {
    return <div className="company-page"><button className="detailBack" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button><div className="container"><h2>Company not found</h2></div></div>
  }

  const companyJobs = allJobs.filter(job => String(job.company || job.companyName).toLowerCase() === companyData.name.toLowerCase() && job.status !== 'closed');
  const relatedJobs = allJobs.filter(j => String(j.company || j.companyName)!== companyData.name && (j.category || j.industry) === companyData.industry && j.status !== 'closed').filter(j => jobFilters.location === '' || j.location.toLowerCase().includes(jobFilters.location.toLowerCase())).filter(j => jobFilters.type === '' || (j.type || j.jobType) === jobFilters.type).slice(0,6);
  const allCompanies = Array.from(new Map(allJobs.map(j => [j.company || j.companyName, j])).values());
  const relatedCompanies = allCompanies.filter(c => (c.category || c.industry) === companyData.industry && (c.company || c.companyName)!== companyData.name).slice(0,4).map(c => ({ name: c.company || c.companyName, logo: c.logo, industry: c.category || c.industry }));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Company link copied!");
  }

  return (
    <div className="company-page-fuzu">
      <button className="detailBack" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>

      <div className="company-banner">
        <img src={companyData.banner} alt="banner" />
        <div className="company-logo-badge">
          <CompanyLogo logo={companyData.logo} name={companyData.name} />
          {companyData.verified && <span className="verified-badge"><CheckCircle size={18} /> Verified</span>}
        </div>
      </div>

      <div className="container">
        <div className="company-header-info">
          <div className="header-top-row">
            <div>
              <h1 className="company-name">{companyData.name}</h1>
              {/* NEW: SHOW RATING IN HEADER */}
              {companyData.reviewCount > 0 && (
                <div className="header-rating">
                  <StarRating rating={companyData.avgRating} />
                  <span>{companyData.avgRating} ({companyData.reviewCount} reviews)</span>
                </div>
              )}
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className={`follow-btn ${isFollowing? 'following' : ''}`} onClick={handleFollow}>
                {isFollowing? 'Following' : <><Plus size={16}/> Follow</>}
              </button>
              <button className="share-btn" onClick={handleShare}><Share2 size={16} /> Share</button>
            </div>
          </div>
          <div className="company-meta">
            <span><Briefcase size={14}/> {companyData.industry}</span>
            <span><MapPin size={14}/> {companyData.location}</span>
            <span><Users size={14}/> {companyData.employees} employees</span>
          </div>
          {companyData.website !== "#" && <a href={companyData.website} target="_blank" className="company-website-link"><ExternalLink size={14} /> Visit Website</a>}
          <div className="company-stats">
            <div><strong>{companyData.jobCount}</strong><span>Open Jobs</span></div>
            <div><strong>{companyData.employees}</strong><span>Employees</span></div>
            <div><strong>{companyData.avgRating || 'N/A'}</strong><span>Rating</span></div> {/* UPDATED */}
          </div>
          <button className="view-jobs-main-btn" onClick={() => setActiveTab('jobs')}>View Jobs ({companyData.jobCount})</button>
        </div>

        <div className="company-tabs">
          <button className={activeTab === 'overview'? 'tab active' : 'tab'} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'jobs'? 'tab active' : 'tab'} onClick={() => setActiveTab('jobs')}>Jobs ({companyData.jobCount})</button>
          <button className={activeTab === 'culture'? 'tab active' : 'tab'} onClick={() => setActiveTab('culture')}>Culture & Benefits</button>
          <button className={activeTab === 'reviews'? 'tab active' : 'tab'} onClick={() => setActiveTab('reviews')}>Reviews ({companyData.reviewCount})</button> {/* NEW TAB */}
        </div>

        {activeTab === 'overview' && (
          <div className="OverView">
            <div className="about-card">
              <h3>About {companyData.name}</h3>
              <p>{companyData.about}</p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <div className="jobs-header"><h3>Open Jobs at {companyData.name}</h3></div>
            {companyJobs.length === 0? (<p style={{color: '#6b7280'}}>No open jobs at {companyData.name} right now.</p>) : (
              <div className="jobs-grid">{companyJobs.map(job => (<div className="job-card clickable" key={job.id} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}><div className="job-info"><h4>{job.title}</h4><p><MapPin size={14}/> {job.location} • <span className="job-tag">{job.type || job.jobType}</span></p><p className="salary"><strong>₦{Number(job.salary || job.salaryMax || 0).toLocaleString()}/mo</strong></p></div><button className="btn">View Job</button></div>))}</div>
            )}
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="culture-section">
            <div className="about-card">
              <h3>Life & Benefits at {companyData.name}</h3>
              <div className="benefits-list">{companyData.benefits.map(b => (<div key={b} className="benefit-item"><CheckCircle size={16} color="#22c55e"/>{b}</div>))}</div>
            </div>
          </div>
        )}

        {/* NEW: REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <div className="reviews-header">
              <div>
                <h3>Company Reviews</h3>
                <div className="avg-rating">
                  <strong>{companyData.avgRating || 0}</strong>
                  <StarRating rating={companyData.avgRating} />
                  <span>{companyData.reviewCount} reviews</span>
                </div>
              </div>
              <button className="review-btn" onClick={() => setShowReviewForm(true)}>Write a Review</button>
            </div>

            {showReviewForm && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <h4>Rate your experience at {companyData.name}</h4>
                <label>Overall Rating
                  <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </label>
                <input placeholder="Review Title" value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})} required/>
                <textarea placeholder="Pros" value={reviewForm.pros} onChange={e => setReviewForm({...reviewForm, pros: e.target.value})} required/>
                <textarea placeholder="Cons" value={reviewForm.cons} onChange={e => setReviewForm({...reviewForm, cons: e.target.value})} required/>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button type="submit">Submit Review</button>
                  <button type="button" className="cancel" onClick={() => setShowReviewForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="reviews-list">
              {reviews.length === 0? <p>No reviews yet. Be the first!</p> :
                reviews.sort((a,b) => b.createdAt?.seconds - a.createdAt?.seconds).map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-top">
                      <div><h4>{review.title}</h4><StarRating rating={review.rating} /></div>
                      {review.isVerified && <span className="verified-tag"><ShieldCheck size={14} /> Verified</span>}
                    </div>
                    <p><strong>Pros:</strong> {review.pros}</p>
                    <p><strong>Cons:</strong> {review.cons}</p>
                    <div className="review-footer">
                      <span>{review.userName}</span>
                      <span>{review.createdAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        <hr />
        <div className='Related-jobs'>
          <div className="related-header"><h2>Related Jobs in {companyData.industry}</h2>
            <div className="job-filters"><Filter size={16} />
              <select value={jobFilters.location} onChange={(e) => setJobFilters({...jobFilters, location: e.target.value})}>
                <option value="">All Locations</option><option value="Abuja">Abuja</option><option value="Lagos">Lagos</option><option value="Remote">Remote</option>
              </select>
              <select value={jobFilters.type} onChange={(e) => setJobFilters({...jobFilters, type: e.target.value})}>
                <option value="">All Types</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          <div className="jobs-grid">{relatedJobs.length > 0 ? relatedJobs.map(job => (<div className="job-card clickable" key={job.id + 100} onClick={() => navigate(`/jobs/${job.id}`, { state: job })}><div className="job-info"><h4>{job.title}</h4><p className="company-name-small">{job.company || job.companyName}</p><p><MapPin size={14}/> {job.location} • <span className="job-tag">{job.type || job.jobType}</span></p></div><button className="btn">View Job</button></div>)) : <p>No related jobs found</p>}</div>
        </div>
        <hr />

        {relatedCompanies.length > 0 && (<><div className='Related-jobs'><h2>Similar Companies</h2><div className="jobs-grid">{relatedCompanies.map(comp => (<div className="company-mini-card" key={comp.name} onClick={() => navigate(`/company/${encodeURIComponent(comp.name)}`)}><img src={comp.logo} alt={comp.name} onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name)}&background=22C55E&color=fff`} /><h4>{comp.name}</h4><p>{comp.industry}</p></div>))}</div></div><hr /></>)}
      </div>
    </div>
  );
};

export default CompanyDetail;