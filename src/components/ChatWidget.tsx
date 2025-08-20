// ChatbotWidget.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatIcon from "../images/chat-bot-icon-design-robot-600nw-2476207303.jpg.webp";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();

      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
        setTyping(false);
      }, 1000); // simulate "thinking" delay
    } catch (err) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <div>
      {/* Floating chat icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        <img src={ChatIcon} alt="Chat Icon" className="w-8 h-8" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 bg-blue-500 text-white font-bold">
              AI-KYC Assistant
            </div>

            {/* Messages */}
            <div className="p-3 h-64 overflow-y-auto bg-gray-50">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.sender === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex my-1 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl shadow-sm max-w-[70%] ${
                      m.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start my-1"
                >
                  <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-2xl rounded-bl-none shadow-sm">
                    <span className="animate-pulse">Bot is typing...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input box */}
            <div className="flex p-2 border-t bg-white">
              <input
                className="flex-1 border p-2 rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-xl shadow"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
