import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Send, Paperclip, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import React from 'react'
import axios from "axios";
import { Allow_Guest_Access, API_BASE, AWS_REGION, Identity_Pool_Id } from "@/utils/constants";
import { handleIntitialization } from "@/services/kycAiAgent.service";
import { CurrentStep, useKYCVerificationContext } from "@/context/CurrentStepContext";
import { DocumentType } from "@/components/DocumentUpload";
import { uploadDocument } from "@/api/upload";
import { fieldLabels } from "@/components/ExtractedFields";
import { Amplify } from "aws-amplify";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { useNavigate } from "react-router-dom";

interface ChatInputProps {
    onSendMessage: (message: string, file: File) => void;
    disabled?: boolean;
    fileInputRef: any
}

interface ChatMessageProps {
    message: string;
    isUser: boolean;
    timestamp?: Date;
    fileName?: String;
}

interface Message {
    id: string;
    text: string | React.ReactNode;
    isUser: boolean;
    timestamp: Date;
    fileName?: String;
    buttons?: String[]
}

const KycWithAIAgent = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { kycVerificationData, setKycVerificationData } = useKYCVerificationContext()

    const getStoredMessages = (): Message[] => {
        try {
            const stored = localStorage.getItem("messages");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    };

    const [messages, setMessages] = useState<Message[]>(getStoredMessages());


    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const [startLivenessSession, setStartLivenessSession] = useState(false);

    useEffect(() => {
        scrollToBottom();
        localStorage.setItem("messages", JSON.stringify(messages))
    }, [messages]);

    useEffect(()=>{
        if(startLivenessSession){
            scrollToBottom();
        }
    },[startLivenessSession])

    const handleSendMessage = async (text: string, file?: File) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            isUser: true,
            timestamp: new Date(),
            fileName: file?.name
        };
        setMessages(prev => [...prev, userMessage]);
        // setIsTyping(true);

    };
    const documentButtons = ["aadhaar", "passport", "pan"]
    const [isInitialized, setIsInitialized] = useState(JSON.parse(localStorage.getItem("isInitialized")) || false)
    useEffect(() => {
        if (!isInitialized) {
            const initializeAgent = async () => {
                const response = await handleIntitialization();
                const message: Message = {
                    id: String(messages.length + 1),
                    text: String(response.text),
                    timestamp: new Date(),
                    isUser: false,
                    buttons: documentButtons
                }
                setMessages((prev) => [...prev, message]);
            }
            initializeAgent();
            setIsInitialized(true);
            localStorage.setItem("isInitialized", JSON.stringify(true))
        }
    }, [isInitialized])

    
    const handleUserButtonClick = (button: any) => {
        if (documentButtons.includes(button)) {
            setKycVerificationData({ ...kycVerificationData, selectedDocumentType: button, filePreview: null, currentStep: CurrentStep.Extract, lastStep: CurrentStep.Extract });
            handleSendMessage(button);
            const message: Message = {
                id: String(messages.length + 1),
                text: String(`You have selected ${button}, now please upload your ${button} ${button != "passport" ? "card" : ""}`),
                timestamp: new Date(),
                isUser: false,
                buttons: ["upload"]
            }
            setMessages((prev) => [...prev, message])
        } else if (button == "upload") {
            fileInputRef.current?.click();
            setKycVerificationData({...kycVerificationData, currentStep: CurrentStep.Upload, lastStep: CurrentStep.Upload})
        } else if (button == "Start liveness Session") {
            setStartLivenessSession(true)
        }
    }

    return (
        <div className="flex flex-col bg-chat-background bg-zinc-900 h-[calc(100vh-110px)]">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 border-0 scrollbar-hide">
                {messages.map((message) => (
                    <div className="md:px-16">
                        <ChatMessage
                            key={message.id}
                            message={message.text}
                            isUser={message.isUser}
                            timestamp={message.timestamp}
                            fileName={message.fileName}
                        />
                        {message.buttons &&
                            message.buttons.map((button, i) => (<button className="bg-white mr-2 px-6 py-2 rounded-full font-bold capitalize shadow-md shadow-blue-400 mb-2" key={i} onClick={() => handleUserButtonClick(button)}>{button}</button>))
                        }
                    </div>

                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex items-center space-x-2 bg-chat-assistant-bubble rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
                        </div>
                    </div>
                )}
                {startLivenessSession && <LivenessSession />}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} fileInputRef={fileInputRef} messages={messages} setMessages={setMessages} />
        </div>
    );
}

