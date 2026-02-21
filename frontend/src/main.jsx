import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CaptureFood from "./components/CaptureFood";
import ManualEntry from "./components/ManualEntry";
import Login from "./components/Login";

function AppWrapper() {
  // This is the "global state" for all meals
  const [meals, setMeals] = React.useState([]);

  const addMeal = (meal) => setMeals(prev => [...prev, meal]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard meals={meals} addMeal={addMeal} />}
      />
      <Route path="/capture" element={<CaptureFood addMeal={addMeal} />} />
      <Route path="/manual" element={<ManualEntry addMeal={addMeal} />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppWrapper />
    <Login />
  </BrowserRouter>
);
