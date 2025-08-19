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
import { UploadedFile } from '@/utils/constants';
import { FaceCapture } from '../FaceCapture/FaceCapture';

type Step = 'select' | 'upload' | 'extract' | 'face' | 'complete';

export function KYCApp() {
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>({file: null, type: null, preview: null});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const steps = [
  { id: 'select', label: 'Select Document', completed: currentStep !== 'select' },
  { id: 'upload', label: 'Upload Document', completed: ['extract', 'face', 'complete'].includes(currentStep) },
  { id: 'extract', label: 'Extract Data', completed: ['face', 'complete'].includes(currentStep) },
  { id: 'face', label: 'Face Detection', completed: currentStep === 'complete' },
  { id: 'complete', label: 'Complete', completed: false }
];

  const handleDocumentTypeSelect = (type: DocumentType) => {
    setSelectedDocumentType(type);
    setCurrentStep('upload');
  };

  const handleFileUpload = async (file: File, type: DocumentType) => {
    try {
      if(!file.type.startsWith('image/')){
        throw new Error('Invalid file type, please upload image')
      }
      const preview = URL.createObjectURL(file)
      setUploadedFile({file, type, preview});
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
    } catch (error) {
      toast({
      title: "Imvalid request",
      description: error.message,
    });
    }
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
    setUploadedFile({file: null, type: null, preview: null});
    setIsProcessing(false);
    setIsSuccess(false);
    setSelectedDocumentType(null);
  } else if (currentStep === 'extract') {
    setCurrentStep('upload');
  } else if (currentStep === 'face') {
    setCurrentStep('extract');
  }
};

  const getProgressValue = () => {
  switch (currentStep) {
    case 'select': return 20;
    case 'upload': return 40;
    case 'extract': return 60;
    case 'face': return 80;
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
  Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
</Badge>
            </div>
            
            <Progress value={getProgressValue()} className="mb-4" />
            
            <div className="flex items-center justify-between flex-nowrap space-x-4 overflow-x-auto">
  {steps.map((step) => (
    <div key={step.id} className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${
          step.completed
            ? 'bg-success'
            : step.id === currentStep
            ? 'bg-primary'
            : 'bg-gray-200'
        }`}
      />
      <span
        className={`text-sm ${
          step.id === currentStep
            ? 'text-foreground font-medium'
            : 'text-muted-foreground'
        }`}
      >
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
                />
              </div>
            </div>
          )}

          {currentStep === 'extract' && (
  <ExtractedFields
    documentType={selectedDocumentType}
    data={{}}
    // ✅ Instead of going to complete, go to face step
    onVerify={() => setCurrentStep('face')}
    uploadedFile={uploadedFile || undefined}
  />
)}

{currentStep === 'face' && (
  <FaceCapture 
    // ✅ After face capture, only then mark complete
    onCapture={() => handleVerifyComplete()} 
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