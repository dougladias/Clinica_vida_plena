export interface Medication {
  id: string;
  prescription_id: string;
  name: string;
  dosage: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  consultation_id: string;
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
  medications?: Medication[];
}

export interface CreatePrescriptionData {
  consultation_id: string;
  medications: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
}

export interface AddMedicationData {
  name: string;
  dosage: string;
  instructions: string;
}

export interface UpdatePrescriptionData {
  id: string;
  consultation_id?: string;
  notes?: string;
}

export interface PrescriptionFilters {
  consultation_id?: string;
  patient_id?: string;
  doctor_id?: string;
}

export interface PrescriptionStats {
  total: number;
  thisMonth: number;
  activePrescriptions: number;
  totalMedications: number;
}

export interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

