
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  date_birth: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface PatientStats {
  total: number;
  newThisMonth: number;
  activeConsultations: number;
  activePatients: number;
}

export interface CreatePatientData {
  name: string;
  cpf: string;
  date_birth: string;
  address: string;
  phone: string;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

export interface PatientFilters {
  name?: string;
  cpf?: string;
}

export interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export interface PatientFormData {
  name: string;
  cpf: string;
  date_birth: string;
  address: string;
  phone: string;
}