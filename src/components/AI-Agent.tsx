import React, { useState, useRef, useEffect } from 'react';
import { 
  FiSend, 
  FiPaperclip, 
  FiUser, 
  
  FiShield, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiXCircle,
  FiUpload,
  FiCamera,
  FiFileText,
  FiSettings,
  FiMinimize2,
  FiMaximize2,
  FiMic,
  FiMicOff,
  FiImage,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiEye,
  FiLock
} from 'react-icons/fi';
import { FaRobot } from "react-icons/fa6";


interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
  quickReplies?: string[];
  isTyping?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  size: string;
  status: 'uploading' | 'uploaded' | 'verified' | 'rejected';
  url?: string;
}

interface KYCStep {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  description: string;
}

function AI_Agent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hello! I'm your AI KYC Assistant. I'll help you complete your identity verification process quickly and securely. Let's get started!",
      timestamp: new Date(),
      quickReplies: ['Start Verification', 'Learn More', 'Help']
    },
    {
      id: '2',
      type: 'bot',
      content: "To begin, I'll need to verify your identity. This process typically takes 3-5 minutes and includes:\n\n✅ Personal Information\n✅ Identity Document\n✅ Address Verification\n✅ Selfie Photo\n\nShall we begin?",
      timestamp: new Date(),
      quickReplies: ['Yes, Let\'s Start', 'What documents do I need?', 'Is this secure?']
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const kycSteps: KYCStep[] = [
    { id: '1', title: 'Personal Information', status: 'completed', description: 'Basic details verified' },
    { id: '2', title: 'Identity Document', status: 'in-progress', description: 'Upload government ID' },
    { id: '3', title: 'Address Proof', status: 'pending', description: 'Utility bill or bank statement' },
    { id: '4', title: 'Selfie Verification', status: 'pending', description: 'Live photo verification' },
    { id: '5', title: 'Final Review', status: 'pending', description: 'AI verification complete' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    addMessage({
      type: 'user',
      content: inputMessage,
      status: 'sent'
    });

    const userMsg = inputMessage.toLowerCase();
    setInputMessage('');

    // Simulate bot response
    simulateTyping(() => {
      if (userMsg.includes('start') || userMsg.includes('begin')) {
        addMessage({
          type: 'bot',
          content: "Perfect! Let's start with your personal information. Please provide your full name as it appears on your government ID.",
          quickReplies: ['Continue', 'I have questions']
        });
      } else if (userMsg.includes('document')) {
        addMessage({
          type: 'bot',
          content: "You'll need one of these government-issued documents:\n\n📄 Passport\n📄 Driver's License\n📄 National ID Card\n📄 State ID\n\nMake sure the document is:\n✅ Valid and not expired\n✅ Clear and readable\n✅ All corners visible",
          quickReplies: ['I have my document ready', 'Upload Document', 'Take Photo']
        });
      } else if (userMsg.includes('secure') || userMsg.includes('safe')) {
        addMessage({
          type: 'bot',
          content: "🔒 Your security is our top priority:\n\n✅ 256-bit SSL encryption\n✅ SOC 2 Type II certified\n✅ GDPR & CCPA compliant\n✅ Data deleted after verification\n✅ No data sharing with third parties\n\nYour information is completely safe with us!",
          quickReplies: ['That\'s reassuring', 'Start Verification', 'Learn more about privacy']
        });
      } else if (userMsg.includes('help')) {
        addMessage({
          type: 'bot',
          content: "I'm here to help! You can:\n\n💬 Ask me questions anytime\n📤 Upload documents by clicking the attachment icon\n🎤 Use voice messages\n📞 Request human support if needed\n\nWhat would you like to know?",
          quickReplies: ['Continue with KYC', 'Technical Support', 'Privacy Policy']
        });
      } else {
        addMessage({
          type: 'bot',
          content: "I understand. Let me help you with that. Would you like to continue with the verification process or do you have specific questions?",
          quickReplies: ['Continue Verification', 'Ask a Question', 'Speak to Human']
        });
      }
    });
  };

  const handleQuickReply = (reply: string) => {
    addMessage({
      type: 'user',
      content: reply,
      status: 'sent'
    });

    simulateTyping(() => {
      if (reply.includes('Start') || reply.includes('Continue')) {
        addMessage({
          type: 'bot',
          content: "Excellent! I'll guide you through each step. First, let's collect your basic information. Please tell me your full legal name.",
          quickReplies: ['John Smith', 'Enter manually', 'I need help']
        });
      } else if (reply.includes('Upload') || reply.includes('Take Photo')) {
        addMessage({
          type: 'bot',
          content: "Great! Please upload a clear photo of your government ID. Make sure all text is readable and all corners are visible in the image.",
          quickReplies: ['Upload from Gallery', 'Take New Photo', 'Need help with photo']
        });
      } else if (reply.includes('Human') || reply.includes('Support')) {
        addMessage({
          type: 'bot',
          content: "I'll connect you with a human agent. Please wait a moment while I transfer your session. In the meantime, feel free to continue with any questions.",
          quickReplies: ['Wait for Agent', 'Continue with Bot', 'Leave Message']
        });
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const attachment: Attachment = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'uploading'
    };

    addMessage({
      type: 'user',
      content: `Uploading ${file.name}...`,
      attachments: [attachment]
    });

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(0);
        
        simulateTyping(() => {
          addMessage({
            type: 'bot',
            content: "✅ Document received! I'm analyzing your ID now. This usually takes 30-60 seconds.\n\n🔍 Checking document authenticity...\n🔍 Verifying personal details...\n🔍 Cross-referencing databases...",
            quickReplies: ['Check Status', 'Upload Another', 'Continue']
          });
        }, 2000);
      }
    }, 200);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'in-progress':
        return <FiRefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'failed':
        return <FiXCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FiClock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-500/10';
      case 'in-progress':
        return 'border-blue-500 bg-blue-500/10';
      case 'failed':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-slate-600 bg-slate-700/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI KYC Assistant</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-sm">Online & Ready</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <FiSettings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                {isMinimized ? <FiMaximize2 className="w-5 h-5" /> : <FiMinimize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-800/50 border-x border-slate-700/50">
          {/* KYC Progress Sidebar */}
          <div className="w-80 bg-slate-900/50 border-r border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Verification Progress</h3>
            <div className="space-y-4">
              {kycSteps.map((step, index) => (
                <div key={step.id} className={`p-4 rounded-lg border ${getStepColor(step.status)} transition-all`}>
                  <div className="flex items-center space-x-3">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{step.title}</h4>
                      <p className="text-slate-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="mt-8 p-4 bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 rounded-lg border border-emerald-700/30">
              <div className="flex items-center space-x-3 mb-2">
                <FiLock className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Secure & Encrypted</span>
              </div>
              <p className="text-emerald-300 text-sm">Your data is protected with bank-level security</p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[600px] space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-3 max-w-lg ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          message.type === 'bot' 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                        }`}>
                          {message.type === 'bot' ? <FaRobot className="w-4 h-4 text-white" /> : <FiUser className="w-4 h-4 text-white" />}
                        </div>

                        {/* Message Content */}
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.type === 'bot' 
                            ? 'bg-slate-700 text-slate-100' 
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        }`}>
                          <p className="whitespace-pre-line">{message.content}</p>
                          
                          {/* Attachments */}
                          {message.attachments && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((attachment) => (
                                <div key={attachment.id} className="flex items-center space-x-3 p-2 bg-slate-600/30 rounded-lg">
                                  <FiFileText className="w-4 h-4 text-slate-300" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{attachment.name}</p>
                                    <p className="text-xs text-slate-400">{attachment.size}</p>
                                  </div>
                                  {attachment.status === 'uploading' && (
                                    <div className="w-4 h-4">
                                      <FiRefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Quick Replies */}
                          {message.quickReplies && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.quickReplies.map((reply, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleQuickReply(reply)}
                                  className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-full transition-colors"
                                >
                                  {reply}
                                </button>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-slate-400 mt-2">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FaRobot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-700 rounded-2xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message or ask a question..."
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {uploadProgress > 0 && (
                        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b-xl transition-all" style={{ width: `${uploadProgress}%` }}></div>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                    />
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors"
                    >
                      <FiPaperclip className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 rounded-xl transition-colors ${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      {isRecording ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                    <span>Powered by AI • End-to-end encrypted</span>
                    <div className="flex items-center space-x-4">
                      <span>Response time: ~2s</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Secure connection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/50 rounded-b-2xl border border-slate-700/50 border-t-0 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <span>🔒 SOC 2 Certified</span>
              <span>🛡️ GDPR Compliant</span>
              <span>⚡ 99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AI_Agent;