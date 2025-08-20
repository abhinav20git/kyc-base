// ChatbotWidget.tsx
import React, { useState } from "react";
import ChatIcon from "../images/chat-bot-icon-design-robot-600nw-2476207303.jpg.webp";
import { FiUpload } from "react-icons/fi";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const userMessage = { sender: "user", text: input || (file ? `📎 Uploaded file: ${file.name}` : "") };
    setMessages([...messages, userMessage]);

    // Build form data (for file upload + text)
    const formData = new FormData();
    formData.append("query", input);
    if (file) {
      formData.append("file", file);
    }

    const res = await fetch("", {
      method: "POST",
      body: formData, // no headers, fetch handles FormData
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    setInput("");
    setFile(null);
  };

  return (
    <div>
      {/* Floating chat icon */}
      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        onClick={() => setOpen(!open)}
      >
        <img src={ChatIcon} alt="Chat Icon" className="w-8 h-8" />
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 bg-white shadow-2xl rounded-2xl flex flex-col 
          w-[90%] max-w-sm h-[70vh] sm:h-[28rem] transition-all animate-slideUp"
        >
          {/* Header */}
          <div className="p-3 border-b font-bold bg-blue-500 text-white rounded-t-2xl flex justify-between">
            <span>AI-KYC Assistant</span>
            <button onClick={() => setOpen(false)} className="font-bold">×</button>
          </div>

          {/* Messages */}
          <div className="p-3 flex-1 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`px-3 py-2 rounded-xl max-w-[75%] text-sm animate-fadeIn ${
                    m.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          {/* Input & File Upload */}
          <div className="flex items-center gap-2 p-2 border-t bg-white rounded-b-2xl">
            

            <input
              className="flex-1 border p-2 rounded-lg text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
            <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-sm">
              <FiUpload className="inline-block m-1" />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Show selected file name */}
          {file && (
            <div className="text-xs text-gray-600 px-3 pb-2">
              Selected: <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-in;
          }
        `}
      </style>
    </div>
  );
}
