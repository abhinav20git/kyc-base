import { createContext, useContext, useEffect, useState } from "react";
import { DocumentType } from "../components/DocumentUpload";

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
    // filePreview: string
}

interface KYCVerificationContextType {
    kycVerificationData: KYCVerificationData,
    setKycVerificationData: (data: KYCVerificationData) => void
}

const KYCVerficationContext = createContext<KYCVerificationContextType | undefined>(undefined);

export const useKYCVerificationContext = () => useContext(KYCVerficationContext);

export const KYCVerificationContextProvider = ({children}) => {
    const [kycVerificationData, setKycVerificationData] = useState<KYCVerificationData>({currentStep: CurrentStep.Select, selectedDocumentType: null});
    useEffect(()=>{
        localStorage.setItem("kycVerificationData", JSON.stringify(kycVerificationData));
        console.log("setting current step", kycVerificationData)
    }, [kycVerificationData])
    return (
        <KYCVerficationContext.Provider value={{kycVerificationData, setKycVerificationData}}>
            {children}
        </KYCVerficationContext.Provider>
    )
}