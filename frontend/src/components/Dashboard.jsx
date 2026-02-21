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


function ProgressBar({ label, value, goal, unit, color }) {
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const isOver = value > goal;

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-label">
        <span>{label}</span>
        <span>{value}/{goal} {unit}</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: isOver ? "#ef4444" : color
          }}
        />
      </div>

      {isOver && (
        <div className="over-warning">
          ⚠ Exceeded target
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState("daily"); 
  const [summary, setSummary] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [dailyItems, setDailyItems] = useState([]);
  const [goals, setGoals] = useState(null);
  const [goalsLoaded, setGoalsLoaded] = useState(false);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyRes = await fetch("https://boba-production-751f.up.railway.app/summary/daily", { credentials: "include" });
        const dailyData = await dailyRes.json();
        setSummary(dailyData.totals);

        const logRes = await fetch("https://boba-production-751f.up.railway.app/summary/daily-log", { credentials: "include" });
        const logData = await logRes.json();
        setDailyItems(logData);

        const weeklyRes = await fetch("https://boba-production-751f.up.railway.app/summary/weekly", { credentials: "include" });
        const weeklyData = await weeklyRes.json();
        setWeeklyData(weeklyData.totals);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetch("https://boba-production-751f.up.railway.app/goals/daily", { credentials: "include" });
      const data = await res.json();

      if (data?.calories && data.calories > 0) {
        setGoals(data);
      } else {
        setGoals(null);
      }

      setGoalsLoaded(true);
    };
    fetchGoals();
  }, []);

  const activeTotals = view === "daily" ? summary : weeklyData;

  const activeGoals =
  view === "daily"
    ? goals
    : {
        calories: goals.calories * 7,
        protein: goals.protein * 7,
        carbs: goals.carbs * 7,
        fat: goals.fat * 7,
      };

  if (!summary || (view === "weekly" && !weeklyData)) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );
  
  // if (!summary) return (
  //   <div className="loader-container">
  //     <div className="spinner"></div>
  //     <p>Loading your dashboard...</p>
  //   </div>
  // );

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

      {!goalsLoaded ? (
        <p>Loading goals...</p>
      ) : goals ? (

          <section className="progress-section">
            <h2>Your {view === "daily" ? "Daily" : "Weekly"} Progress</h2>

            <ProgressBar
              label="Calories"
              value={activeTotals.calories}
              goal={activeGoals.calories}
              unit="kcal"
              color="#16a34a"
            />

            <ProgressBar
              label="Protein"
              value={activeTotals.protein}
              goal={activeGoals.protein}
              unit="g"
              color="#f97316"
            />

            <ProgressBar
              label="Carbs"
              value={activeTotals.carbs}
              goal={activeGoals.carbs}
              unit="g"
              color="#3b82f6"
            />

            <ProgressBar
              label="Fat"
              value={activeTotals.fat}
              goal={activeGoals.fat}
              unit="g"
              color="#ef4444"
            />

            <button
              className="btn-secondary1"
              onClick={() => navigate("/goals")}
            >
              Edit Goals
            </button>
          </section>



      ) : (
        <div className="no-goals-card">
          <h3>No Goals Set Yet</h3>
          <p>Set your daily nutrition targets to track progress.</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/goals")}
          >
            Set Goals
          </button>
        </div>
      )}


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