import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";
import summaryIcon from "../assets/summary.png";
import scanIcon from "../assets/scan.png";
import adviceIcon from "../assets/advice.png";
import searchIcon from "../assets/search.png";

export default function LandingPage() {
  const [user, setUser] = useState(null);

  // 🔥 check session on mount
  useEffect(() => {
  fetch("http://localhost:8000/auth/me", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      console.log("ACTUAL DATA:", data);
      setUser(data.user);
    });
}, []);

  return (
    <>
      {user ? (
        <div className="welcome-message">Welcome: {user.username}!</div>
      ) : (
        <div className="welcome-message">Welcome: Anonymous Boba Enthusiast!</div>
      )}
      <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Change your life in the <br />
            <span className="accent-text">next 67 days.</span>
          </h1>
          <p className="hero-subtitle">
            Identify food instantly, track your nutrition habits, and get AI-driven advice to reach your goals.
          </p>
          <Link to="/capture" className="cta-button">
            Start Scanning
          </Link>
        </div>
        <div className="hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800" 
            alt="Healthy Food" 
            className="hero-image"
          />
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="features-grid">
        <FeatureBlock 
          link="/dashboard" 
          icon={<img src={summaryIcon} alt="Summary" className="feature-icon" />} 
          title="Summary" 
          desc="View your daily nutrition progress." 
          className="card-summary" 
        />

        <FeatureBlock 
          link="/capture" 
          icon={<img src={scanIcon} alt="Scan Food" className="feature-icon" />} 
          title="Scan Food" 
          desc="AI photo recognition." 
          className="card-scan" 
        />

        <FeatureBlock 
          link="/advice" 
          icon={<img src={adviceIcon} alt="AI Advice" className="feature-icon" />} 
          title="AI Advice" 
          desc="Personalized health tips." 
          className="card-advice" 
        />

        <FeatureBlock 
          link="/manual" 
          icon={<img src={searchIcon} alt="Search Food" className="feature-icon" />} 
          title="Search Food" 
          desc="Search for food calories" 
          className="card-manual" 
        />
      </section>
      </div>
    </>
  );
}

function FeatureBlock({ link, icon, title, desc, className }) {
  return (
    <Link to={link} className={`feature-card ${className}`}>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
      <div className="feature-footer">{`</${title.toLowerCase().replace(/\s/g, '')}>`}</div>
    </Link>
  );
}