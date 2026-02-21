import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

// 1. DEFINE THE SUB-COMPONENT FIRST (or at the bottom)
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState("daily"); 
  const [summary, setSummary] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [dailyItems, setDailyItems] = useState([]);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyRes = await fetch("http://localhost:8000/summary/daily", { credentials: "include" });
        const dailyData = await dailyRes.json();
        setSummary(dailyData.totals);

        const logRes = await fetch("http://localhost:8000/summary/daily-log", { credentials: "include" });
        const logData = await logRes.json();
        setDailyItems(logData);

        const weeklyRes = await fetch("http://localhost:8000/summary/weekly", { credentials: "include" });
        const weeklyData = await weeklyRes.json();
        setWeeklyData(weeklyData.totals);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  if (!summary) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-top">
          <h1>Dashboard</h1>
          <div className="tab-group">
            <button 
              className={`tab-btn ${view === "daily" ? "active" : ""}`} 
              onClick={() => setView("daily")}
            >Daily</button>
            <button 
              className={`tab-btn ${view === "weekly" ? "active" : ""}`} 
              onClick={() => setView("weekly")}
            >Weekly</button>
          </div>
        </div>
        <p className="date-display">{view === "daily" ? today : "Past 7 Days"}</p>
      </header>

      {view === "daily" ? (
        <div className="animate-fade">
          <div className="energy-card">
            <div className="energy-info">
              <span className="stat-label">Energy Intake</span>
              <div className="calorie-count">
                {summary.calories} <span className="unit">kcal</span>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={() => navigate("/capture")} className="btn-primary">+ Scan Meal</button>
              <button onClick={() => navigate("/manual")} className="btn-secondary">Search Food</button>
            </div>
          </div>

          <div className="macro-grid">
            {/* FIXED: Use Capital Letters for Component Name */}
            <MacroCard label="Protein" value={summary.protein} unit="g" className="protein-card" icon="🥩" />
            <MacroCard label="Carbs" value={summary.carbs} unit="g" className="carbs-card" icon="🍞" />
            <MacroCard label="Fat" value={summary.fat} unit="g" className="fat-card" icon="🥑" />
          </div>

          <section className="log-section">
            <h2 className="section-title">Today's Meals</h2>
            <div className="table-container">
              <table className="food-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Food Item</th>
                    <th>Calories</th>
                    <th>Macros (P/C/F)</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyItems.length > 0 ? (
                    dailyItems.map((item) => (
                      <tr key={item.id}>
                        <td className="time-col">{item.time}</td>
                        <td className="food-name-col">{item.food}</td>
                        <td className="cal-col"><strong>{item.calories}</strong> kcal</td>
                        <td className="macro-col">
                          <span className="p-tag">{item.protein}g</span>
                          <span className="c-tag">{item.carbs}g</span>
                          <span className="f-tag">{item.fat}g</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-msg">No meals logged yet today.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <div className="weekly-calendar-grid animate-fade">
            <div className="weekly-total-card">
                <h3>Total Weekly Consumption</h3>
                {weeklyData ? (
                  <div className="weekly-stats-row">
                      <div className="week-stat"><strong>{weeklyData.calories}</strong><span>kcal</span></div>
                      <div className="week-stat"><strong>{weeklyData.protein}g</strong><span>Prot</span></div>
                      <div className="week-stat"><strong>{weeklyData.carbs}g</strong><span>Carb</span></div>
                      <div className="week-stat"><strong>{weeklyData.fat}g</strong><span>Fat</span></div>
                  </div>
                ) : <p>Loading weekly data...</p>}
            </div>
            
            <p className="hint-text">Daily breakdown for the week:</p>
            <div className="calendar-row">
                {['S','M','T','W','T','F','S'].map((day, i) => (
                    <div key={i} className="calendar-day-card">
                        <span className="day-name">{day}</span>
                        <div className="day-dot"></div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}