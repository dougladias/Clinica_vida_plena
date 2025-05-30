"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';

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
export async function getDoctors() {
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

// Buscar estatísticas dos médicos
export async function getDoctorStats() {
  try {
    const token = await getAuthToken();
    
    // Faz a requisição para a API de estatísticas dos médicos
    const response = await api.get('/doctor/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Erro ao buscar estatísticas:', error);
    // Retornamos null para que o frontend possa calcular localmente se necessário
    return null;
  }
}

// Criar médico - removendo o status
export async function handleCreateDoctor(formdata: FormData) {
  const nome = formdata.get("nome") as string;
  const crm = formdata.get("crm") as string;
  const especialidade = formdata.get("especialidade") as string;
  const telefone = formdata.get("telefone") as string;
  const email = formdata.get("email") as string;

  // Removido o campo status que não existe no banco de dados
  if (!nome || !crm || !especialidade || !telefone || !email) {
    return { error: "Todos os campos são obrigatórios" };
  }

  // Verifica se o CRM já existe
  try {
    const token = await getAuthToken();
    
    // Verifica se o CRM já está cadastrado
    await api.post('/doctor', {
      name: nome,
      crm,
      specialty: especialidade,
      phone: telefone,
      email
      // Removido o status
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

// Atualizar médico - removendo o status
export async function handleUpdateDoctor(formdata: FormData) {
  const id = formdata.get("id") as string;
  const nome = formdata.get("nome") as string;
  const crm = formdata.get("crm") as string;
  const especialidade = formdata.get("especialidade") as string;
  const telefone = formdata.get("telefone") as string;
  const email = formdata.get("email") as string;
  // Removido o campo status

  if (!id) {
    return { error: "ID é obrigatório" };
  }

  // Verifica se os campos obrigatórios estão preenchidos
  try {
    const token = await getAuthToken();
    
    // Removido o campo status do objeto updateData
    const updateData: { name?: string; crm?: string; specialty?: string; phone?: string; email?: string } = {};
    if (nome) updateData.name = nome;
    if (crm) updateData.crm = crm;
    if (especialidade) updateData.specialty = especialidade;
    if (telefone) updateData.phone = telefone;
    if (email) updateData.email = email;
    
    // Faz a requisição para atualizar o médico
    await api.put(`/doctor/${id}`, updateData, {
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

// Deletar médico - sem alterações necessárias
export async function handleDeleteDoctor(id: string) {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  // Verifica se o ID é válido
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