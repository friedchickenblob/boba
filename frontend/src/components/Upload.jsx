import { useState } from "react";
import { analyzeFood } from "../api/client";

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
    const data = await analyzeFood(file, portion);
    setLoading(false);

    onResult(data); // send data up to App.jsx
  }

  return (
    <div>
      <h2>Upload Food Image</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div>
          <img src={preview} alt="Preview" width="200" />
        </div>
      )}

      <select value={portion} onChange={(e) => setPortion(e.target.value)}>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Food"}
      </button>
    </div>
  );
}

export default Upload;