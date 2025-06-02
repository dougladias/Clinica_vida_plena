import { Medico } from './doctor.type';
import { Patient } from './patient.type';

// Interface para representar o médico em uma consulta
export interface ConsultationDoctor {
  id: string;
  name: string;
  specialty?: string;
  crm?: string;
  email?: string;
  phone?: string;
}

// Interface para representar o paciente em uma consulta
export interface ConsultationPatient {
  id: string;
  name: string;
  cpf?: string;
  birthdate?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Interface principal para consulta
export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: string;
  type?: string;
  notes?: string;
  patient?: Patient;
  medico?: Medico;
  created_at: string;
  updated_at: string;
}

// Interface para estatísticas de consultas
export interface ConsultationStats {
  total: number;
  today: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  canceled: number;
}

// Props para o modal de consulta
export interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
  doctors: ConsultationDoctor[];
  patients: ConsultationPatient[];
}

// Interface para formulário de consulta
export interface ConsultationFormData {
  id?: string;
  date: string;
  time: string;
  doctor_id: string;
  patient_id: string;
  status: string;
}

// Interface para resposta da API
export interface ApiResponse {
  success?: boolean;
  error?: string;
}