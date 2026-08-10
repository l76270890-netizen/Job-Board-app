import "./JobsPages.css";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock3,
  Filter,
  Bookmark,
} from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    salary: "$5k - $7k",
    type: "Full Time",
    posted: "2 days ago",
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Microsoft",
    location: "New York",
    salary: "$4k - $6k",
    type: "Full Time",
    posted: "Today",
    logo: "https://logo.clearbit.com/microsoft.com",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Netflix",
    location: "Remote",
    salary: "$6k - $9k",
    type: "Remote",
    posted: "1 day ago",
    logo: "https://logo.clearbit.com/netflix.com",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Amazon",
    location: "California",
    salary: "$8k - $10k",
    type: "Full Time",
    posted: "3 days ago",
    logo: "https://logo.clearbit.com/amazon.com",
  },
  {
    id: 5,
    title: "React Developer",
    company: "Spotify",
    location: "Remote",
    salary: "$5k - $8k",
    type: "Hybrid",
    posted: "Today",
    logo: "https://logo.clearbit.com/spotify.com",
  },
  {
    id: 6,
    title: "Software Engineer",
    company: "Apple",
    location: "Texas",
    salary: "$7k - $11k",
    type: "Full Time",
    posted: "4 days ago",
    logo: "https://logo.clearbit.com/apple.com",
  },
];

export default function AllJobs() {
  return (
    <div className="allJobs">

      <div className="jobsHeader">
        <h1>Find Your Dream Job</h1>

          <div className="searchWrapper">

          </div>

        <div className="searchBox">
          <div className="searchItem">
            <Search size={18} />
            <input placeholder="Job title..." />
          </div>

          <div className="searchItem">
            <MapPin size={18} />
            <input placeholder="Location" />
          </div>

          <button>Search</button>
          
        </div>
       
        
      </div>

      <div className="jobsContainer">

        <aside className="filters">

          <h3>
            <Filter size={18} />
            Filter
          </h3>

          <div className="filterGroup">
            <h4>Job Type</h4>

            <label><input type="checkbox" /> Full Time</label>
            <label><input type="checkbox" /> Part Time</label>
            <label><input type="checkbox" /> Remote</label>
            <label><input type="checkbox" /> Hybrid</label>
          </div>

          <div className="filterGroup">
            <h4>Experience</h4>

            <label><input type="checkbox" /> Entry Level</label>
            <label><input type="checkbox" /> Mid Level</label>
            <label><input type="checkbox" /> Senior</label>
          </div>

          <div className="filterGroup">
            <h4>Salary</h4>

            <input type="range" />
          </div>

        </aside>

        <section className="jobList">

          {jobs.map((job) => (

            <div className="jobCard" key={job.id}>

              <img src={job.logo} alt="" />

              <div className="jobContent">

                <div className="top">

                  <div>
                    <h2>{job.title}</h2>
                    <p>{job.company}</p>
                  </div>

                  <Bookmark />
                </div>

                <div className="jobInfo">

                  <span>
                    <MapPin size={16} />
                    {job.location}
                  </span>

                  <span>
                    <Briefcase size={16} />
                    {job.type}
                  </span>

                  <span>
                    <DollarSign size={16} />
                    {job.salary}
                  </span>

                  <span>
                    <Clock3 size={16} />
                    {job.posted}
                  </span>

                </div>

                <button>Apply Now</button>

              </div>

            </div>

          ))}

        </section>

      </div>

      <div className="pagination">

        <button>Previous</button>

        <button className="active">1</button>
        <button>2</button>
        <button>3</button>

        <button>Next</button>

      </div>

    </div>
  );
}