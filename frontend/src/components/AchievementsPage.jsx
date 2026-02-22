import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import fireIcon from "../assets/fire.png";
import "../App.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function AchievementsPage() {
  const [data, setData] = useState({ streak_bar: [], streak_history: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/achievements/full", {
        credentials: "include"
      });
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, []);

  // 1. Get dynamic labels from the backend history (e.g., ["Tue", "Wed", "Thu"...])
  const dynamicLabels = data.streak_history.map(d => d.day);

  // 2. Map the data for the dots
  // For logging, we slice the last 7 of the 30-day bar to align with the labels
  // Map the last 7 days based on whether the goal was actually MET
  const last7Logging = data.streak_bar.slice(-7).map(d => d.logged);

  const last7Calories = data.streak_history.map(d => 
    d.calories >= data.goals.calories
  );

  const last7Protein = data.streak_history.map(d => 
    d.protein >= data.goals.protein
  );

  const macroChartData = {
    labels: dynamicLabels,
    datasets: [
      {
        label: "Calories",
        data: data.streak_history.map(d => d.calories),
        borderColor: "#ff4d4d",
        backgroundColor: "rgba(255, 77, 77, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Protein",
        data: data.streak_history.map(d => d.protein),
        borderColor: "#4d79ff",
        backgroundColor: "rgba(77, 121, 255, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Fat",
        data: data.streak_history.map(d => d.fat),
        borderColor: "#ffb24d",
        backgroundColor: "rgba(77, 121, 255, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Carbs",
        data: data.streak_history.map(d => d.carbs),
        borderColor: "#51bb33",
        backgroundColor: "rgba(77, 121, 255, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }
    ]
  };

  return (
    <div className="achieve-container">
      <header className="achieve-header">
        <h1 className="achieve-main-title">Achievements</h1>
        <p className="achieve-subtitle">Your weekly Streaks and Progress</p>
      </header>

      {/* Cards with Dynamic Labels */}
      <StreakCard 
        title="Logging Streak" 
        icon={fireIcon} 
        days={last7Logging} 
        labels={dynamicLabels} 
        streak={data.streak_bar.filter(d => d.logged).length} 
      />
      <StreakCard 
        title="Calories Goal" 
        icon={fireIcon} 
        days={last7Calories} 
        labels={dynamicLabels} 
        streak={data.streak_history.filter(d => d.calories > 0).length} 
      />
      <StreakCard 
        title="Protein Goal" 
        icon={fireIcon} 
        days={last7Protein} 
        labels={dynamicLabels} 
        streak={data.streak_history.filter(d => d.protein > 0).length} 
      />

      <div className="achieve-chart-card">
        <h4 className="achieve-chart-title">Weekly Macros</h4>
        <Line data={macroChartData} options={{ 
            responsive: true, 
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
        }} />
      </div>
    </div>
  );
}

function StreakCard({ title, icon, days, labels, streak }) {
  return (
    <div className="achieve-card">
      <div className="achieve-card-header">
        <span className="achieve-title">{title}</span>
      </div>
      
      <div className="achieve-streak-info">
        <img src={icon} alt="fire" className="achieve-fire-icon" />
        <span className="achieve-streak-text">{streak} day streak</span>
      </div>

      <div className="achieve-dots-container">
        {labels.map((label, i) => (
          <div key={i} className="achieve-dot-wrapper">
            <span className="achieve-day-label">{label}</span>
            <div className={`achieve-dot ${days[i] ? 'is-filled' : ''}`} />
          </div>
        ))}
      </div>
    </div>
  );
}