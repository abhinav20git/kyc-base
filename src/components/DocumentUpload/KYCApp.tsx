import { useState } from 'react';
import { DocumentTypeSelector } from '../DocumentTypeSelector';
import { DocumentUpload, DocumentType } from '../DocumentUpload';
import { ExtractedFields } from '../ExtractedFields';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Step = 'select' | 'upload' | 'extract' | 'complete';

export function KYCApp() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 'select', label: 'Select Document', completed: currentStep !== 'select' },
    { id: 'upload', label: 'Upload Document', completed: ['extract', 'complete'].includes(currentStep) },
    { id: 'extract', label: 'Extract Data', completed: currentStep === 'complete' },
    { id: 'complete', label: 'Complete', completed: false }
  ];

  const handleDocumentTypeSelect = (type: DocumentType) => {
    setSelectedDocumentType(type);
    setCurrentStep('upload');
    setCapturedImage(null)
  };

  const handleFileUpload = async (file: File, type: DocumentType) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setCurrentStep('extract');
      toast({
        title: "Document processed successfully!",
        description: "All fields have been extracted automatically.",
      });
    }, 3000);
  };

  const handleVerifyComplete = () => {
    setCurrentStep('complete');
    toast({
      title: "KYC Verification Complete!",
      description: "Your document has been verified successfully.",
    });
  };

  const handleBack = () => {
    if (currentStep === 'upload') {
      setCurrentStep('select');
      setUploadedFile(null);
      setIsProcessing(false);
      setIsSuccess(false);
      setSelectedDocumentType(null)
    } else if (currentStep === 'extract') {
      setCurrentStep('upload');
    }
  };

  const getProgressValue = () => {
    switch (currentStep) {
      case 'select': return 25;
      case 'upload': return 50;
      case 'extract': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              KYC Document Verification
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Secure and automated identity document verification with AI-powered data extraction
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8 bg-gradient-to-r from-card to-secondary/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground">Verification Progress</h3>
              <Badge variant="outline" className="bg-primary/10">
                Step {Math.min(steps.findIndex(s => s.id === currentStep) + 1, 4)} of 4
              </Badge>
            </div>
            
            <Progress value={getProgressValue()} className="mb-4" />
            
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    step.completed ? 'bg-success' :
                    step.id === currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                  <span className={`text-sm ${
                    step.id === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Back Button */}
        {currentStep !== 'select' && currentStep !== 'complete' && (
          <div className="mb-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 'select' && (
            <DocumentTypeSelector
              selectedType={selectedDocumentType}
              onTypeSelect={handleDocumentTypeSelect}
            />
          )}

          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Upload Document</h2>
                <p className="text-muted-foreground">
                  Upload your {selectedDocumentType.toUpperCase()} document for verification
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <DocumentUpload
                  documentType={selectedDocumentType}
                  onFileUpload={handleFileUpload}
                  uploadedFile={uploadedFile || undefined}
                  isProcessing={isProcessing}
                  isSuccess={isSuccess}
                  setCapturedImage={setCapturedImage}
                  capturedImage={capturedImage}
                />
              </div>
            </div>
          )}

          {currentStep === 'extract' && (
            <ExtractedFields
              documentType={selectedDocumentType}
              data={{}}
              onVerify={handleVerifyComplete}
              capturedImage={capturedImage}
            />
          )}

          {currentStep === 'complete' && (
            <Card className="max-w-md mx-auto bg-gradient-to-br from-success/10 to-primary/5 border-success/20">
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Verification Complete!</h3>
                  <p className="text-muted-foreground">
                    Your {selectedDocumentType.toUpperCase()} document has been successfully verified and processed.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Document Type:</span>
                      <Badge variant="default">{selectedDocumentType.toUpperCase()}</Badge>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full"
                    variant="outline"
                  >
                    Verify Another Document
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}