import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        display: "flex", padding: "50px 5%", alignItems: "center", background: "#fdfdfd" 
      }}>
        <div style={{ flex: 1 }}>
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600" 
               alt="Healthy Eating" style={{ width: "100%", borderRadius: "10px" }} />
        </div>
        <div style={{ flex: 1, paddingLeft: "40px" }}>
          <h1 style={{ fontSize: "3rem", color: "#333" }}>Change your life in the next 90 days</h1>
          <p style={{ color: "#666", lineHeight: "1.6" }}>
            Our AI-powered platform helps you track nutrition through simple habit changes. 
            Snap a photo, get instant data, and transform your health.
          </p>
          <Link to="/capture">
            <button style={{ padding: "12px 30px", background: "#2d5a27", color: "white", border: "none", borderRadius: "5px" }}>
              Start Scanning Now
            </button>
          </Link>
        </div>
      </section>

      {/* 3 Blocks Section */}
      <section style={{ display: "flex", gap: "20px", padding: "50px 5%", background: "#fff" }}>
        <FeatureCard title="Calorie Summary" link="/dashboard" bg="#e8f5e9" img="📊" />
        <FeatureCard title="Scan Image" link="/capture" bg="#f1f8e9" img="📸" />
        <FeatureCard title="Nutrition Advice" link="/advice" bg="#f9fbe7" img="💡" />
      </section>
    </div>
  );
}

function FeatureCard({ title, link, bg, img }) {
  return (
    <Link to={link} style={{ flex: 1, textDecoration: "none", color: "inherit" }}>
      <div style={{ background: bg, padding: "40px", textAlign: "center", borderRadius: "12px", transition: "0.3s" }}>
        <div style={{ fontSize: "2rem" }}>{img}</div>
        <h3>{title}</h3>
        <p>Click to explore this feature</p>
      </div>
    </Link>
  );
}
export default LandingPage;