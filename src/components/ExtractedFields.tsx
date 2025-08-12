import { DocumentType } from './DocumentUpload';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtractedData {
  [key: string]: string;
}

interface ExtractedFieldsProps {
  documentType: DocumentType;
  data: ExtractedData;
  onVerify: () => void;
  capturedImage: string
}

const mockExtractedData: Record<DocumentType, ExtractedData> = {
  pan: {
    'PAN Number': 'ABCDE1234F',
    'Full Name': 'RAJESH KUMAR SHARMA',
    'Date of Birth': '15/06/1985',
    'Father\'s Name': 'SURESH KUMAR SHARMA'
  },
  aadhaar: {
    'Aadhaar Number': '1234-5678-9012',
    'Full Name': 'RAJESH KUMAR SHARMA',
    'Date of Birth': '15/06/1985',
    'Gender': 'Male',
    'Address': '123, MG Road, Bengaluru, Karnataka - 560001',
  },
  passport: {
    'Passport Number': 'A1234567',
    'Full Name': 'RAJESH KUMAR SHARMA',
    'Date of Birth': '15/06/1985',
    'Place of Birth': 'NEW DELHI',
    'Nationality': 'INDIAN'
  }
};

export function ExtractedFields({ documentType, data, onVerify, capturedImage }: ExtractedFieldsProps) {
  const { toast } = useToast();
  
  // Use mock data for demonstration
  const extractedData = mockExtractedData[documentType];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(extractedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentType}_extracted_data.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Data exported as JSON file",
    });
  };

  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Extracted Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Review the extracted data for accuracy
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <img src={capturedImage} alt="" width={'420px'} height={"320px"} className='self-center rounded border-2 border-blue-500'/>
      <Card className="bg-gradient-to-br from-card to-secondary/20 border">
        <div className="p-6 gap-4 grid grid-cols-1 md:grid-cols-2 items-center">
          {Object.entries(extractedData).map(([field, value], i, data) => (
            <div
              key={field}
              className={`h-20 flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:shadow-soft transition-shadow ${i % 2 == 0 && i+1 == data.length ? 'md:col-span-2': ''}`}
            >
              <div className="space-y-1 flex-1">
                <Badge variant="outline" className="text-xs">
                  {field}
                </Badge>
                <p className="font-medium text-card-foreground">{value}</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(value)}
                className="ml-4"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={onVerify}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-8"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Verify & Complete
        </Button>
      </div>
    </div>
  );
}