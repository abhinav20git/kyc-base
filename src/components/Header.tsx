import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Menu,
  Shield,
  LogOut,
  CheckCircle,
  Upload,
  Eye,
  Zap,
  Users,
  Award,
  ArrowRight,
  FileText,
  Clock,
  Lock,
  Star,
  TrendingUp,
  Globe,
  X,
  Bot,
  User,
  MessageSquare,
  Smartphone,
  Timer,
  BrainCircuit,
  UserCheck,
  HelpCircle,
  Sparkles
} from "lucide-react";

const KYCMethodModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    // Add a small delay to show the selection visual feedback before routing
    setTimeout(() => {
      onSelect(methodId);
      onClose();
    }, 300);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const methods = [
    {
      id: "agent",
      title: "Agent-Assisted KYC",
      icon: Bot,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-zinc-900 to-zinc-700",
      borderColor: "border-zinc-600",
      iconColor: "text-white",
      textColor: "text-gray-200",
      advantages: [
        { icon: MessageSquare, text: "Real-time chat support throughout the process" },
        { icon: BrainCircuit, text: "AI-powered intelligent guidance and suggestions" },
        { icon: HelpCircle, text: "Instant resolution of queries and concerns" },
        { icon: UserCheck, text: "Expert validation and verification assistance" }
      ],
      description: "Get personalized assistance from our AI-powered agents for a seamless KYC experience."
    },
    {
      id: "manual",
      title: "Self-Service KYC",
      icon: User,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-black",
      advantages: [
        { icon: Timer, text: "Complete at your own pace and convenience" },
        { icon: Smartphone, text: "Mobile-optimized interface for easy access" },
        { icon: Lock, text: "Direct control over your data and privacy" },
        { icon: Sparkles, text: "Streamlined process with minimal steps" }
      ],
      description: "Take control of your verification process with our intuitive self-service platform."
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto flex flex-col"
        style={{
          maxHeight: '90vh',
          margin: 'auto'
        }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Choose Your KYC Method</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 pr-2">Select how you'd like to complete your KYC verification process</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {methods.map((method) => (
              <div
                key={method.id}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedMethod === method.id
                    ? `ring-4 ring-opacity-50 ${method.id === 'agent' ? 'ring-zinc-500' : 'ring-blue-300'} scale-[1.02]`
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className={`bg-gradient-to-br ${method.bgGradient} border-2 ${
                  selectedMethod === method.id 
                    ? method.id === 'agent' ? 'border-zinc-500' : 'border-blue-300'
                    : method.borderColor
                } rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full`}>
                  
                  {/* Selection Indicator */}
                  {selectedMethod === method.id && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                      <div className={`bg-gradient-to-r ${method.gradient} rounded-full p-1.5 sm:p-2 animate-in zoom-in-0 duration-200`}>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Icon and Title */}
                  <div className="flex items-start sm:items-center mb-4 sm:mb-6">
                    <div className={`bg-gradient-to-r ${method.gradient} rounded-xl sm:rounded-2xl p-3 sm:p-4 mr-3 sm:mr-4 flex-shrink-0`}>
                      <method.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-lg sm:text-xl font-bold ${method.textColor}`}>
                        {method.title}
                      </h3>
                      <p className={`text-xs sm:text-sm ${method.textColor} mt-1 leading-relaxed`}>
                        {method.description}
                      </p>
                    </div>
                  </div>

                  {/* Advantages */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className={`font-semibold ${method.textColor} text-base sm:text-lg`}>
                      Key Benefits:
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {method.advantages.map((advantage, index) => (
                        <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <div className={`bg-white rounded-lg p-1.5 sm:p-2 ${method.iconColor} bg-opacity-10 flex-shrink-0`}>
                            <advantage.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${method.iconColor}`} />
                          </div>
                          <span className={`${method.textColor} text-xs sm:text-sm leading-relaxed flex-1`}>
                            {advantage.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection Prompt */}
                  <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t ${method.id === 'agent' ? 'border-gray-500' : 'border-black/30'}`}>
                    <div className="flex items-center justify-center">
                      <div className={`px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r ${method.gradient} text-white rounded-lg font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity ${
                        selectedMethod === method.id ? 'opacity-75' : ''
                      }`}>
                        {selectedMethod === method.id ? 'Selected!' : `Select ${method.title}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKYCMethodSelect = (method) => {
    console.log(`Selected KYC method: ${method}`);
    
    // Using shadcn/ui toast syntax instead of react-hot-toast
    if (method === 'agent') {
      toast({
        title: "Success",
        description: "Navigating to Agent-Assisted KYC",
      });
      navigate('/kyc-agent');
    } else {
      toast({
        title: "Success", 
        description: "Navigating to Self-Service KYC",
      });
      navigate('/kyc-verification');
    }
  };

  useEffect(() => {
    const checkAuthState = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      setToken(storedToken && storedToken !== "undefined" ? storedToken : null);
      setUser(
        storedUser && storedUser !== "undefined"
          ? JSON.parse(storedUser)
          : null
      );
    };

    checkAuthState();

    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const handleAuthChange = () => {
      checkAuthState();
    };
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setToken(null);
      setUser(null);
      window.dispatchEvent(new Event("authStateChanged"));
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setToken(null);
      setUser(null);
      window.dispatchEvent(new Event("authStateChanged"));
      toast({
        title: "Logged Out",
        description: "You have been logged out locally.",
      });
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 w-full border-b ${isDarkTheme? 'bg-zinc-900 border-zinc-700':'bg-background/80'} backdrop-blur`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            {isDarkTheme ? <Bot className="h-5 w-5 text-primary-foreground" /> : <Shield className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h1 className="md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Asmadiya Technologies
            </h1>
            <p className={`text-sm ${isDarkTheme? 'text-gray-400':'text-gray-600'}`}>KYC Document Verification {isDarkTheme && 'with AI Assistant'}</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-4">
              {user && (
                <span className={`text-sm ${isDarkTheme? 'text-gray-300' :'text-gray-600'}`}>
                  Welcome, {user.name}
                </span>
              )}

              {/* Start KYC button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                Start KYC
              </Button>

              {/* Profile button */}
              {!isDarkTheme && <Button
                asChild
                size="sm"
                variant={isActive("/profile") ? "default" : "outline"}
              >
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>}

              {/* Logout */}
              <Button size="sm" variant="ghost" className={`${isDarkTheme? 'bg-zinc-900 text-white hover:bg-zinc-700':''}`} onClick={handleLogout}>
                <LogOut className={`w-4 h-4 mr-2`} />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button asChild size="sm" variant={isActive("/signup") ? "default" : "outline"}>
                <Link to="/signup">Register</Link>
              </Button>
              <Button asChild size="sm" variant={isActive("/login") ? "default" : "outline"}>
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        {!isOpen && (
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="flex flex-col gap-4 md:hidden fixed right-0 top-0 bg-background/95 backdrop-blur h-screen p-4 border-l min-w-[250px]">
            <div className="flex justify-between items-center mb-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Hi, {user.name}
                </span>
              )}
              <X
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>

            {token ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  Start KYC
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant={isActive("/profile") ? "default" : "outline"}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/signup">Register</Link>
                </Button>
                <Button asChild size="sm" onClick={() => setIsOpen(false)}>
                  <Link to="/login">Login</Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
      
      <KYCMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleKYCMethodSelect}
      />
    </header>
  );
};

export default Header;