import { useEffect, useState } from 'react';
import { DocumentTypeSelector } from '../DocumentTypeSelector';
import { DocumentUpload, DocumentType } from '../DocumentUpload';
import { KYCVerificationData } from '@/context/CurrentStepContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UploadedFile } from '@/utils/constants';
import { CameraCapture } from '../CameraCapture';
import ChatbotWidget from '../ChatWidget';
import { uploadDocument } from '@/api/upload';
import { ExtractedFields } from '../ExtractedFields';
import { CurrentStep, useKYCVerificationContext } from '@/context/CurrentStepContext';

// type Step = 'select' | 'upload' | 'extract' | 'face' | 'complete';

export function KYCApp() {
  const { kycVerificationData, setKycVerificationData } = useKYCVerificationContext()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>({ file: null, type: null, preview: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const steps = [

    { id: 'select', label: 'Select Document', completed: kycVerificationData.currentStep !== 'select' },
    { id: 'upload', label: 'Upload Document', completed: ['extract', 'face', 'complete'].includes(kycVerificationData.currentStep) },
    { id: 'extract', label: 'Extract Data', completed: ['face', 'complete'].includes(kycVerificationData.currentStep) },
    { id: 'face', label: 'Face Detection', completed: kycVerificationData.currentStep === 'complete' },
    { id: 'complete', label: 'Complete', completed: false }
  ];


  const handleDocumentTypeSelect = (type: DocumentType) => {
    console.log("type selected", type)
    if(kycVerificationData.selectedDocumentType != type){
      setKycVerificationData({ filePreview: null, predictedClass: null, extractedData: null, selectedDocumentType: type, currentStep: CurrentStep.Upload, lastStep: CurrentStep.Upload, faceData: null, livenessResult: null });
    } else if(kycVerificationData.lastStep == 'select'){
      setKycVerificationData({ ...kycVerificationData, selectedDocumentType: type, currentStep: CurrentStep.Upload, lastStep: CurrentStep.Upload });
    } else {
      setKycVerificationData({ ...kycVerificationData, selectedDocumentType: type, currentStep: CurrentStep.Upload });
    }
  };

  const handleFileUpload = async (file: File, type: DocumentType) => {
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Invalid file type, please upload image");
      }
      // const preview = URL.createObjectURL(file);


      setIsProcessing(true);

      const data = await uploadDocument(file, type);
      const fileUrl = data.data.session.fileURL;
      console.log(data, "data.data", data.data)
      setUploadedFile({ file, type, preview: fileUrl, });
      if (data.data.predicted_class.toLowerCase() !== type) {
        toast({
          title: "Wrong Document format selected!",
          description: "You have selected wrong format for this document type.",
        });
        setIsProcessing(false);
        setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Upload, lastStep: CurrentStep.Upload, predictedClass: data.data.predicted_class.toLowerCase() });
        return;
      }
      setIsProcessing(false);
      setIsSuccess(true);
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Extract, filePreview: fileUrl, lastStep: CurrentStep.Extract, extractedData: data.data.extracted_data });

      toast({
        title: "Document processed successfully!",
        description: "All fields have been extracted automatically.",
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Invalid request",
        description: (error as Error).message,
      });
    }
  };

  const handleExtractComplete = () => {
    setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Face, lastStep: CurrentStep.Face });
    toast({
      title: "Data Extraction Complete!",
      description: "Moving to capture step for verification.",
    });
  };

  const handleCaptureComplete = () => {
    setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Complete, lastStep: CurrentStep.Complete });
    toast({
      title: "KYC Verification Complete!",
      description: "Your document has been verified successfully.",
    });
  };

  const handleBack = () => {
    if (kycVerificationData.currentStep === 'upload') {
      // setKycVerificationData({ ...kycVerificationData, selectedDocumentType: null, currentStep: CurrentStep.Select });
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Select });
      setUploadedFile({ file: null, type: null, preview: null });
      setIsProcessing(false);
      setIsSuccess(false);
    } else if (kycVerificationData.currentStep === 'extract') {
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Upload });
    } else if (kycVerificationData.currentStep === 'face') {
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Extract });
    }
  };

  const handleNext = () => {
    if (kycVerificationData.currentStep === 'select' && kycVerificationData.lastStep !== 'select') {
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Upload });
      // setKycVerificationData({ ...kycVerificationData, selectedDocumentType: null, currentStep: CurrentStep.Select });
      setUploadedFile({ file: null, type: null, preview: null });
      setIsProcessing(false);
      setIsSuccess(false);
    } else if (kycVerificationData.currentStep === 'upload' && kycVerificationData.lastStep !== 'upload') {
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Extract });
    } else if (kycVerificationData.currentStep === 'extract' && kycVerificationData.lastStep !== 'extract') {
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Face });
    } else if (kycVerificationData.currentStep === 'face' && kycVerificationData.lastStep !== 'face') {
      setKycVerificationData({ ...kycVerificationData, currentStep: CurrentStep.Complete });
    }
  };


  const getProgressValue = () => {
    switch (kycVerificationData.currentStep) {
      case 'select': return 20;
      case 'upload': return 40;
      case 'extract': return 60;
      case 'face': return 80;
      case 'complete': return 100;
      default: return 0;
    }
  };

  

  useEffect(() => {
    setIsSuccess(kycVerificationData.filePreview ? true : false)
  }, [kycVerificationData])

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

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
                Step {steps.findIndex(s => s.id === kycVerificationData.currentStep) + 1} of {steps.length}
              </Badge>
            </div>

            <Progress value={getProgressValue()} className="mb-4" />

            <div className="flex items-center justify-between flex-nowrap space-x-4 overflow-x-auto">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${step.completed
                      ? 'bg-success'
                      : step.id === kycVerificationData.currentStep
                        ? 'bg-primary'
                        : 'bg-gray-200'
                      }`}
                  />
                  <span
                    className={`text-sm ${step.id === kycVerificationData.currentStep
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


        {kycVerificationData.currentStep !== 'complete' && (
          <div className={`${kycVerificationData.currentStep == 'select' ? 'justify-end':"justify-between"} mb-6 flex`}>
            {kycVerificationData.currentStep !== 'select' &&
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              }
            {
              kycVerificationData.currentStep !== kycVerificationData.lastStep && (
                <Button variant="outline" onClick={handleNext}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Next
                </Button>
              )
            }
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {kycVerificationData.currentStep === 'select' && (
            <DocumentTypeSelector
              selectedType={kycVerificationData.selectedDocumentType}
              onTypeSelect={handleDocumentTypeSelect}
            />
          )}

          {kycVerificationData.currentStep === 'upload' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                {
                  kycVerificationData.filePreview ? "" :
                    (<>
                      <h2 className="text-2xl font-bold text-foreground">Upload Document</h2>
                      <p className="text-muted-foreground">
                        Upload your {kycVerificationData.selectedDocumentType.toUpperCase()} document for verification
                      </p>
                    </>)
                }
              </div>

              <div className="max-w-md mx-auto">
                <DocumentUpload
                  documentType={kycVerificationData.selectedDocumentType}
                  onFileUpload={handleFileUpload}
                  uploadedFile={uploadedFile || undefined}
                  isProcessing={isProcessing}
                  isSuccess={isSuccess}
                />
              </div>
            </div>
          )}

          {kycVerificationData.currentStep === 'extract' && (
            <ExtractedFields
              documentType={kycVerificationData.selectedDocumentType}
              onVerify={handleExtractComplete}
              uploadedFile={uploadedFile || undefined}
            />
          )}
          {kycVerificationData.currentStep === 'face' && (
            <CameraCapture
              // idPhoto={uploadedFile.file}
              idPhoto={kycVerificationData.filePreview}
            />
          )}

          {kycVerificationData.currentStep === 'complete' && (
            <Card className="max-w-md mx-auto bg-gradient-to-br from-success/10 to-primary/5 border-success/20">
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Verification Complete!</h3>
                  <p className="text-muted-foreground">
                    Your {kycVerificationData.selectedDocumentType?.toUpperCase()} document has been successfully verified and processed.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Document Type:</span>
                      <Badge variant="default">{kycVerificationData.selectedDocumentType.toUpperCase()}</Badge>
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
        {/* <ChatbotWidget/> */}
      </div>

    </div>
  );
}