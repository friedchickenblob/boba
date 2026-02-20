import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:8000/summary/daily");
        const data = await res.json();
        setSummary(data.totals);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Calorie Tracker</h1>
      <p>{today}</p>
      <p>Calories: {summary.calories} kcal</p>
      <p>Protein: {summary.protein} g</p>
      <p>Carbs: {summary.carbs} g</p>
      <p>Fat: {summary.fat} g</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/capture")}>Capture Food</button>
        <button onClick={() => navigate("/manual")}>Add Food Manually</button>
      </div>
    </div>
  );
}