export interface ConsultationDoctor {
  id: string;
  name: string;
  specialty?: string;
  crm?: string;
  email?: string;
  phone?: string;
}

export interface ConsultationPatient {
  id: string;
  name: string;
  cpf?: string;
  date_birth?: string;
  address?: string;
  phone?: string;
}

export interface Consultation {
  id: string;
  date: string;
  time: string;
  doctor_id: string;
  patient_id: string;
  doctor?: ConsultationDoctor;
  patient?: ConsultationPatient;
  status: 'Agendada' | 'Em Andamento' | 'Concluída' | 'Cancelada';
  created_at: string;
  updated_at: string;
}

export interface CreateConsultationData {
  date: string;
  time: string;
  doctor_id: string;
  patient_id: string;
}

export interface UpdateConsultationData extends Partial<CreateConsultationData> {
  id: string;
}

export interface ConsultationFilters {
  doctor_id?: string;
  patient_id?: string;
  date?: string;
}

export interface ConsultationStats {
  total: number;
  today: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  canceled: number;
}

export interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
  doctors: ConsultationDoctor[];
  patients: ConsultationPatient[];
}

export interface ConsultationFormData {
  id?: string;
  date: string;
  time: string;
  doctor_id: string;
  patient_id: string;
}
