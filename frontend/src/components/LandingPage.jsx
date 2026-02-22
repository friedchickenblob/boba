import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";
import summaryIcon from "../assets/summary.png";
import scanIcon from "../assets/scan.png";
import adviceIcon from "../assets/advice.png";
import searchIcon from "../assets/search.png";
import goalsIcon from "../assets/target.png";
import achievementsIcon from "../assets/badge.png";
import aboutImg from "../assets/boba-img.png";
import bobaImg from "../assets/boba.png";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState(null);

  useEffect(() => {
    fetch("https://web-production-2a2a3.up.railway.app/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
      });
  }, []);

  // Change your fetch to handle the data better
  useEffect(() => {
    fetch("https://web-production-2a2a3.up.railway.app/achievements", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("Achievement Data:", data);
        setAchievements({
          streak: data.streak || 0,
          calorie_streak: data.calorie_streak || 0,
          protein_days: data.protein_days || 0,
          calorie_days_hit: data.calorie_days_hit || 0,
          protein_days_hit: data.protein_days_hit || 0,
          badges: data.badges || {}
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

          {achievements.calorie_days_hit>0 && (
            <div className="badge target">🎯 {achievements.calorie_days_hit}-Day Calorie Goal</div>
          )}

          {achievements.protein_days_hit>0 && (
            <div className="badge protein">🥇 {achievements.protein_days_hit}-Day Protein Goal</div>
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

      <section className="about-section">
        <div className="about-container">
          
          <div className="about-content">
            <span className="about-tag">OUR MISSION</span>
            <h2 className="about-title">Your Daily Partner in Nutrition and Wellness</h2>
            <p className="about-description">
              Our aim is to help students and health enthusiasts navigate their nutrition with comfort. 
              We provide the tools you need to build better habits without the stress of manual calculations. 
              With BobaScan AI, you can focus on enjoying your meals while we take care of the rest.
            </p>

            <div className="capability-list">
              <div className="capability-item">
                <div className="cap-icon"><img src={bobaImg} alt="Boba Icon" className="cap-icon" /></div>
                <div className="cap-text">
                  <h3>Quick Calorie Check</h3>
                  <p>Instant identification of food calories using AI-powered image recognition.</p>
                </div>
              </div>

              <div className="capability-item">
                <div className="cap-icon"><img src={bobaImg} alt="Boba Icon" className="cap-icon" /></div>
                <div className="cap-text">
                  <h3>Smart Logging</h3>
                  <p>Automatically log consumption into your calendar to track long-term goals.</p>
                </div>
              </div>

              <div className="capability-item">
                <div className="cap-icon"><img src={bobaImg} alt="Boba Icon" className="cap-icon" /></div>
                <div className="cap-text">
                  <h3>AI Nutrition Coach</h3>
                  <p>Chat with our AI assistant for instant health tips and personalized meal advice.</p>
                </div>
              </div>

              <div className="capability-item">
                <div className="cap-icon"><img src={bobaImg} alt="Boba Icon" className="cap-icon" /></div>
                <div className="cap-text">
                  <h3>Motivation Streaks</h3>
                  <p>Keep your momentum motivation with daily streaks and achievement tracking.</p>
                </div>
              </div>
            </div>

            <div className="disclaimer-box">
              <p>
                <strong>Note:</strong> We provide smart estimations to promote nutritional awareness. While not 100% absolute, it’s a powerful guide for a healthier you.
              </p>
            </div>
          </div>

          <div className="about-image-wrapper">
            <img src={aboutImg} alt="Healthy lifestyle" className="about-main-img" />
            <div className="floating-card">
              <span>85% Better Focus</span>
            </div>
          </div>

        </div>
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