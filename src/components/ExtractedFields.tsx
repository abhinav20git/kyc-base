import { DocumentType } from './DocumentUpload';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Download, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { UploadedFile } from '@/utils/constants';

interface ExtractedData {
  [key: string]: string;
}

interface ExtractedFieldsProps {
  documentType: DocumentType;
  data: ExtractedData;
  onVerify: () => void;
  uploadedFile: UploadedFile
}

const fieldLabels: Record<DocumentType, Record<string, string>> = {
  pan: {
    pan_number: "PAN Number",
    name: "Full Name",
    dob: "Date of Birth",
    father_name: "Father's Name",
  },
  aadhaar: {
    aadhaar_number: "Aadhaar Number",
    name: "Full Name",
    dob: "Date of Birth",
    gender: "Gender",
    address: "Address",
  },
  passport: {
    passport_number: "Passport Number",
    name: "Full Name",
    dob: "Date of Birth",
    place_of_birth: "Place of Birth",
    nationality: "Nationality",
  }
};

export function ExtractedFields({ documentType, data, onVerify, uploadedFile }: ExtractedFieldsProps) {
  const { toast } = useToast();
  
  const [extractedData, setExtractedData] = useState<ExtractedData>(
    data || {}
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setExtractedData(data);
      setLoading(false);
    }
  }, [data]);

  // Show loading state until data arrives
  if (loading) {
    return (
      <div className="space-y-6 flex flex-col">
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Processing document...</p>
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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

  const openEditDialog = (field: string, value: string) => {
    setCurrentField(field);
    setCurrentValue(value);
    setIsDialogOpen(true);
  };

  const saveEditedValue = () => {
    setExtractedData(prev => ({
      ...prev,
      [currentField]: currentValue
    }));
    setIsDialogOpen(false);
    toast({
      title: "Updated!",
      description: `${currentField} was updated successfully.`,
    });
  };

  // Show loading state if no data is available
  if (!extractedData || Object.keys(extractedData).length === 0) {
    return (
      <div className="space-y-6 flex flex-col">
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Processing document...</p>
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Extracted Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Review and edit the extracted data for accuracy
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      {
        uploadedFile.file?.type.startsWith('image/') && <img src={uploadedFile.preview} alt="" width={'420px'} height={"320px"} className='self-center rounded border-2 border-blue-500' />
      }
      {
        uploadedFile.file?.type === 'application/pdf' && (
          <iframe
            src={uploadedFile.preview}
            className="w-full h-64"
            title="PDF Preview"
          ></iframe>
        )
      }
      <Card className="bg-gradient-to-br from-card to-secondary/20 border">
        <div className="p-6 gap-4 grid grid-cols-1 md:grid-cols-2 items-center">
          {Object.entries(extractedData).map(([field, value], i, data) => {
  const label = fieldLabels[documentType]?.[field] || field; // fallback to raw key
  return (
    <div
      key={field}
      className={`h-21 flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:shadow-soft transition-shadow ${i % 2 == 0 && i + 1 == data.length ? 'md:col-span-2' : ''}`}
    >
      <div className="space-y-1 flex-1">
        <Badge variant="outline" className="text-xs">
          {label}
        </Badge>
        <p className="font-medium text-card-foreground">{value}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(value)}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openEditDialog(label, value)} // pass label instead of raw key
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
})}

        </div>
      </Card>

      {/* Verify button */}
      <div className="flex justify-center">
        <Button
          onClick={onVerify}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-8"
        >
          
          Capture Face
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {currentField}</DialogTitle>
          </DialogHeader>
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedValue}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}