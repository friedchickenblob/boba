import { useState } from "react";

export default function Upload() {
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-96">
      <h2 className="text-xl font-semibold mb-4">Upload Your Meal 📸</h2>
      <input type="file" accept="image/*" onChange={handleChange} />
      {image && (
        <p className="mt-4 text-sm text-gray-600">
          Selected: {image.name}
        </p>
      )}
    </div>
  );
}