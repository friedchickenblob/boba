import { useState } from "react";
import Upload from "./Upload";
import Results from "./Results";
import AdviceBox from "./AdviceBox";

function CaptureFood() {
  const [meals, setMeals] = useState([]);

  const handleAddMeal = async (meal) => {
    const formData = new FormData();
    formData.append("file", meal.file); // meal.file is the uploaded image

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      // The backend returns nutrition info
      const mealWithDate = {
        food: data.food,
        calories: data.nutrition.total.calories,
        protein: data.nutrition.total.protein,
        carbs: data.nutrition.total.carbs,
        fat: data.nutrition.total.fat,
        date: new Date().toISOString().split("T")[0]
      };

      setMeals(prev => [...prev, mealWithDate]);
    } catch (err) {
      console.error("Error sending meal to backend:", err);
    }
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