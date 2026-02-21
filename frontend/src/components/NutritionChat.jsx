import React, { useState, useRef, useEffect } from "react";
import "../App.css";

export default function NutritionChat({ summary }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m your nutrition assistant. Ask me anything about food or calories." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("https://boba-production-751f.up.railway.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, summary: summary })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "Error contacting AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-avatar">🤖</div>
        <div className="chat-status-info">
          <h3>Nutrition AI</h3>
          <span className="status-online"><span className="dot"></span> Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.from}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-row bot">
            <div className="message-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me about nutrition..."
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} disabled={!input.trim()}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}