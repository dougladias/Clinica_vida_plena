"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';
import { 
  Medico, 
  MedicosStats, 
  CreateDoctorData, 
  UpdateDoctorData,
  ApiResponse
} from '@/types/doctor.type';

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

// Buscar todos os médicos
export async function getDoctors(): Promise<Medico[]> {
  try {
    const token = await getAuthToken();
    
    // Faz a requisição para a API de médicos
    const response = await api.get('/doctor', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    // Log para depuração
    console.log('Resposta da API de médicos:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar médicos:', error);
    return [];
  }
}

// Buscar estatísticas dos médicos - Ajustado para calcular localmente
export async function getDoctorStats(): Promise<MedicosStats | null> {
  try {
    const token = await getAuthToken();
    
    // Como não temos o endpoint /doctor/stats no backend,
    // vamos calcular as estatísticas diretamente com os dados dos médicos
    const response = await api.get('/doctor', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    if (response.data) {
      const medicos = response.data as Medico[];
      // Extraímos as especialidades únicas
      const especialidades = [...new Set(medicos.map(medico => medico.specialty))];
      
      // Retornamos as estatísticas calculadas
      return {
        totalMedicos: medicos.length,
        especialidades: especialidades.length,
        consultasHoje: 0 // Não temos essa informação, então deixamos zero
      };
    }
    
    return null;
  } catch (error) {
    console.log('Erro ao calcular estatísticas:', error);
    return null;
  }
}

// Criar médico
export async function handleCreateDoctor(dadosDoctor: CreateDoctorData): Promise<ApiResponse> {
  // Verifica se todos os campos estão preenchidos
  if (!dadosDoctor.nome || !dadosDoctor.crm || !dadosDoctor.especialidade || 
      !dadosDoctor.telefone || !dadosDoctor.email) {
    return { error: "Todos os campos são obrigatórios" };
  }

  try {
    const token = await getAuthToken();
    
    // Ajustando os nomes dos campos para corresponder ao backend
    await api.post('/doctor', {
      name: dadosDoctor.nome,
      crm: dadosDoctor.crm,
      specialty: dadosDoctor.especialidade,
      phone: dadosDoctor.telefone,
      email: dadosDoctor.email
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de médicos
    revalidatePath('/pages/doctor');
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
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao criar médico" };
  }
}

// Atualizar médico
export async function handleUpdateDoctor(dadosDoctor: UpdateDoctorData): Promise<ApiResponse> {
  if (!dadosDoctor.id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    // Ajustando os nomes dos campos para corresponder ao backend
    const updateData = {
      name: dadosDoctor.nome,
      crm: dadosDoctor.crm,
      specialty: dadosDoctor.especialidade,
      phone: dadosDoctor.telefone,
      email: dadosDoctor.email
    };
    
    // Faz a requisição para atualizar o médico
    await api.put(`/doctor/${dadosDoctor.id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de médicos
    revalidatePath('/pages/doctor');
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
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao atualizar médico" };
  }
}

// Deletar médico
export async function handleDeleteDoctor(id: string): Promise<ApiResponse> {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/doctor/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de médicos
    revalidatePath('/pages/doctor');
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
    // Captura erros específicos da API
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao excluir médico" };
  }
}