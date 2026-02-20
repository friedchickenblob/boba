function AdviceBox({ calories, protein, carbs, fat }) {
  let advice = "";

  if (protein < 50) {
    advice = "You are low on protein today. Consider eggs, tofu, or Greek yogurt.";
  } else if (calories > 2500) {
    advice = "You are exceeding your calorie target. Consider lighter dinner options.";
  } else if (carbs > 300) {
    advice = "High carb intake detected. Balance with more fiber and protein.";
  } else {
    advice = "Great balance today! Keep it up 💪";
  }

  return (
    <div style={{ marginTop: "20px", padding: "15px", background: "#f4f4f4" }}>
      <h2>AI Nutrition Advice</h2>
      <p>{advice}</p>
    </div>
  );
}

export default AdviceBox;