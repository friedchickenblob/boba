

import React, { useEffect, useState } from "react";
import NutritionChat from "./NutritionChat";

export default function AiAdvice() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:8000/summary/daily");
        const data = await res.json();
        setSummary(data.totals);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) {
    return <p className="text-lg">Loading your nutrition data...</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-yellow-100 p-8">
      <h1 className="text-5xl font-extrabold mb-6">🚀 AI Nutrition Advice</h1>
      <p className="text-lg mb-6">
        Ask questions based on what you’ve eaten today
      </p>

      <NutritionChat summary={summary} />
    </div>
  );
}
