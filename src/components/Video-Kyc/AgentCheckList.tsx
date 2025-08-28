
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

const BACKEND_URL = 'https://kcx21158-3001.inc1.devtunnels.ms/';

const AgentChecklist = ({ onSubmit, disabled, sessionId, token }) => {
  const [checklist, setChecklist] = useState([
    { id: 1, item: "Face matches ID document", status: null, notes: "" },
    { id: 2, item: "Customer stated name verbally", status: null, notes: "" },
    { id: 3, item: "Date of birth confirmed", status: null, notes: "" },
    { id: 4, item: "Address verification", status: null, notes: "" },
    { id: 5, item: "Liveness check completed", status: null, notes: "" },
    { id: 6, item: "Document security features visible", status: null, notes: "" }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateChecklistItem = (id, field, value) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    const allCompleted = checklist.every(item => item.status !== null);
    if (!allCompleted) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ checklist })
      });

      if (response.ok || true) { 
        onSubmit(checklist);
      }
    } catch (error) {
      console.error('Submission error:', error);
   
      onSubmit(checklist);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          KYC Verification Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checklist.map(item => (
          <div key={item.id} className="space-y-2 p-3 border rounded">
            <div className="text-sm font-medium">{item.item}</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={item.status === true ? "default" : "outline"}
                onClick={() => updateChecklistItem(item.id, 'status', true)}
                disabled={disabled || isSubmitting}
                className={item.status === true ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <CheckCircle className="h-4 w-4" />
                Pass
              </Button>
              <Button
                size="sm"
                variant={item.status === false ? "destructive" : "outline"}
                onClick={() => updateChecklistItem(item.id, 'status', false)}
                disabled={disabled || isSubmitting}
              >
                <XCircle className="h-4 w-4" />
                Fail
              </Button>
            </div>
            <Input
              placeholder="Notes (optional)"
              value={item.notes}
              onChange={(e) => updateChecklistItem(item.id, 'notes', e.target.value)}
              disabled={disabled || isSubmitting}
              className="text-xs"
            />
          </div>
        ))}
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={disabled || isSubmitting || checklist.some(item => item.status === null)}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Verification'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentChecklist;