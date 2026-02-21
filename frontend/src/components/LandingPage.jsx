import { Link } from "react-router-dom";
import "../App.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Change your life in the <br />
            <span className="accent-text">next 90 days.</span>
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
          icon="📊" 
          title="Summary" 
          desc="View your daily nutrition progress." 
          className="card-summary" 
        />
        <FeatureBlock 
          link="/capture" 
          icon="📸" 
          title="Scan Food" 
          desc="AI photo recognition." 
          className="card-scan" 
        />
        <FeatureBlock 
          link="/advice" 
          icon="💡" 
          title="AI Advice" 
          desc="Personalized health tips." 
          className="card-advice" 
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
      <div className="feature-footer">{`</${title.toLowerCase().replace(/\s/g, '')}>`}</div>
    </Link>
  );
}