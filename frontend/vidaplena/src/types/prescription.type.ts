export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescription_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: Date;
  notes?: string;
  medications?: Medication[];
  created_at: Date;
  updated_at: Date;
}

export interface CreatePrescriptionDTO {
  patient_id: string;
  doctor_id: string;
  date: Date;
  notes?: string;
  consultationId: string;
}

export interface AddMedicationDTO {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}