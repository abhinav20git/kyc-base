import { DocumentType } from "@/components/DocumentUpload";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export type UploadedFile = {
  file: File | null;
  type: DocumentType | null;
  preview:string | null
}