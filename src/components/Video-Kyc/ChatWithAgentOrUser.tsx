
import React, { useCallback, useEffect, useState } from "react";

const ChatWithAgentOrUser = ({ socket, roomId, userId, agentId, role, startKyc }) => {

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(role == "customer" ? "start" : "Are you ready to start the kyc")

  const sendMessage = () => {
    socket.emit(`${role}:message`, { message: currentMessage, to: role == "agent" ? userId : agentId });
    setMessages((prev) => [...prev, { id: prev.length + 1, sender: role, text: currentMessage }])
    setCurrentMessage("")
  }

  const handler = useCallback(({ message }) => {
    console.log("msg came")
    setMessages((prev) => [...prev, {
      id: prev.length + 1,
      text: message,
      sender: role == "agent" ? "customer" : "agent"
    }])
  }, [role])

  useEffect(() => {
    if (!socket) return;

    role == "customer" ? socket.on(`agent:message`, handler) : socket.on(`customer:message`, handler)
    console.log("mounted")
    return () => {
      console.log("un")
      role == "customer" ? socket.off(`agent:message`, handler) : socket.off(`customer:message`, handler)
    }
  }, [socket, role])

  return (
    <div className="flex flex-col h-[70vh] max-h-[500px] w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-2">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 font-bold text-lg">A</div>
          <div>
            <div className="font-semibold text-gray-900">{role == "agent" ? "User" : "Agent"}</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
        </div>  
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === role ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-md ${msg.sender == role ? 'bg-blue-400 text-white' : 'bg-gray-50 text-black'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          placeholder="Type your message..."
          onChange={(e) => { setCurrentMessage(e.target.value) }}
          value={currentMessage}
          onKeyDown={(e)=>e.key === "Enter" && sendMessage}
        />
        <button
          className="text-white bg-blue-600 rounded-full px-4 py-2 text-sm font-semibold shadow hover:bg-blue-700 transition-colors"
          disabled={!role || !roomId}
          onClick={sendMessage}
        >
          Send
        </button>
        
      </div>
      {role ? <button onClick={startKyc} className="bg-blue-600 m-4 mt-0 py-2 text-white font-bold rounded-3xl hover:bg-blue-700">Start KYC</button>: ''}
    </div>
  );
};

export default ChatWithAgentOrUser;
