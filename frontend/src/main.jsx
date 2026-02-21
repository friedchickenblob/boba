import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CaptureFood from "./components/CaptureFood";
import SearchFood from "./components/SearchFood";
import LandingPage from "./components/LandingPage"; // This will hold Hero and Blocks
import Navbar from "./components/Navbar";       // This will hold your Nav logic
import AiAdvice from "./components/AiAdvice";
import './index.css'
import Login from "./components/Login";


function AppWrapper() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar /> {/* Use the imported Navbar */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/capture" element={<CaptureFood />} />
        <Route path="/manual" element={<SearchFood />} />
        <Route path="/advice" element={<AiAdvice />} />
      </Routes>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);
