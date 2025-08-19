// ChatbotWidget.tsx
import React, { useState } from "react";
import ChatIcon from '../images/chat-bot-icon-design-robot-600nw-2476207303.jpg.webp'

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    // Call backend API
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <div>
      {/* Floating chat icon */}
      <button 
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        <img src={ChatIcon} alt="Chat Icon" className="w-8 h-8" />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-lg rounded-lg">
          <div className="p-3 border-b font-bold">AI-KYC Assistant</div>
          <div className="p-3 h-64 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={m.sender === "user" ? "text-right" : "text-left"}>
                <p className={`my-1 p-2 rounded ${m.sender === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t">
            <input
              className="flex-1 border p-1 rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
