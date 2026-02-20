function Dashboard({ meals }) {
  // Get today's date string
  const today = new Date().toISOString().split("T")[0]; // "2026-02-20"

  // Filter meals for today only
  const todaysMeals = meals.filter(meal => meal.date === today);

  // Calculate totals
  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = todaysMeals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Calorie Tracker</h1>

      <p>{today}</p>
      <p>Calories: {totalCalories} kcal</p>
      <p>Protein: {totalProtein} g</p>
      <p>Carbs: {totalCarbs} g</p>
      <p>Fat: {totalFat} g</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/capture")}>Capture Food</button>
        <button onClick={() => navigate("/manual")}>Add Food Manually</button>
      </div>
    </div>
  );
}