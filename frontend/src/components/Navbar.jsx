import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";
import logoIcon from "../assets/calobro-icon.png";

const login = () => {
  window.location.href = "https://web-production-2a2a3.up.railway.app/auth/discord/login";
};

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("https://web-production-2a2a3.up.railway.app/auth/me", {
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
    await fetch("https://web-production-2a2a3.up.railway.app/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img src={logoIcon} alt="CaloBro Logo" className="nav-icon" />
        <span>Calo<span style={{ color: "#66a33d" }}>Bro</span></span>
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
        <Link to="/goals" className={`nav-item ${location.pathname === "/goals" ? "active" : ""}`}>
          Set Goals
        </Link>
        <Link to="/achievements/full" className={`nav-item ${location.pathname === "/achievements/full" ? "active" : ""}`}>
          Achievements
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