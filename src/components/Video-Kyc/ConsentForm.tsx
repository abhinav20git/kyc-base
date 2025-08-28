import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConsentFormModal = ({
  open,
  onOpenChange,
  userName,
  role,
  sessionId,
  onConsent,
}) => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
   
      navigate("/"); 
    } else {
      onOpenChange(isOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Consent Required</DialogTitle>
        </DialogHeader>
        <div className="mb-3">
          <p>Before you join the KYC video session, please review:</p>
          <ul className="mt-2 mb-2 text-xs">
            <li>
              <b>Name:</b> {userName}
            </li>
            <li>
              <b>Role:</b> {role}
            </li>
            <li>
              <b>Session ID:</b> {sessionId}
            </li>
          </ul>
          <label className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            I agree to participate and allow my location, time, IP, and consent
            to be used for compliance.
          </label>
        </div>
        <DialogFooter>
          <Button
            disabled={!checked}
            type="button"
            className="w-full"
            onClick={onConsent}
          >
            Give Consent &amp; Join Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentFormModal;


