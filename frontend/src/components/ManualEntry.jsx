import { useState } from "react";

function ManualEntry({ addMeal }) {
  const [food, setFood] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const mockCalories = 100; // backend will calculate real value
    const newMeal = {
      food,
      calories: mockCalories,
      protein: 5,
      carbs: 10,
      fat: 2,
      date: new Date().toISOString().split("T")[0] // store date
    };

    addMeal(newMeal);

    setFood("");
    setAmount("");
    alert("Added!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manual Food Entry</h1>
      <input placeholder="Food Name" value={food} onChange={(e) => setFood(e.target.value)} />
      <input placeholder="Amount / Portion" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleSubmit}>Add Food</button>
    </div>
  );
}

export default ManualEntry;