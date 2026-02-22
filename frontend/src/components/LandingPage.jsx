import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";
import summaryIcon from "../assets/summary.png";
import scanIcon from "../assets/scan.png";
import adviceIcon from "../assets/advice.png";
import searchIcon from "../assets/search.png";
import goalsIcon from "../assets/target.png";
import achievementsIcon from "../assets/badge.png";


export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
      });
  }, []);

  // Change your fetch to handle the data better
  useEffect(() => {
    fetch("http://localhost:8000/achievements", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("Achievement Data:", data); // DEBUG: Check your console!
        setAchievements({
          streak: data.streak || 0,
          calorie_streak: data.calorie_streak || 0,
          protein_days: data.protein_days || 0
        });
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);


  return (
    <div className="landing-container">
      {/* Personalized Welcome Header */}
      <header className="user-welcome-header">
        {user ? (
          <h2 className="welcome-text">
            Hey, <span className="welcome-username">{user.username}</span>!
          </h2>
        ) : (
          <h2 className="welcome-text">
            Hey, <span className="welcome-username">Anonymous Boba Enthusiast</span>!
          </h2>
        )}
      </header>

      {achievements && (
        <div className="achievement-banner">
          {/* Logging Streak - Always show if > 0 */}
          {achievements.streak > 0 && (
            <div className="badge fire">
              🔥 {achievements.streak}-Day Streak
            </div>
          )}

          {/* Calorie Streak - Show if they've hit it at least once */}
          {achievements.calorie_streak > 0 && (
            <div className="badge target">
              🎯 {achievements.calorie_streak} Day Goal Hit
            </div>
          )}

          {/* Protein Badge - Show if they've hit it at least once this week */}
          {achievements.protein_days > 0 && (
            <div className="badge protein">
              🥇 {achievements.protein_days}/7 Protein Days
            </div>
          )}
        </div>
      )}

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
          <div className="image-source">
            Photo by <a href="https://unsplash.com/@pwign" target="_blank" rel="noreferrer">@pwign</a> on 
            <a href="https://unsplash.com/photos/sliced-fruit-and-vegetables-on-plate-6S_96Vf9_p0" target="_blank" rel="noreferrer"> Unsplash</a>
          </div>
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
        {/* ... other feature blocks remain the same ... */}
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


        <FeatureBlock 
          link="/goals" 
          icon={<img src={goalsIcon} alt="Set Goals" className="feature-icon" />} 
          title="Set Goals" 
          desc="Set Daily Goals" 
          className="card-goals" 
        />

        <FeatureBlock 
          link="/achievements/full" 
          icon={<img src={achievementsIcon} alt="Achievements" className="feature-icon" />} 
          title="Achievements" 
          desc="See your weekly achievements and streaks" 
          className="card-achievements" 
        />

      </section>
    </div>
  );
}
function FeatureBlock({ link, icon, title, desc, className }) {
  return (
    <Link to={link} className={`feature-card ${className}`}>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
      {/* This part adds a cool "code-style" footer, e.g., </summary> */}
      <div className="feature-footer">{`</${title.toLowerCase().replace(/\s/g, '')}>`}</div>
    </Link>
  );
}