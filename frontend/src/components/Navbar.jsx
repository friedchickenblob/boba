import { Link, useLocation } from "react-router-dom";
import "../App.css"; // Make sure to import your CSS file!


const login = () => {
    window.location.href = "http://localhost:8000/auth/discord/login";
};

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        NutriScan <span style={{ color: '#66a33d' }}>AI</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          Summary
        </Link>
        <Link to="/capture" className={`nav-item ${location.pathname === '/capture' ? 'active' : ''}`}>
          Scan Food
        </Link>
        <Link to="/manual" className={`nav-item ${location.pathname === '/manual' ? 'active' : ''}`}>
          Manual Entry
        </Link>
        <button onClick={login} className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
