import { useState } from "react";
import Upload from "./Upload";
import Results from "./Results";
import AdviceBox from "./AdviceBox";

function CaptureFood() {
  const [meals, setMeals] = useState([]);

  const handleAddMeal = (data) => {
  // Check if data and nutrition exist before using them
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Capture Food</h1>
      <Upload onResult={handleAddMeal} />

      {meals.length > 0 && (
        <>
          <Results meals={meals} />

          <div style={{ marginTop: "20px" }}>
            <h2>Daily Totals</h2>
            <p>Calories: {meals.reduce((s, m) => s + m.calories, 0)}</p>
            <p>Protein: {meals.reduce((s, m) => s + m.protein, 0)}</p>
            <p>Carbs: {meals.reduce((s, m) => s + m.carbs, 0)}</p>
            <p>Fat: {meals.reduce((s, m) => s + m.fat, 0)}</p>
          </div>

          <AdviceBox
            calories={meals.reduce((s, m) => s + m.calories, 0)}
            protein={meals.reduce((s, m) => s + m.protein, 0)}
            carbs={meals.reduce((s, m) => s + m.carbs, 0)}
            fat={meals.reduce((s, m) => s + m.fat, 0)}
          />
        </>
      )}
    </div>
  );
}

export default CaptureFood;