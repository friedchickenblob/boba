function Results({ meals }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Meal History</h2>
      {meals.map((meal, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p><strong>{meal.food}</strong></p>
          <p>{meal.calories} kcal</p>
        </div>
      ))}
    </div>
  );
}

export default Results;