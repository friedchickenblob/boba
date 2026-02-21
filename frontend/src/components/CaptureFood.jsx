import { useState } from "react";
import Upload from "./Upload";
import Results from "./Results";
import AdviceBox from "./AdviceBox";
import "../App.css";

function CaptureFood() {
  const [meals, setMeals] = useState([]);

  const handleAddMeal = (data) => {
    if (!data || !data.nutrition) {
      console.error("Invalid data received from backend", data);
      return;
    }

    const mealWithDate = {
      food: data.food,
      calories: data.nutrition.total.calories,
      protein: data.nutrition.total.protein,
      carbs: data.nutrition.total.carbs,
      fat: data.nutrition.total.fat,
      date: new Date().toISOString().split("T")[0]
    };

    setMeals(prev => [...prev, mealWithDate]);
  };

  // Calculate totals for the summary cards
  const totals = {
    calories: meals.reduce((s, m) => s + m.calories, 0),
    protein: meals.reduce((s, m) => s + m.protein, 0),
    carbs: meals.reduce((s, m) => s + m.carbs, 0),
    fat: meals.reduce((s, m) => s + m.fat, 0),
  };

  return (
    <div className="capture-container">
      <header className="capture-header">
        <h1>📸 Scan Your Meal</h1>
        <p>Upload a photo and let our AI calculate the nutrition for you.</p>
      </header>

      <div className="capture-layout">
        {/* Left Side: The Action Area */}
        <div className="capture-card main-upload">
          <Upload onResult={handleAddMeal} />
        </div>

        {/* Right Side: The Result Area (Shows only if meals exist) */}
        {meals.length > 0 && (
          <div className="capture-sidebar">
            <div className="capture-card totals-card">
              <h3>Live Session Totals</h3>
              <div className="mini-stats">
                <div className="stat-item"><strong>{totals.calories}</strong><span>kcal</span></div>
                <div className="stat-item"><strong>{totals.protein}g</strong><span>Prot</span></div>
                <div className="stat-item"><strong>{totals.carbs}g</strong><span>Carb</span></div>
                <div className="stat-item"><strong>{totals.fat}g</strong><span>Fat</span></div>
              </div>
            </div>
            
            <AdviceBox {...totals} />
          </div>
        )}
      </div>

      {meals.length > 0 && (
        <div className="results-section">
          <Results meals={meals} />
        </div>
      )}
    </div>
  );
}

export default CaptureFood;