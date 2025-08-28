import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toast, Toaster } from "react-hot-toast";
import {
  CheckCircle,
  Upload,
  Eye,
  Shield,
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

// Modal Component
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

  const methods = [
    {
      id: "agent",
      title: "Agent-Assisted KYC",
      icon: Bot,
      gradient: "from-zinc-700 to-zinc-900",
      bgGradient: "from-zinc-800 to-zinc-900",
      borderColor: "border-zinc-600",
      iconColor: "text-zinc-300",
      textColor: "text-white",
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
      textColor : "text-black",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
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
    <h3 className={`text-lg sm:text-xl font-bold text-b ${method.textColor}`}>
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
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/50">
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

export const KYCWorkflow = () => {
  // For demonstration purposes, we'll simulate navigation
  // In your actual React Router app, uncomment the next line:
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKYCMethodSelect = (method) => {
    console.log(`Selected KYC method: ${method}`);
    
    // For demonstration - replace with actual navigation
    if (method === 'agent') {
      toast.success('Navigating to Agent-Assisted KYC');
      navigate('/kyc-agent');
    } else {
      
      toast.success('Navigating to Self-Service KYC');
      navigate('/kyc-verification');
    }
  };

  const steps = [
    { id: "upload", title: "Upload Document", icon: Upload },
    { id: "review", title: "Review & Edit", icon: Eye },
    { id: "complete", title: "Complete", icon: CheckCircle },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description:
        "Advanced OCR technology extracts data from documents in under 3 seconds",
      color: "text-yellow-500",
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description:
        "End-to-end encryption ensures your sensitive data remains protected",
      color: "text-green-500",
    },
    {
      icon: Award,
      title: "99.9% Accuracy",
      description:
        "Industry-leading accuracy with AI-powered data extraction and validation",
      color: "text-blue-500",
    },
    {
      icon: Globe,
      title: "Multi-Document Support",
      description:
        "Support for PAN cards, Aadhaar, passports, and other identity documents",
      color: "text-purple-500",
    },
  ];

  const stats = [
    { number: "1M+", label: "Documents Processed", icon: FileText },
    { number: "99.9%", label: "Accuracy Rate", icon: Award },
    { number: "<3s", label: "Processing Time", icon: Clock },
    { number: "24/7", label: "Support Available", icon: Users },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content:
        "The KYC process was incredibly smooth. What used to take hours now takes minutes!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Financial Advisor",
      content:
        "Impressed by the accuracy and speed. The interface is intuitive and professional.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Startup Founder",
      content:
        "This platform has streamlined our customer onboarding process significantly.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4 mr-2" />
                    AI-Powered KYC Solution
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Verify Identity in
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {" "}
                      Seconds
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Transform your customer onboarding with our cutting-edge OCR
                    technology. Upload documents, extract data instantly, and
                    complete KYC verification with unmatched speed and accuracy.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    Start KYC Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                    Watch Demo
                    <Eye className="w-5 h-5 ml-2" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-6 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">
                      Bank-Grade Security
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">ISO Certified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600">99.9% Uptime</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Document Verified
                        </h3>
                        <p className="text-sm text-gray-600">
                          PAN Card • 99.8% Confidence
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Name</div>
                        <div className="font-medium">RAJESH KUMAR SHARMA</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">PAN Number</div>
                        <div className="font-medium">ABCDE1234F</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">
                          Date of Birth
                        </div>
                        <div className="font-medium">15 March 1985</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-4 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our KYC Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of identity verification with our advanced
                AI-powered platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color} bg-opacity-10`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-xl text-gray-600">
                Get verified in minutes with our streamlined workflow
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {index === 0 &&
                      "Upload your PAN card or other identity document securely"}
                    {index === 1 &&
                      "Review and edit the extracted data for accuracy"}
                    {index === 2 &&
                      "Complete verification and get instant approval"}
                  </p>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full">
                      <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-blue-100">
                See what our customers say about their experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20
                   transform transition-transform duration-300
                   hover:-translate-y-3 hover:shadow-2xl cursor-pointer"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-white mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-blue-200 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied customers and experience the fastest
              KYC verification process
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              Start Your KYC Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* KYC Method Selection Modal */}
        <KYCMethodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleKYCMethodSelect}
        />
      </div>
    );
};