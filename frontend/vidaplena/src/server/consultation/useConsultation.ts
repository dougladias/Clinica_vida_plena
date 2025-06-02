"use server";

import { revalidatePath } from 'next/cache';
import { api } from '@/services/api.service';
import { getAuthToken, getAuthHeaders } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandler';
import { ApiResponse } from '@/types/api.type';
import { 
  Consultation,
  CreateConsultationData,
  UpdateConsultationData,
  ConsultationFilters,
  ConsultationDoctor,
  ConsultationPatient
} from '@/types/consultation.type';

// Buscar consultas com filtros
export async function getConsultations(filters?: ConsultationFilters): Promise<Consultation[]> {
  try {    
    
    let url = '/consultation';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      if (filters.date) params.append('date', filters.date);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    console.log("Fazendo requisição para:", url);
    
    const token = await getAuthToken();
    const response = await api.get<Consultation[]>(url, {
      headers: getAuthHeaders(token)   
    })

    // Normalizar datas
    const consultations = response.data.map(consultation => ({
      ...consultation,
      date: consultation.date.split('T')[0]
    }));

    console.log(`API retornou ${consultations.length} consultas`);
    return consultations;
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    return [];
  }
}

// Criar consulta
export async function handleCreateConsultation(data: CreateConsultationData): Promise<ApiResponse> {
  // Validações
  if (!data.date) {
    return { error: "Data é obrigatória" };
  }

  if (!data.time) {
    return { error: "Horário é obrigatório" };
  }

  if (!data.doctor_id) {
    return { error: "Médico é obrigatório" };
  }

  if (!data.patient_id) {
    return { error: "Paciente é obrigatório" };
  }

  // Validar se a data não é no passado
  const consultationDate = new Date(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (consultationDate < today) {
    return { error: "Não é possível agendar consulta para data passada" };
  }

  try {
    const token = await getAuthToken();
    
    await api.post('/consultation', data, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/consultation');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Atualizar consulta
export async function handleUpdateConsultation(data: UpdateConsultationData): Promise<ApiResponse> {
  if (!data.id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    // Remove campos vazios
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => 
        key === 'id' || (value !== undefined && value !== null && value !== '')
      )
    );

    await api.put(`/consultation/${data.id}`, updateData, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/consultation');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Deletar consulta
export async function handleDeleteConsultation(id: string): Promise<ApiResponse> {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/consultation/${id}`, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/consultation');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Buscar médicos para dropdown na página de consultas
export async function getDoctors(): Promise<ConsultationDoctor[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get<ConsultationDoctor[]>('/doctor', {
      headers: getAuthHeaders(token)     
    });

    console.log('Médicos carregados para consultas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar médicos para consultas:', error);
    return [];
  }
}

// Buscar pacientes para dropdown na página de consultas
export async function getPatients(): Promise<ConsultationPatient[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get<ConsultationPatient[]>('/patient', {
      headers: getAuthHeaders(token)     
    });

    console.log('Pacientes carregados para consultas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacientes para consultas:', error);
    return [];
  }
}

// Buscar consulta por ID (função útil para detalhes)
export async function getConsultationById(id: string): Promise<Consultation | null> {
  if (!id) {
    return null;
  }

  try {
    const token = await getAuthToken();
    
    const response = await api.get<Consultation>(`/consultation/${id}`, {
      headers: getAuthHeaders(token)
    });
    
    // Normalizar data
    return {
      ...response.data,
      date: response.data.date.split('T')[0]
    };
  } catch (error) {
    console.error(`Erro ao buscar consulta ${id}:`, error);
    return null;
  }
}

// Buscar consultas de um médico específico
export async function getConsultationsByDoctor(doctorId: string, date?: string): Promise<Consultation[]> {
  return getConsultations({ doctor_id: doctorId, date });
}

// Buscar consultas de um paciente específico
export async function getConsultationsByPatient(patientId: string, date?: string): Promise<Consultation[]> {
  return getConsultations({ patient_id: patientId, date });
}

// Buscar consultas de hoje
export async function getTodayConsultations(): Promise<Consultation[]> {
  const today = new Date().toISOString().split('T')[0];
  return getConsultations({ date: today });
}

// Buscar estatísticas de consultas
export async function getConsultationStats() {
  try {    
    
    // Como não temos endpoint específico de stats, buscamos todas as consultas
    const consultations = await getConsultations();
    
    const today = new Date().toISOString().split('T')[0];
    
    // Calcular estatísticas
    const todayConsultations = consultations.filter(c => 
      c.date.split('T')[0] === today
    );
    
    return {
      total: consultations.length,
      today: todayConsultations.length,
      thisWeek: consultations.filter(c => {
        const consultationDate = new Date(c.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return consultationDate >= weekAgo;
      }).length,
      thisMonth: consultations.filter(c => {
        const consultationDate = new Date(c.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return consultationDate >= monthAgo;
      }).length
    };
  } catch (error) {
    console.error('Erro ao calcular estatísticas de consultas:', error);
    return {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    };
  }
}