import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { analyzeFood } from "../api/client";
import "../App.css";

function Upload({ onResult }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [portion, setPortion] = useState("medium");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const webcamRef = useRef(null);

  // --- Handlers ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsCameraOpen(false);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);
    
    // Convert base64 to Blob to make it look like a "File"
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const capturedFile = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
      });
    
    setIsCameraOpen(false);
  }, [webcamRef]);

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
        {/* Toggle View: Camera vs Upload vs Preview */}
        {isCameraOpen ? (
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
            />
            <button className="capture-btn" onClick={capturePhoto}>📸 Snap Photo</button>
          </div>
        ) : preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button className="change-btn" onClick={() => {setPreview(null); setFile(null);}}>Change</button>
          </div>
        ) : (
          <div className="upload-options">
            <label className="file-label">
              <span className="upload-icon">📁</span>
              <span className="upload-text">Upload Image</span>
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
            <div className="divider">OR</div>
            <button className="camera-toggle-btn" onClick={() => setIsCameraOpen(true)}>
              <span className="upload-icon">📷</span>
              <span className="upload-text">Use Camera</span>
            </button>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <div className="portion-selector">
          <label>Portion Size:</label>
          <select value={portion} onChange={(e) => setPortion(e.target.value)} className="custom-select">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading || !file} 
          className={`cta-button ${loading ? "loading" : ""}`}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? "Analyzing..." : "Analyze Meal"}
        </button>
      </div>
    </div>
  );
}

export default Upload;