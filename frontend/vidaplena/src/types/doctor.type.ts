export interface Doctor {
  id: string;
  name: string;         
  crm: string;
  specialty: string;     
  phone: string;         
  email: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorStats {
  totalMedicos: number;
  especialidades: number;
  consultasHoje: number;
}

export interface CreateDoctorData {
  name: string;          
  crm: string;
  specialty: string;     
  phone: string;         
  email: string;
}

export interface UpdateDoctorData extends CreateDoctorData {
  id: string;
}

export interface DoctorFilters {
  name?: string;
  specialty?: string;
  crm?: string;
}