export const ChatInput = ({ onSendMessage, disabled, fileInputRef, messages, setMessages }) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File>(null);
    const { kycVerificationData, setKycVerificationData } = useKYCVerificationContext()

    const handleSend = () => {
        if (message.trim() || file) {
            onSendMessage(message.trim(), file);
            setMessage("");
            setFile(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            setFile(e.target.files[0])
        }
    };

    const removeFile = () => {
        setFile(null)
    };

    useEffect(() => {
        (async function () {
            try {
                console.log("cameee")
                if (file && !kycVerificationData.filePreview) {
                    const data = await uploadDocument(file, kycVerificationData.selectedDocumentType);
                    console.log(kycVerificationData.selectedDocumentType, "selected", data.data.predicted_class.toLowerCase())
                    if (data.data.predicted_class.toLowerCase() !== kycVerificationData.selectedDocumentType) {
                        const message: Message = {
                            id: String(messages.length + 1),
                            text: String(`Wrong Document format selected! Please upload the corrrect document ${kycVerificationData.selectedDocumentType}`),
                            timestamp: new Date(),
                            isUser: false,
                            buttons: ["Upload"]
                        }
                        setMessages((prev) => [...prev, message])
                    } else {
                        const fileUrl = data.data.session.fileURL;
                        setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Extract, filePreview: fileUrl, lastStep: CurrentStep.Extract, extractedData: data.data.extracted_data });
                        const message: Message = {
                            id: String(messages.length + 1),
                            text: (`Document uploaded successfully, extracted fields are:\n${Object.entries(data.data.extracted_data)
                                .map(([field, value]) => `${field}: ${value}`)
                                .join("\n")}\nNow we will move to liveness check session.`
                            ),
                            timestamp: new Date(),
                            isUser: false,
                            buttons: ["Start liveness Session"]
                        }
                        setMessages((prev) => [...prev, message])
                    }
                }
            } catch (error) {
                console.log("error", error)
                const message: Message = {
                    id: String(messages.length + 1),
                    text: String('Something went wrong !!, ' + error.message),
                    timestamp: new Date(),
                    isUser: false,
                    buttons: ["Try Again"]
                }
                setMessages((prev) => [...prev, message])
            }
        })()
    }, [file])

    useEffect(() => {

    }, [kycVerificationData.filePreview])

    return (
        <div className="border-t border-zinc-700 bg-chat-surface px-4 py-2">
            {file && (<div className="flex items-center space-x-2 bg-chat-hover rounded-lg px-3 py-2">
                <span className="text-sm text-white truncate max-w-32">{file.name}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile()}
                    className="h-4 w-4 p-0 hover:bg-destructive/20"
                >
                    <X className="h-3 w-3 text-sky-50" />
                </Button>
            </div>
            )}

            {/* <div className="flex items-end space-x-3"> */}
            <div className="flex-1 relative md:px-16">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={disabled}
                    className="scrollbar-hide pr-24 w-full pl-4 py-2 min-h-[44px] max-h-32 resize-none bg-zinc-800 outline-none border-none  rounded-xl text-white"
                />
                <div className="flex space-x-1 absolute bottom-3 md:right-16 right-0 mr-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className="h-11 w-11 rounded-xl hover:bg-chat-hover"
                    >
                        <Paperclip className="h-4 w-4 text-sky-50" />
                    </Button>

                    <Button
                        onClick={handleSend}
                        disabled={disabled || (!message.trim() && !file)}
                        className={cn(
                            "h-10 w-10 rounded-full transition-all duration-200",
                            (!message.trim() && !file)
                                ? "bg-chat-hover text-muted-foreground"
                                : "bg-white hover:bg-white/90 text-black shadow-lg hover:shadow-glow"
                        )}
                    >
                        <Send className="h-4 w-4 text-sky-150" />
                    </Button>
                </div>
            </div>
            {/* </div> */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    );
};


