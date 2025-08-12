import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  ChevronDown
} from 'lucide-react';
import { ExtractedFields } from '../../components/ExtractedDataReview/ExtractedFields';
import { KYCApp } from '../../components/DocumentUpload/KYCApp';
import { OcrExtractionResponse } from '../../types/kyc';
import { useNavigate } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

type WorkflowStep = 'home' | 'upload' | 'review' | 'complete';

export const KYCWorkflow: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('home');
  const [extractedData, setExtractedData] = useState<OcrExtractionResponse | null>(null);

  const handleUploadSuccess = (data: OcrExtractionResponse) => {
    setExtractedData(data);
    setCurrentStep('review');
  };

  const handleReviewSuccess = () => {
    setCurrentStep('complete');
  };

  const startKYC = () => {
    setCurrentStep('upload');
  };

  const steps = [
    { id: 'upload', title: 'Upload Document', icon: Upload },
    { id: 'review', title: 'Review & Edit', icon: Eye },
    { id: 'complete', title: 'Complete', icon: CheckCircle }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description: 'Advanced OCR technology extracts data from documents in under 3 seconds',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'End-to-end encryption ensures your sensitive data remains protected',
      color: 'text-green-500'
    },
    {
      icon: Award,
      title: '99.9% Accuracy',
      description: 'Industry-leading accuracy with AI-powered data extraction and validation',
      color: 'text-blue-500'
    },
    {
      icon: Globe,
      title: 'Multi-Document Support',
      description: 'Support for PAN cards, Aadhaar, passports, and other identity documents',
      color: 'text-purple-500'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Documents Processed', icon: FileText },
    { number: '99.9%', label: 'Accuracy Rate', icon: Award },
    { number: '<3s', label: 'Processing Time', icon: Clock },
    { number: '24/7', label: 'Support Available', icon: Users }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      content: 'The KYC process was incredibly smooth. What used to take hours now takes minutes!',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Financial Advisor',
      content: 'Impressed by the accuracy and speed. The interface is intuitive and professional.',
      rating: 5
    },
    {
      name: 'Amit Patel',
      role: 'Startup Founder',
      content: 'This platform has streamlined our customer onboarding process significantly.',
      rating: 5
    }
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        {/* <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
             
              {currentStep !== 'home' && (
                <button
                  onClick={() => setCurrentStep('home')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to Home
                </button>
              )}
            </div>
          </div>
        </header> */}

        {/* Home Page */}
        {currentStep === 'home' && (
          <div className="relative">
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
                          {' '}Seconds
                        </span>
                      </h1>
                      <p className="text-xl text-gray-600 leading-relaxed">
                        Transform your customer onboarding with our cutting-edge OCR technology. 
                        Upload documents, extract data instantly, and complete KYC verification 
                        with unmatched speed and accuracy.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={()=>navigate('/kyc-verification')}
                        className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        Start KYC Verification
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
                        <span className="text-sm text-gray-600">Bank-Grade Security</span>
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
                            <h3 className="font-semibold text-gray-900">Document Verified</h3>
                            <p className="text-sm text-gray-600">PAN Card • 99.8% Confidence</p>
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
                            <div className="text-sm text-gray-600">Date of Birth</div>
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
                      <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
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
                    Experience the future of identity verification with our advanced AI-powered platform
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color} bg-opacity-10`}>
                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600">
                        {index === 0 && "Upload your PAN card or other identity document securely"}
                        {index === 1 && "Review and edit the extracted data for accuracy"}
                        {index === 2 && "Complete verification and get instant approval"}
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
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-white mb-6 leading-relaxed">
            "{testimonial.content}"
          </p>
          <div>
            <div className="font-semibold text-white">{testimonial.name}</div>
            <div className="text-blue-200 text-sm">{testimonial.role}</div>
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
                  Join thousands of satisfied customers and experience the fastest KYC verification process
                </p>
                <button
                  onClick={startKYC}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  Start Your KYC Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>

            {/* Footer */}
            {/* <footer className="bg-gray-900 border-t border-gray-800 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  
                </div> */}
              {/* </div> */}
              </div>
          //   </footer> */}
          // </div>
        )}

        {/* Progress Steps (for non-home pages) */}
        {currentStep !== 'home' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : isActive
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={`mx-4 h-0.5 w-12 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 'upload' && (
              <KYCApp onUploadSuccess={handleUploadSuccess} />
            )}

            {currentStep === 'review' && extractedData && (
              <ExtractedFields
                extractedData={extractedData}
                onSaveSuccess={handleReviewSuccess}
              />
            )}

            {currentStep === 'complete' && (
              <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    KYC Verification Complete!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your PAN card details have been successfully verified and saved. 
                    Our team will review your application within 24-48 hours.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      <strong>Reference ID:</strong> {extractedData?.id}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
};