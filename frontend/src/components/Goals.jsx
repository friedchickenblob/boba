import { useEffect, useState } from "react";
import "../App.css";
import mealIcon from "../assets/goal.jpg";

function GoalsCard({ goals, setGoals, summary }) {
  const [localGoals, setLocalGoals] = useState(goals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
    });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isValid = Object.values(localGoals).some(val => val > 0);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  const presets = {
    cut: { calories: 1800, protein: 140, carbs: 150, fat: 60 },
    maintain: { calories: 2200, protein: 120, carbs: 250, fat: 70 },
    bulk: { calories: 2800, protein: 180, carbs: 350, fat: 90 }
  };

  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = (type) => {
    setLocalGoals(presets[type]);
    setActivePreset(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalGoals(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = async () => {
    try {
        setSaving(true);

        const res = await fetch("http://localhost:8000/goals/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localGoals)
        });

        if (!res.ok) throw new Error("Failed to save");

        setGoals(localGoals);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    } catch (err) {
        console.error(err);
        alert("Failed to save goals.");
    } finally {
        setSaving(false);
    }
    };

  const renderProgress = (macro) => {
    if (!summary) return null;

    const value = summary[macro];
    const goal = localGoals[macro];
    const percent = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

    return (
      <div className="goal-progress">
        <div className="goal-progress-label">
          {value}/{goal}
        </div>
        <div className="goal-progress-bar">
          <div
            className="goal-progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="goals-card modern">
      <div className="goals-header">
            <h3>Daily Goals</h3>
            {saved && <span className="saved-badge">✓ Saved</span>}
      </div>

      {/* Presets */}
      <div className="preset-row">
        {["cut", "maintain", "bulk"].map(type => (
            <button
            key={type}
            className={activePreset === type ? "active" : ""}
            onClick={() => applyPreset(type)}
            >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
        ))}
      </div>

      {["calories", "protein", "carbs", "fat"].map((macro) => (
        <div key={macro} className="goal-row">
          <div className="goal-input-group">
            <label>{macro.charAt(0).toUpperCase() + macro.slice(1)}</label>
            <input
              type="number"
              name={macro}
              value={localGoals[macro]}
              onChange={handleChange}
            />
          </div>

          {renderProgress(macro)}
        </div>
      ))}

      <button onClick={handleSave} disabled={saving || !isValid} className="btn-primary">
        {saving ? "Saving..." : "Save Goals"}
      </button>
    </div>
  );
}


export default function Goals() {
  const [goals, setGoals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetch("http://localhost:8000/goals/daily");
      const data = await res.json();
      setGoals(data);
    };
    fetchGoals();
  }, []);

  return (
    <div className="goals-container">
      <header className="goals-header1">
        <div className="header-text">
              <h1>Set Goals</h1>
              <p>Set your Daily Goals</p>
        </div>    
        <div className="header-image-box">
                      <img src={mealIcon} alt="Meal Illustration" className="small-header-img" />
                  <div className="image-source">
                    Photo by <a href="https://www.auraleisure.ie/blog/what-are-the-benefits-of-meal-planning/" target="_blank" rel="noreferrer">aura leisure</a>
                  </div>  
      </div>
      </header>
      <GoalsCard goals={goals} setGoals={setGoals} />
    </div>
  );
}