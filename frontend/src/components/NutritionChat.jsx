import React, { useState } from "react";

export default function NutritionChat({ summary }) {
    const [messages, setMessages] = useState([
      { from: "bot", text: "Hi! I’m your nutrition assistant. Ask me anything about food or calories." },
    ]);
    const [input, setInput] = useState("");
  
    const handleSend = async () => {
      if (!input.trim()) return;
  
      setMessages(prev => [...prev, { from: "user", text: input }]);
      setInput("");
  
      try {
        // Combine user input with the summary to give context
        const body = { 
          message: input, 
          summary: summary // <-- send calories, protein, carbs, fats
        };
  
        const res = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
  
        const data = await res.json();
        setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
      } catch (err) {
        setMessages(prev => [...prev, { from: "bot", text: "Error contacting AI." }]);
        console.error(err);
      }
    };
  
// export default function NutritionChat() {
//   const [messages, setMessages] = useState([
//     { from: "bot", text: "Hi! I’m your nutrition assistant. Ask me anything about food or calories." },
//   ]);
//   const [input, setInput] = useState("");

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     // Add the user's message immediately
//     setMessages(prev => [...prev, { from: "user", text: input }]);
//     setInput(""); // clear input box

//     try {
//       // Call your FastAPI backend
//       const res = await fetch("http://localhost:8000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input })
//       });

//       const data = await res.json();

//       // Add the AI's response
//       setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
//     } catch (err) {
//       setMessages(prev => [
//         ...prev,
//         { from: "bot", text: "Error contacting AI. Please try again." }
//       ]);
//       console.error(err);
//     }
//   };

  return (
    <div className="flex flex-col border rounded-lg p-4 max-w-md mx-auto bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Nutrition Chatbot</h2>
      <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.from === "bot" ? "bg-gray-200 self-start" : "bg-blue-200 self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Ask me about nutrition..."
          onKeyDown={e => e.key === "Enter" && handleSend()} // optional: send on Enter
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
