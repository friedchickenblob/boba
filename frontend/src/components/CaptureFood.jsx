import { useState } from "react";
import Upload from "./Upload";
import Results from "./Results";
import AdviceBox from "./AdviceBox";

function CaptureFood({ addMeal }) {
  const [meals, setMeals] = useState([]);

  const handleAddMeal = (meal) => {
    const mealWithDate = {
        ...meal,
        date: new Date().toISOString().split("T")[0], // e.g., "2026-02-20"
    };

    setMeals(prev => [...prev, mealWithDate]);

    if (addMeal) addMeal(mealWithDate); // notify parent
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Capture Food</h1>
      <Upload onResult={handleAddMeal} />

      {meals.length > 0 && (
        <>
          <Results meals={meals} />

          <div style={{ marginTop: "20px" }}>
            <h2>Daily Totals</h2>
            <p>Calories: {totalCalories} kcal</p>
            <p>Protein: {totalProtein} g</p>
            <p>Carbs: {totalCarbs} g</p>
            <p>Fat: {totalFat} g</p>
          </div>

          <AdviceBox
            calories={totalCalories}
            protein={totalProtein}
            carbs={totalCarbs}
            fat={totalFat}
          />
        </>
      )}
    </div>
  );
}

export default CaptureFood;