export const ChatMessage = ({ message, isUser, timestamp, fileName }: ChatMessageProps) => {
    timestamp = new Date(timestamp);
    return (
        <div className={cn(
            "flex w-full mb-4 animate-in fade-in-0 slide-in-from-bottom-2",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[90%] rounded-2xl px-4 py-3 shadow-sm",
                isUser
                    ? "bg-chat-user-bubble text-primary-foreground rounded-br-md text-white font-semibold bg-zinc-800"
                    : "bg-chat-assistant-bubble  rounded-bl-md text-white font-semibold text-3xl"
            )}>
                {fileName && (
                    <div className="flex items-center space-x-2 p-2 bg-chat-hover rounded-lg">
                        <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                    </div>
                )}
                <div className="text-lg leading-relaxed whitespace-pre-wrap">{message}</div>
                {timestamp && (
                    <p className="text-xs text-muted-foreground mt-2 opacity-70 text-sky-50">
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </div>
    );
};

export default KycWithAIAgent

const amplifyConfig = {
    Auth: {
        Cognito: {
            identityPoolId: Identity_Pool_Id,
            allowGuestAccess: Allow_Guest_Access,
        },
    },
};
Amplify.configure(amplifyConfig);

const LivenessSession = () => {
    const { kycVerificationData, setKycVerificationData } = useKYCVerificationContext();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAmplifyReady, setIsAmplifyReady] = useState(false);
    const [isLoading, setIsLoading] = useState({ state: false, label: "" });
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const initAmplify = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                setIsAmplifyReady(true);
            } catch (err) {
                setError("Failed to initialize face detection.");
            }
        };
        initAmplify();
    }, []);
    const startLiveness = async () => {
        setIsLoading({ state: true, label: 'Initializing liveness checking session...' });
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/AI/start-liveness`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                credentials: "include"
            });
            console.log(res)
            const data = await res.json();
            console.log(data.data.SessionId)
            setSessionId(data.data.SessionId);
            setKycVerificationData({ ...kycVerificationData, livenessResult: null })
        } catch (e) {
            console.log(e)
            setError("Failed to start liveness session.");
        } finally {
            setIsLoading({ label: '', state: false });
        }
    };
    const checkResult = async () => {
        console.log("entered")
        if (!sessionId) return;
        setIsLoading({ state: true, label: 'Checking liveness result...' });
        console.log("entered loading")
        try {
            const res = await fetch(`${API_BASE}/AI/liveness-result/${sessionId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            console.log(res);
            const data = await res.json();
            console.log("Check result server res - ", data.data)
            // setResult(data.data);
            setKycVerificationData({ ...kycVerificationData, livenessResult: data.data })
        } catch (e) {
            console.log("entered loading 1", e)
            setError("Failed to fetch result.");
        } finally {
            setIsLoading({ state: false, label: '' });
        }
    };
    useEffect(() => {
        if (kycVerificationData.livenessResult && kycVerificationData.livenessResult.Confidence >= 75) {
            console.log("confidence", kycVerificationData.faceData?.confidence)
            compareFaces();
        }
    }, [kycVerificationData.livenessResult]);
    const compareFaces = async () => {
        const livenessImage = kycVerificationData.livenessResult?.ReferenceImage?.S3Object || kycVerificationData.livenessResult?.ReferenceImage?.Bytes;
        if (!livenessImage || !kycVerificationData.filePreview) {
            setError("Need both liveness result and Id Photo");
            return;
        }
        setIsLoading({ state: true, label: 'Comparing facial data...' });
        try {
            const response = await fetch(kycVerificationData.filePreview);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append('image', blob);
            if (kycVerificationData.livenessResult?.ReferenceImage?.S3Object) {
                formData.append('s3Bucket', kycVerificationData.livenessResult.ReferenceImage.S3Object.Bucket);
                formData.append('s3Key', kycVerificationData.livenessResult.ReferenceImage.S3Object.Name);
            } else {
                formData.append('livenessImageBytes', kycVerificationData.livenessResult.ReferenceImage.Bytes);
            }
            const res = await axios.post(
                `${API_BASE}/AI/compare-faces`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            const data = res.data;
            // setComparisonResult(data.data);
            setKycVerificationData({ ...kycVerificationData, faceData: data.data })
            console.log(data.data, "res")
            // toast({
            //   title: data.data.isMatch ? "✅ Match Found" : "❌ No Match",
            //   description: data.data.isMatch
            //     ? "Your live photo matches your ID."
            //     : `Similarity: ${data.data.confidence}% (Threshold: ${data.data.threshold}%)`
            // });
        } catch (err) {
            // toast({ title: "Error", description: err.message || "Something went wrong" });
        } finally {
            setIsLoading({ state: false, label: '' });
        }
    };
    useEffect(() => {
        if (!kycVerificationData.livenessResult?.SessionId) {
            startLiveness();
        }
    }, [kycVerificationData.livenessResult]);
    const navigate = useNavigate();
    return (
        // <div className=" bg-[#34343400] backdrop-blur-sm absolute w-screen z-30 top-16 left-0 text-black h-[calc(100vh-4rem)] p-4 flex justify-center items-center">
            <div className="bg-white w-full max-h-full max-w-md mx-auto overflow-hidden flex flex-col items-center gap-2">
                {sessionId && isAmplifyReady && !kycVerificationData.livenessResult && (
                    <div className="w-full flex flex-col items-center gap-3 overflow-hidden">
                        <p className="text-sm text-gray-500">Please position your face in the frame</p>
                        <FaceLivenessDetector
                            sessionId={sessionId}
                            region={AWS_REGION}
                            onAnalysisComplete={checkResult}
                            onError={() => setError("Face detection failed. Try again with better lighting.")}
                        />
                    </div>
                )}
                {kycVerificationData.livenessResult && (
                    <div className="w-full space-y-3">
                        <p className="font-medium text-center">
                            Liveness Status:{" "}
                            <span className={kycVerificationData.livenessResult.Confidence >= 75 ? "text-green-600" : "text-red-600"}>
                                {kycVerificationData.livenessResult.Confidence >= 75 ? "Verified Human" : "Spoofing Suspected"}
                            </span>
                        </p>

                        {(kycVerificationData.livenessResult.Confidence < 75 || !kycVerificationData.faceData?.isMatch) && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Not correct? You can:</p>
                                <div className="flex gap-3 justify-center">
                                    <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">Report</button>
                                    <button onClick={startLiveness} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm">Try Again</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {isLoading.state && <Loader label={isLoading.label} />}

                {kycVerificationData.faceData && (
                    <div className={`p-3 rounded-md ${kycVerificationData.faceData.isMatch ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        <h4 className="font-semibold">
                            {kycVerificationData.faceData.isMatch ? "✅ MATCH VERIFIED" : "❌ NO MATCH"}
                        </h4>
                        <p className="text-sm">Similarity: {Math.round(kycVerificationData.faceData.confidence)}%</p>
                        <p className="text-sm">Threshold: {kycVerificationData.faceData.threshold}%</p>
                    </div>
                )}
                {
                    kycVerificationData.faceData?.isMatch && <button onClick={() => navigate('/video-kyc')} className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm">Move to Video KYC</button>
                }
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        // </div>
    )
}