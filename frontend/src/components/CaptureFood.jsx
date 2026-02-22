import { useState } from "react";
import Upload from "./Upload";
import Results from "./Results";
import AdviceBox from "./AdviceBox";
import "../App.css";
import mealIcon from "../assets/scan_food.jpg";

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
        <div className="header-text">
          <h1>Scan Your Meal</h1>
          <p>Upload or Snap a photo of your food and let our AI calculate the nutrition for you.</p>
        </div>
        
        <div className="header-image-box">
          <img src={mealIcon} alt="Meal Illustration" className="small-header-img" />
          <div className="image-source">
            Photo by <a href="https://www.istockphoto.com/portfolio/alvarez?mediatype=photography" target="_blank" rel="noreferrer">@alvarez</a> on 
            <a href="https://www.istockphoto.com/photo/hands-of-cook-photographing-mexican-tacos-gm1241881284-362746031?searchscope=image%2Cfilm" target="_blank" rel="noreferrer"> Unsplash</a>
          </div>
        </div>
      </header>

      <div className="capture-layout">
        <div className="capture-card main-upload">
          <Upload onResult={handleAddMeal} />
        </div>

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