"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';
import { Prescription } from '@/types/prescription.type';

// Interface para respostas da API
export interface ApiResponse {
  success?: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

// Interface para adicionar medicamento
interface AddMedicationDTO {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

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

// Buscar todas as receitas médicas
export async function getPrescriptions(): Promise<Prescription[]> {
  try {
    const token = await getAuthToken();
    
    // Tentamos primeiro com o endpoint correto do backend
    try {
      // Tenta com '/prescription' (singular)
      const response = await api.get('/prescription', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      // Log para depuração
      console.log('Resposta da API de receitas:', response.data);
      return response.data;
    } catch {
      // Se falhar, tentamos com '/prescriptions' (plural)
      try {
        const response = await api.get('/prescriptions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        console.log('Resposta da API de receitas (alternativo):', response.data);
        return response.data;
      } catch {
        // Se ambos falharem, tentamos um endpoint mais específico
        const response = await api.get('/medical/prescription', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        console.log('Resposta da API de receitas (fallback):', response.data);
        return response.data;
      }
    }
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }
}

// Adicionar medicamento à receita
export async function handleAddMedication(
  prescriptionId: string, 
  data: AddMedicationDTO
): Promise<ApiResponse> {
  if (!prescriptionId) {
    return { error: "ID da receita é obrigatório" };
  }

  if (!data.name || !data.dosage || !data.frequency || !data.duration) {
    return { error: "Todos os campos do medicamento são obrigatórios" };
  }

  try {
    const token = await getAuthToken();
    
    // Tenta adicionar o medicamento
    const response = await api.post(`/prescription/${prescriptionId}/medication`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de receitas
    revalidatePath('/pages/prescription');
    return { success: true, data: response.data };
  } catch(err) {
    console.error('Erro ao adicionar medicamento:', err);
    
    interface ApiError {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
        status?: number;
      };
    }
    
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err) {
      const errorMessage = apiError.response?.data?.error || 
                          apiError.response?.data?.message || 
                          `Erro ${apiError.response?.status || 'desconhecido'}`;
      return { error: errorMessage };
    }
    
    return { error: "Erro ao adicionar medicamento à receita" };
  }
}

// Remover medicamento da receita
export async function handleRemoveMedication(medicationId: string): Promise<ApiResponse> {
  if (!medicationId) {
    return { error: "ID do medicamento é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    // Tentamos primeiro com o endpoint padrão
    try {
      await api.delete(`/prescription/medication/${medicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      // Se falhar, tentamos um endpoint alternativo
      await api.delete(`/medication/${medicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }

    // Revalida o caminho para atualizar a lista de receitas
    revalidatePath('/pages/prescription');
    return { success: true };
  } catch(err) {
    console.error('Erro ao remover medicamento:', err);
    
    interface ApiError {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
      };
    }
    
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err) {
      const errorMessage = apiError.response?.data?.error || apiError.response?.data?.message;
      if (errorMessage) {
        return { error: errorMessage };
      }
    }
    
    return { error: "Erro ao remover medicamento" };
  }
}

// Buscar receita por ID
export async function getPrescriptionById(id: string): Promise<Prescription | null> {
  if (!id) {
    console.error('ID da receita não fornecido');
    return null;
  }

  try {
    const token = await getAuthToken();
    
    const response = await api.get(`/prescription/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar receita ${id}:`, error);
    return null;
  }
}

// Criar uma nova receita
interface CreatePrescriptionDTO {
  patientId: string;
  doctorId: string;
  medications: AddMedicationDTO[];
  notes?: string;
}

export async function handleCreatePrescription(data: CreatePrescriptionDTO): Promise<ApiResponse> {
  try {
    const token = await getAuthToken();
    
    const response = await api.post('/prescription', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de receitas
    revalidatePath('/pages/prescription');
    return { success: true, data: response.data };
  } catch(err) {
    console.error('Erro ao criar receita:', err);
    
    interface ApiError {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
      };
    }
    
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err) {
      const errorMessage = apiError.response?.data?.error || apiError.response?.data?.message;
      if (errorMessage) {
        return { error: errorMessage };
      }
    }
    
    return { error: "Erro ao criar receita" };
  }
}

// Excluir uma receita
export async function handleDeletePrescription(id: string): Promise<ApiResponse> {
  if (!id) {
    return { error: "ID da receita é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/prescription/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de receitas
    revalidatePath('/pages/prescription');
    return { success: true };
  } catch(err) {
    console.error('Erro ao excluir receita:', err);
    
    interface ApiError {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
      };
    }
    
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err) {
      const errorMessage = apiError.response?.data?.error || apiError.response?.data?.message;
      if (errorMessage) {
        return { error: errorMessage };
      }
    }
    
    return { error: "Erro ao excluir receita" };
  }
}