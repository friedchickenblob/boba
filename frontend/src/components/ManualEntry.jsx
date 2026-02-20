import { useState } from "react";

function ManualEntry() {
  const [food, setFood] = useState("");
  const [portion, setPortion] = useState("medium");
  const [nutrition, setNutrition] = useState(null);
  const [dishName, setDishName] = useState(""); // GPT-corrected name

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/analyze-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food, portion }),
      });
      if (!res.ok) throw new Error("Failed to fetch nutrition");

      const data = await res.json();
      setNutrition(data.nutrition);
      setDishName(data.food);       // GPT-corrected name
      setFood(data.food);           // pre-fill input with corrected name
      alert(`Added ${data.food} successfully!`);
      setPortion("medium");
    } catch (err) {
      console.error(err);
      alert("Error fetching nutrition info");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manual Food Entry</h1>

      <input
        placeholder="Food Name"
        value={food}
        onChange={(e) => setFood(e.target.value)}
      />

      <select value={portion} onChange={(e) => setPortion(e.target.value)}>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>

      <button onClick={handleSubmit}>Add Food</button>

      {nutrition && (
        <div style={{ marginTop: "20px" }}>
          <h2>Nutrition Info for {dishName}</h2>
          <p>Calories: {nutrition.calories}</p>
          <p>Protein: {nutrition.protein}g</p>
          <p>Fat: {nutrition.fat}g</p>
          <p>Carbs: {nutrition.carbs}g</p>
        </div>
      )}
    </div>
  );
}

export default ManualEntry;