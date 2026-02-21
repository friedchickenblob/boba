function Results({ meals }) {
  return (
    <div className="results-container">
      <h2 className="section-title">Meal History</h2>
      <div className="meals-list">
        {meals.map((meal, index) => (
          <div key={index} className="meal-log-card">
            <div className="meal-info">
              <span className="meal-name">{meal.food}</span>
              <span className="meal-date">{meal.date}</span>
            </div>
            <div className="meal-stats">
              <div className="mini-badge">{meal.calories} kcal</div>
              <div className="mini-badge gray">{meal.protein}g P</div>
              <div className="mini-badge gray">{meal.carbs}g C</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;