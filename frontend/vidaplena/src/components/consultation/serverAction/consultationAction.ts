"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';

// Função para obter o token de autenticação
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  // Verifica se o token existe
  if (!token) {
    redirect('/auth/login');
  }
  
  return token;
}

// Buscar todas as consultas
export async function getConsultations(filters?: { doctor_id?: string; patient_id?: string; date?: string }) {
  try {
    const token = await getAuthToken();
    
    // Construir parâmetros de consulta
    let url = '/consultation';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      
      // Formatar a data corretamente se ela existir
      if (filters.date) {
        // Não precisamos mudar o formato, apenas garantir que é uma data válida
        const dateObj = new Date(filters.date);
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
    
    // Fazer a requisição à API
    const response = await api.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    // Verificação adicional para depuração
    if (!response.data || response.data.length === 0) {
      console.log('A API retornou uma lista vazia de consultas');
    } else {
      console.log(`A API retornou ${response.data.length} consultas`);
    }

    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    return [];
  }
}

// Criar consulta
export async function handleCreateConsultation(formData: FormData) {
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const doctor_id = formData.get("doctor_id") as string;
  const patient_id = formData.get("patient_id") as string;
  const status = formData.get("status") as string || "Agendada";

  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!date || !time || !doctor_id || !patient_id) {
    return { error: "Todos os campos são obrigatórios" };
  }

  // Verifica se a data e hora estão no formato correto
  try {
    const token = await getAuthToken();
    
    // Verifica se a data está no formato YYYY-MM-DD
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

    // Revalidar a rota para atualizar a lista de consultas
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
    // Verifica se o erro é do tipo ApiError e extrai a mensagem de erro
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao criar consulta" };
  }
}

// Atualizar consulta
export async function handleUpdateConsultation(formData: FormData) {
  const id = formData.get("id") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const doctor_id = formData.get("doctor_id") as string;
  const patient_id = formData.get("patient_id") as string;
  const status = formData.get("status") as string;

  // Verifica se o ID da consulta está presente
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  // Verifica se pelo menos um campo foi preenchido para atualização
  try {
    const token = await getAuthToken();
    
    // Verifica se pelo menos um campo foi preenchido
    const updateData: { 
      date?: string; 
      time?: string; 
      doctor_id?: string; 
      patient_id?: string;
      status?: string;
    } = {};
    
    // Preenche os campos que foram informados
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (doctor_id) updateData.doctor_id = doctor_id;
    if (patient_id) updateData.patient_id = patient_id;
    if (status) updateData.status = status;
    
    // Se nenhum campo foi preenchido, retorna erro
    await api.put(`/consultation/${id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalidar a rota para atualizar a lista de consultas
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
    // Verifica se o erro é do tipo ApiError e extrai a mensagem de erro
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao atualizar consulta" };
  }
}

// Deletar consulta
export async function handleDeleteConsultation(id: string) {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  // Verifica se o ID da consulta está presente
  try {
    const token = await getAuthToken();
    
    // Fazer a requisição para deletar a consulta
    await api.delete(`/consultation/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalidar a rota para atualizar a lista de consultas
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
    // Verifica se o erro é do tipo ApiError e extrai a mensagem de erro
    const apiError = err as ApiError;
    if (typeof err === "object" && err !== null && "response" in err && apiError.response?.data?.error) {
      return { error: apiError.response.data.error };
    }
    return { error: "Erro ao excluir consulta" };
  }
}

// Buscar médicos para o dropdown
export async function getDoctors() {
  try {
    const token = await getAuthToken();
    
    // Fazer a requisição à API para obter a lista de médicos
    const response = await api.get('/doctor', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    // Logar a resposta da API
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar médicos:', error);
    return [];
  }
}

// Buscar pacientes para o dropdown
export async function getPatients() {
  try {
    const token = await getAuthToken();
    
    // Fazer a requisição à API para obter a lista de pacientes
    const response = await api.get('/patient', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    // Logar a resposta da API
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar pacientes:', error);
    return [];
  }
}