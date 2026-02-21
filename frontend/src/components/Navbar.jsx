import { Link, useLocation } from "react-router-dom";
import "../App.css"; 

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
          Search Food
        </Link>
        <Link to="/advice" className={`nav-item ${location.pathname === '/advice' ? 'active' : ''}`}>
          Nutrition Advice
        </Link>
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;