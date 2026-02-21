import { useState } from "react";
import { analyzeFood } from "../api/client";
import "../App.css";

function Upload({ onResult }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [portion, setPortion] = useState("medium");

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeFood(file, portion);
      setLoading(false);
      onResult(data);
    } catch (err) {
      setLoading(false);
      alert("Analysis failed. Please try again.");
    }
  }

  return (
    <div className="upload-wrapper">
      <div className="upload-zone">
        {!preview ? (
          <label className="file-label">
            <span className="upload-icon">📁</span>
            <span className="upload-text">Click to upload or drag image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button className="change-btn" onClick={() => setPreview(null)}>Change Photo</button>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <div className="portion-selector">
          <label>Portion Size:</label>
          <select value={portion} onChange={(e) => setPortion(e.target.value)} className="custom-select">
            <option value="small">Small (Light Snack)</option>
            <option value="medium">Medium (Standard Meal)</option>
            <option value="large">Large (Hungry!)</option>
          </select>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading || !file} 
          className={`cta-button ${loading ? "loading" : ""}`}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? "Crunching numbers..." : "Analyze Meal"}
        </button>
      </div>
    </div>
  );
}

export default Upload;