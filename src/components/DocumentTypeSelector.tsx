import { DocumentType } from './DocumentUpload';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, FileText, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType;
  onTypeSelect: (type: DocumentType) => void;
}

const documentTypes = [
  {
    type: 'pan' as DocumentType,
    label: 'PAN Card',
    description: 'Permanent Account Number',
    icon: CreditCard,
    fields: ['PAN Number', 'Full Name', 'Date of Birth', 'Father\'s Name']
  },
  {
    type: 'aadhaar' as DocumentType,
    label: 'Aadhaar Card',
    description: 'Aadhaar Identity Card',
    icon: FileText,
    fields: ['Aadhaar Number', 'Full Name', 'Date of Birth', 'Address', 'Gender']
  },
  {
    type: 'passport' as DocumentType,
    label: 'Passport',
    description: 'Indian Passport',
    icon: Book,
    fields: ['Passport Number', 'Full Name', 'Date of Birth', 'Place of Birth', 'Nationality']
  }
];

export function DocumentTypeSelector({ selectedType, onTypeSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Select Document Type</h2>
        <p className="text-muted-foreground">Choose the type of document you want to verify</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documentTypes.map((doc) => {
          const IconComponent = doc.icon;
          const isSelected = selectedType === doc.type;
          
          return (
            <Card
              key={doc.type}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5 shadow-md" 
                  : "hover:shadow-medium"
              )}
              onClick={() =>{ 
                console.log(doc.type)
                onTypeSelect(doc.type)}}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <IconComponent className={cn(
                    "w-8 h-8",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  {isSelected && <Badge variant="default">Selected</Badge>}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-card-foreground">{doc.label}</h3>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Fields to extract:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {doc.fields.map((field) => (
                      <Badge key={field} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}