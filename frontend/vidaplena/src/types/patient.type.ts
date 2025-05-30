// Interface para o objeto Paciente
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

// Interface para estatísticas de pacientes
export interface PatientStats {
  total: number;
  newThisMonth: number;
  activeConsultations: number;
  activePatients: number;
}

// Props para o modal de paciente
export interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

// Interface para formulário de paciente
export interface PatientFormData {
  name: string;
  cpf: string;
  date_birth: string;
  address: string;
  phone: string;
}

// Interface para resposta da API
export interface ApiResponse {
  success?: boolean;
  error?: string;
}