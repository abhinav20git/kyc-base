import { createContext, useContext, useEffect, useState } from "react";
import { DocumentType } from "../components/DocumentUpload";
import { ExtractedData } from "@/components/ExtractedFields";
import { ComparisonResult, LivenessResult } from "@/utils/constants";

export enum CurrentStep {
    Select = "select",
    Upload = "upload",
    Extract = "extract",
    Face = "face",
    Complete = "complete"
}

export interface KYCVerificationData {
    currentStep: CurrentStep,
    selectedDocumentType: DocumentType | null,
    filePreview: string | null,
    predictedClass: DocumentType | null,
    lastStep: CurrentStep,
    extractedData: ExtractedData | null,
    faceData: ComparisonResult | null,
    livenessResult: LivenessResult | null,
}

interface KYCVerificationContextType {
    kycVerificationData: KYCVerificationData,
    setKycVerificationData: (data: KYCVerificationData) => void
}

const KYCVerficationContext = createContext<KYCVerificationContextType | undefined>(undefined);

export const useKYCVerificationContext = () => useContext(KYCVerficationContext);

export const KYCVerificationContextProvider = ({children}) => {
    const [kycVerificationData, setKycVerificationData] = useState<KYCVerificationData>({currentStep: CurrentStep.Select, selectedDocumentType: null, filePreview: null, lastStep: CurrentStep.Select, extractedData: null, predictedClass:null, livenessResult: null, faceData: null});
      useEffect(()=>{
        const data = localStorage.getItem("kycVerificationData");
        if (data){
            setKycVerificationData(JSON.parse(data));
        };
      }, [])
      useEffect(()=>{
        localStorage.setItem("kycVerificationData", JSON.stringify(kycVerificationData));
      }, [kycVerificationData])
    return (
        <KYCVerficationContext.Provider value={{kycVerificationData, setKycVerificationData}}>
            {children}
        </KYCVerficationContext.Provider>
    )
}