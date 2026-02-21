import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

const login = () => {
  window.location.href = "http://localhost:8000/auth/discord/login";
};

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 check session on mount
  useEffect(() => {
  fetch("http://localhost:8000/auth/me", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      console.log("ACTUAL DATA:", data);
      setUser(data.user);
      setLoading(false);
    });
}, []);

  const logout = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        NutriScan <span style={{ color: "#66a33d" }}>AI</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          Home
        </Link>
        <Link to="/dashboard" className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
          Summary
        </Link>
        <Link to="/capture" className={`nav-item ${location.pathname === "/capture" ? "active" : ""}`}>
          Scan Food
        </Link>
        <Link to="/manual" className={`nav-item ${location.pathname === "/manual" ? "active" : ""}`}>
          Search Food
        </Link>
        <Link to="/advice" className={`nav-item ${location.pathname === "/advice" ? "active" : ""}`}>
          Nutrition Advice
        </Link>

        {!loading ? (
          user ? (
            <button onClick={logout} className="login-btn">
              Sign Out
            </button>
          ) : (
            <button onClick={login} className="login-btn">
              Login
            </button>
          )) : (<span className="loading">Loading...</span>)
        }
      </div>
    </nav>
  );
};

export default Navbar;