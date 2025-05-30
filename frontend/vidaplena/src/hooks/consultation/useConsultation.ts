"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';
import { Consultation, ConsultationDoctor, ConsultationPatient, ApiResponse } from '@/types/consultation.type';

// Função para obter o token de autenticação
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) {
    redirect('/auth/login');
  }
  
  return token;
}

// Buscar todas as consultas com normalização de datas
export async function getConsultations(filters?: { doctor_id?: string; patient_id?: string; date?: string }): Promise<Consultation[]> {
  try {
    const token = await getAuthToken();
    
    let url = '/consultation';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      
      // Manter a data no formato original
      if (filters.date) {
        const dateObj = new Date(filters.date + 'T00:00:00');
        if (!isNaN(dateObj.getTime())) {
          params.append('date', filters.date);
        }
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    console.log("Fazendo requisição para:", url);
    
    const response = await api.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    // Define interface for raw API response
    interface ApiConsultation extends Omit<Consultation, 'date'> {
      date: string; 
    }
    
    // Normalizar datas na resposta para evitar problemas de timezone
    const consultations = response.data.map((consultation: ApiConsultation) => ({
      ...consultation,
      // Extrair apenas a parte da data (YYYY-MM-DD) ignorando timezone
      date: consultation.date.split('T')[0]
    }));

    if (!consultations || consultations.length === 0) {
      console.log('A API retornou uma lista vazia de consultas');
    } else {
      console.log(`A API retornou ${consultations.length} consultas`);
      console.log('Primeira consulta (data normalizada):', consultations[0]);
    }

    return consultations as Consultation[];
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    return [];
  }
}

// Criar consulta
export async function handleCreateConsultation(formData: FormData): Promise<ApiResponse> {
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const doctor_id = formData.get("doctor_id") as string;
  const patient_id = formData.get("patient_id") as string;
  const status = formData.get("status") as string || "Agendada";

  if (!date || !time || !doctor_id || !patient_id) {
    return { error: "Todos os campos são obrigatórios" };
  }

  try {
    const token = await getAuthToken();
    
    await api.post('/consultation', {
      date,
      time,
      doctor_id,
      patient_id,
      status
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/consultation');
    return { success: true };
  } catch(err) {
    console.log(err);
    interface ApiError {
      response?: {
        data?: {
          error?: string;
        };
      };
    }
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao criar consulta" };
  }
}

// Atualizar consulta
export async function handleUpdateConsultation(formData: FormData): Promise<ApiResponse> {
  const id = formData.get("id") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const doctor_id = formData.get("doctor_id") as string;
  const patient_id = formData.get("patient_id") as string;
  const status = formData.get("status") as string;

  if (!id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    const updateData: { 
      date?: string; 
      time?: string; 
      doctor_id?: string; 
      patient_id?: string;
      status?: string;
    } = {};
    
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (doctor_id) updateData.doctor_id = doctor_id;
    if (patient_id) updateData.patient_id = patient_id;
    if (status) updateData.status = status;
    
    await api.put(`/consultation/${id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/consultation');
    return { success: true };
  } catch(err) {
    console.log(err);
    interface ApiError {
      response?: {
        data?: {
          error?: string;
        };
      };
    }
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao atualizar consulta" };
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
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/consultation');
    return { success: true };
  } catch(err) {
    console.log(err);
    interface ApiError {
      response?: {
        data?: {
          error?: string;
        };
      };
    }
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao excluir consulta" };
  }
}

// Buscar médicos para o dropdown
export async function getDoctors(): Promise<ConsultationDoctor[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get('/doctor', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    return response.data;
  } catch (error) {
    console.log('Erro ao buscar médicos:', error);
    return [];
  }
}

// Buscar pacientes para o dropdown
export async function getPatients(): Promise<ConsultationPatient[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get('/patient', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    return response.data;
  } catch (error) {
    console.log('Erro ao buscar pacientes:', error);
    return [];
  }
}