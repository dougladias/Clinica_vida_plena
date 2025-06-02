export interface MedicalRecord {
  id: string;
  consultation_id: string;
  notes: string;
  diagnosis: string;
  created_at: string;
  updated_at: string;
  consultation?: {
    id: string;
    date: string;
    time: string;
    doctor: {
      id: string;
      name: string;
      specialty: string;
    };
    patient: {
      id: string;
      name: string;
      cpf: string;
    };
  };
}

export interface MedicalRecordStats {
  total: number;
  thisMonth: number;
  completedConsultations: number;
  uniquePatients: number;
}

export interface CreateMedicalRecordData {
  consultation_id: string;
  notes: string;
  diagnosis: string;
}

export interface UpdateMedicalRecordData {
  id: string;
  notes?: string;
  diagnosis?: string;
}

export interface MedicalRecordFilters {
  consultation_id?: string;
  patient_id?: string;
  doctor_id?: string;
}

export interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicalRecord: MedicalRecord | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

