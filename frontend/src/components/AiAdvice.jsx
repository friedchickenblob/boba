import React, { useEffect, useState } from "react";
import NutritionChat from "./NutritionChat";
import "../App.css";
import examImg from "../assets/cramming.jpg";
import fluImg from "../assets/flu.jpg";
import crampsImg from "../assets/cramp.jpg";
import mealIcon from "../assets/advice.jpg";

export default function AiAdvice() {
  const [summary, setSummary] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null); 

  const healthyTips = [
    {
      id: "exams",
      title: "Healthy Eating during Exam Season",
      short: "Boost brain power and focus.",
      content: [
      "Prioritize Omega-3s (Walnuts, Salmon) for brain health.", "Eat complex carbs like Oats (granola) for sustained energy.",  "Avoid sugar crashes from energy drinks and sodas.", "High protein foods like eggs and lean meats support brain function.", "Stay hydrated to maintain concentration."],
      color: "#e0f2fe", // Light Blue
      accent: "#3b82f6",
      img: examImg
    },
    {
      id: "flu",
      title: "What to eat when you have the Flu",
      short: "Foods that help you recover faster.",
      content: ["Focus on hydration and zinc-rich foods (Eggs, yogurt, lean meats, and nut).", "Chicken soup provides electrolytes and helps clear nasal passages.", "Vitamin C from citrus fruits and berries supports the immune system.", "Avoid heavy, greasy foods that can be hard to digest."],
      color: "#fef3c7", // Light Amber
      accent: "#f59e0b",
      img: fluImg
    },
    {
      id: "cramps",
      title: "Using Food against Menstrual Pain",
      short: "Manage inflammation and cramps.",
      content: ["Magnesium-rich foods like dark chocolate and dark leafy greens (spinach or kale) help relax muscles.", "Anti-inflammatory ginger tea can significantly reduce pain.", "High-water content foods like watermelon, cucumber, lettuce, and berries reduce bloating.", "Avoid caffeine and salty foods to prevent worsening cramps and bloating."],
      color: "#fce7f3", // Light Pink
      accent: "#ec4899",
      img: crampsImg
    }
    ];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:8000/summary/daily", {
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
        <div className="header-text">
                            <h1>AI Nutrition Advice</h1>
                            <p>Your personalized assistant is ready to help you hit your goals.</p>
                      </div>    
                      <div className="header-image-box">
                                    <img src={mealIcon} alt="Meal Illustration" className="small-header-img" />
                                <div className="image-source">
                                  Photo by <a href="https://www.healingtouchcentre.com/latest-update/diet-and-nutrition-course-in-mumbai-located-in-the/22" target="_blank" rel="noreferrer">healing touch centre</a>
                                </div>  
                    </div>
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

      <section className="tips-section">
        <h2 className="tips-header">Healthy Tips</h2>
        <div className="tips-grid">
          {healthyTips.map((tip) => (
            <div 
              key={tip.id} 
              className="tip-card" 
              onClick={() => setSelectedTip(tip)}
              style={{ backgroundColor: tip.color, borderLeft: `6px solid ${tip.accent}` }}
            >
              <h3>{tip.title}</h3>
              <p>{tip.short}</p>
              <span className="read-more" style={{ color: tip.accent }}>Read More →</span>
            </div>
          ))}
        </div>
      </section>

      {selectedTip && (
        <div className="modal-overlay" onClick={() => setSelectedTip(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedTip(null)}>✕</button>
            
            {/* NEW: Image at the top of the Modal */}
            <div className="modal-image-container">
              <img src={selectedTip.img} alt={selectedTip.title} className="modal-hero-img" />
            </div>

            <div className="modal-body">
              <span className="modal-tag" style={{ backgroundColor: selectedTip.color, color: selectedTip.accent }}>
                HEALTHY TIPS
              </span>
              <h2>{selectedTip.title}</h2>
              <div className="modal-divider" style={{ backgroundColor: selectedTip.accent }}></div>
              
              {/* Check if content is an array and map it */}
              <ul className="modal-list">
                {Array.isArray(selectedTip.content) ? (
                  selectedTip.content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>{selectedTip.content}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}