
// Representa um médico no sistema
export interface Medico {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;
  created_at?: string;
}


// Estatísticas dos médicos
export interface MedicosStats {
  totalMedicos: number;
  especialidades: number;
  consultasHoje: number;
}


// Dados para criação de um médico
export interface CreateDoctorData {
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}


// Dados para atualização de um médico
export interface UpdateDoctorData extends CreateDoctorData {
  id: string;
}


// Resposta da API
export interface ApiResponse {
  success?: boolean;
  error?: string;
}