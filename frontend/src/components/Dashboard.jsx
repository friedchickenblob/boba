import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:8000/summary/daily");
        const data = await res.json();
        setSummary(data.totals);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Fetching your data...</p>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>Daily Summary</h1>
        <p className="date-display">{today}</p>
      </header>

      {/* Main Energy Card */}
      <div className="energy-card">
        <div className="energy-info">
          <span className="stat-label">Energy Intake</span>
          <div className="calorie-count">
            {summary.calories} <span className="unit">kcal</span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button onClick={() => navigate("/capture")} className="btn-primary">+ Scan Meal</button>
          <button onClick={() => navigate("/manual")} className="btn-secondary">Manual Entry</button>
        </div>
      </div>

      {/* Macro Grid */}
      <div className="macro-grid">
        <MacroCard label="Protein" value={summary.protein} unit="g" className="protein-card" icon="🥩" />
        <MacroCard label="Carbs" value={summary.carbs} unit="g" className="carbs-card" icon="🍞" />
        <MacroCard label="Fat" value={summary.fat} unit="g" className="fat-card" icon="🥑" />
      </div>
    </div>
  );
}

function MacroCard({ label, value, unit, className, icon }) {
  return (
    <div className={`macro-card ${className}`}>
      <div className="macro-header">
        <span className="macro-icon">{icon}</span>
        <span className="macro-label">{label}</span>
      </div>
      <div className="macro-value">
        {value} <span className="macro-unit">{unit}</span>
      </div>
    </div>
  );
}