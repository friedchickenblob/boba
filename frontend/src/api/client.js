export async function analyzeFood(file, portion) {
  const formData = new FormData();
  
  // These keys MUST match the variable names in your Python function exactly
  formData.append("file", file);
  formData.append("portion", portion); 

  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    // IMPORTANT: Do NOT set "Content-Type" headers. 
    // The browser will automatically set it to multipart/form-data with the correct boundary.
    body: formData, 
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Validation Error:", errorBody);
    throw new Error("Check browser console for 422 details");
  }

  return await response.json();
}