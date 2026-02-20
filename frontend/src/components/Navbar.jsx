import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ 
      display: "flex", justifyContent: "space-between", alignItems: "center", 
      padding: "1rem 5%", background: "#fff", borderBottom: "1px solid #eee" 
    }}>
      <div style={{ fontWeight: "bold", color: "#2d5a27", fontSize: "1.5rem" }}>🥗 NutriTrack</div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Summary</Link>
        <Link to="/capture">Scan Food</Link>
        <Link to="/advice">Advice</Link>
        <button style={{ 
          background: "#2d5a27", color: "white", border: "none", 
          padding: "8px 20px", borderRadius: "20px", cursor: "pointer" 
        }}>Login</button>
      </div>
    </nav>
  );
}
export default Navbar;