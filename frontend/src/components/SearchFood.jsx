import { useState } from "react";
import "../App.css";

function SearchFood() {
  const [food, setFood] = useState("");
  const [portion, setPortion] = useState("medium");
  const [nutrition, setNutrition] = useState(null);
  const [dishName, setDishName] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Search for nutrition (Preview only)
  const handleSearch = async () => {
    if (!food) return;
    setLoading(true);
    try {
      const res = await fetch("https://boba-production-751f.up.railway.app/analyze-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food, portion }),
      });
      if (!res.ok) throw new Error("Failed to fetch nutrition");

      const data = await res.json();
      setNutrition(data.nutrition);
      setDishName(data.food);
    } catch (err) {
      console.error(err);
      alert("Error fetching nutrition info");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm and Save to Database
  const handleConfirmLog = async () => {
    try {
      const res = await fetch("https://boba-production-751f.up.railway.app/log-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          food: dishName,
          calories: nutrition.calories,
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs
        }),
      });
      if (res.ok) {
        alert(`Successfully added ${dishName} to your daily log!`);
        setNutrition(null); 
        setFood("");       
      }
    } catch (err) {
      alert("Error logging food");
    }
  };

  return (
    <div className="search-container">
      <header className="search-header">
        <h1>Search Food Calories</h1>
        <p>Search for specific items and portion sizes to log your meals.</p>
      </header>

      <div className="search-card">
        <div className="search-input-group">
          <input
            className="custom-input"
            placeholder="What did you eat? (e.g., Grilled Salmon)"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
          
          <select 
            className="custom-select-inline" 
            value={portion} 
            onChange={(e) => setPortion(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          <button 
            className="cta-button search-btn" 
            onClick={handleSearch} // Connected handleSearch here
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {nutrition && (
        <div className="nutrition-result-card animate-fade-in">
          <div className="result-header">
            <div>
               <h2 style={{margin: 0}}>{dishName}</h2>
               <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>Nutrition data provided by AI</p>
            </div>
            <span className="portion-tag">{portion} portion</span>
          </div>
          
          <div className="result-grid">
            <div className="res-stat">
              <span className="res-val">{nutrition.calories}</span>
              <span className="res-label">Calories</span>
            </div>
            <div className="res-stat">
              <span className="res-val">{nutrition.protein}g</span>
              <span className="res-label">Protein</span>
            </div>
            <div className="res-stat">
              <span className="res-val">{nutrition.fat}g</span>
              <span className="res-label">Fat</span>
            </div>
            <div className="res-stat">
              <span className="res-val">{nutrition.carbs}g</span>
              <span className="res-label">Carbs</span>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={handleConfirmLog} className="confirm-btn">
               ✅ Log to Summary
            </button>
            <button onClick={() => setNutrition(null)} className="btn-secondary">
               Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFood;