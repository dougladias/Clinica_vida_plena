import { Consultation } from './consultation.type';

export interface MedicalRecord {
  id: string;
  consultation_id: string;
  diagnosis: string;
  notes: string;
  created_at: string;
  updated_at: string;
  consultation?: Consultation;
}

export interface MedicalRecordStats {
  total: number;
  thisMonth: number;
  completedConsultations: number;
  uniquePatients: number;
}

export interface CreateMedicalRecordDTO {
  consultation_id: string;
  diagnosis: string;
  notes: string;
}

export interface UpdateMedicalRecordDTO {
  id: string;
  diagnosis?: string;
  notes?: string;
}

// Define and export the ApiResponse type
export interface ApiResponse {
  success?: boolean;
  error?: string;
}