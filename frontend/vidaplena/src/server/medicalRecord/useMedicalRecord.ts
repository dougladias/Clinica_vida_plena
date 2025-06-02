"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';
import { 
  MedicalRecord, 
  CreateMedicalRecordDTO, 
  UpdateMedicalRecordDTO,
  ApiResponse
} from '@/types/medicalRecord.type';

// Função para obter o token de autenticação
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  // Verifica se o token existe, caso contrário redireciona para a página de login
  if (!token) {
    redirect('/auth/login');
  }
  
  return token;
}

// Buscar todos os prontuários médicos
export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  try {
    const token = await getAuthToken();
    
    // Tentamos primeiro com o endpoint correto do backend
    try {
      // Se a rota correta for '/medical-records' (com hífen)
      const response = await api.get('/medical-records', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      // Log para depuração
      console.log('Resposta da API de prontuários:', response.data);
      return response.data;
    } catch {
      // Se falhar, tentamos com '/medicalRecord' (sem hífen)
      const response = await api.get('/medicalRecord', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      // Log para depuração
      console.log('Resposta da API de prontuários (alternativo):', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Erro ao buscar prontuários:', error);
    return [];
  }
}

// Criar um novo prontuário médico
export async function handleCreateMedicalRecord(data: CreateMedicalRecordDTO): Promise<ApiResponse> {
  // Verifica se campos obrigatórios estão preenchidos
  if (!data.consultation_id || !data.diagnosis || !data.notes) {
    return { error: "Todos os campos são obrigatórios" };
  }

  try {
    const token = await getAuthToken();
    
    // Tenta criar o prontuário
    await api.post('/medicalRecord', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de prontuários
    revalidatePath('/pages/medicalRecord');
    return { success: true };
  } catch(err) {
    console.error(err);
    interface ApiError {
      response?: {
        data?: {
          error?: string;
        };
      };
    }
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao criar prontuário" };
  }
}

// Atualizar um prontuário médico
export async function handleUpdateMedicalRecord(data: UpdateMedicalRecordDTO): Promise<ApiResponse> {
  if (!data.id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    // Faz a requisição para atualizar o prontuário
    await api.put(`/medicalRecord/${data.id}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de prontuários
    revalidatePath('/pages/medicalRecord');
    return { success: true };
  } catch(err) {
    console.error(err);
    interface ApiError {
      response?: {
        data?: {
          error?: string;
        };
      };
    }
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao atualizar prontuário" };
  }
}

// Deletar um prontuário médico
export async function handleDeleteMedicalRecord(id: string): Promise<ApiResponse> {
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

    // Revalida o caminho para atualizar a lista de prontuários
    revalidatePath('/pages/medicalRecord');
    return { success: true };
  } catch(err) {
    console.error(err);
    interface ApiError {
      response?: {
        data?: {
          error?: string;
        };
      };
    }
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao excluir prontuário" };
  }
}