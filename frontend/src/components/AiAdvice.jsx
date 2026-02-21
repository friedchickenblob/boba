import React, { useEffect, useState } from "react";
import NutritionChat from "./NutritionChat";
import "../App.css";

export default function AiAdvice() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("https://boba-production-751f.up.railway.app:8000/summary/daily", {
          credentials: "include", // Required for your session-based auth
        });
        const data = await res.json();
        setSummary(data.totals);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Analyzing your nutrition profile...</p>
      </div>
    );
  }

  return (
    <div className="advice-page-container">
      <header className="advice-header">
        <h1>AI Nutrition Advice</h1>
        <p>Your personalized assistant is ready to help you hit your goals.</p>
      </header>

      <div className="advice-layout">
        {/* Context Sidebar: Shows what the AI knows */}
        <aside className="chat-context-card">
          <h3>AI Context</h3>
          <p className="context-desc">The assistant is currently analyzing your data for today:</p>
          <div className="context-stats">
            <div className="ctx-stat">
              <span>Calories</span>
              <strong>{summary.calories} kcal</strong>
            </div>
            <div className="ctx-stat">
              <span>Protein</span>
              <strong>{summary.protein}g</strong>
            </div>
            <div className="ctx-stat">
              <span>Carbs</span>
              <strong>{summary.carbs}g</strong>
            </div>
            <div className="ctx-stat">
              <span>Fat</span>
              <strong>{summary.fat}g</strong>
            </div>
          </div>
          <div className="ai-hint">
             Try asking: "Do I have room for a snack?" or "How can I get more protein tonight?"
          </div>
        </aside>

        {/* The Chat Window */}
        <main className="chat-main">
          <NutritionChat summary={summary} />
        </main>
      </div>
    </div>
  );
}