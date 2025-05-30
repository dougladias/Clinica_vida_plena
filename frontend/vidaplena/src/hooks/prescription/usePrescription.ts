"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';

// Função para obter o token de autenticação
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) {
    redirect('/auth/login');
  }
  
  return token;
}

// Buscar todos os prontuários médicos
export async function getMedicalRecords(filters?: { consultation_id?: string }) {
  try {
    const token = await getAuthToken();
    
    let url = '/medicalRecord';
    
    if (filters?.consultation_id) {
      url += `?consultation_id=${filters.consultation_id}`;
    }
    
    const response = await api.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    console.log('Prontuários recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar prontuários:', error);
    return [];
  }
}

// Criar prontuário médico
export async function handleCreateMedicalRecord(formData: FormData) {
  const consultation_id = formData.get("consultation_id") as string;
  const notes = formData.get("notes") as string;
  const diagnosis = formData.get("diagnosis") as string;

  if (!consultation_id || !notes || !diagnosis) {
    return { error: "Todos os campos são obrigatórios" };
  }

  try {
    const token = await getAuthToken();
    
    await api.post('/medicalRecord', {
      consultation_id,
      notes,
      diagnosis
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/prescription');
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
    return { error: "Erro ao criar prontuário" };
  }
}

// Atualizar prontuário médico
export async function handleUpdateMedicalRecord(formData: FormData) {
  const id = formData.get("id") as string;
  const notes = formData.get("notes") as string;
  const diagnosis = formData.get("diagnosis") as string;

  if (!id) {
    return { error: "ID é obrigatório" };
  }

  if (!notes && !diagnosis) {
    return { error: "Pelo menos um campo deve ser preenchido para atualização" };
  }

  try {
    const token = await getAuthToken();
    
    const updateData: { notes?: string; diagnosis?: string } = {};
    if (notes) updateData.notes = notes;
    if (diagnosis) updateData.diagnosis = diagnosis;
    
    await api.put(`/medicalRecord/${id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/prescription');
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
    return { error: "Erro ao atualizar prontuário" };
  }
}

// Deletar prontuário médico
export async function handleDeleteMedicalRecord(id: string) {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/medicalRecord/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/prescription');
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
    return { error: "Erro ao excluir prontuário" };
  }
}