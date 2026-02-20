import { useState } from "react";

function ManualEntry() {
  const [food, setFood] = useState("");
  const [amount, setAmount] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleSubmit = async () => {
    // Build meal object
    const newMeal = {
      food,
      amount,
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      date: new Date().toISOString().split("T")[0], // for frontend
    };

    try {
      // Send to backend
      const res = await fetch("http://localhost:8000/analyze-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeal),
      });

      if (!res.ok) throw new Error("Failed to save meal");

      alert("Meal added successfully!");
      // Reset form
      setFood("");
      setAmount("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
    } catch (err) {
      console.error(err);
      alert("Error adding meal");
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
      <input
        placeholder="Amount / Portion"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Calories"
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <input
        placeholder="Protein (g)"
        type="number"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
      />
      <input
        placeholder="Carbs (g)"
        type="number"
        value={carbs}
        onChange={(e) => setCarbs(e.target.value)}
      />
      <input
        placeholder="Fat (g)"
        type="number"
        value={fat}
        onChange={(e) => setFat(e.target.value)}
      />

      <button onClick={handleSubmit}>Add Food</button>
    </div>
  );
}

export default ManualEntry;