"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';

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

// Buscar todos os pacientes
export async function getPatients() {
  try {
    const token = await getAuthToken();
    
    const response = await api.get('/patient', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

    // Log para depuração
    console.log('Resposta da API de pacientes:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar pacientes:', error);
    return [];
  }
}

// Buscar consultas ativas
export async function getActiveConsultations() {
  try {
    const token = await getAuthToken();
    
    const response = await api.get('/consultation', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Log para depuração
    return response.data;
  } catch (error) {
    console.log('Erro ao buscar consultas:', error);
    return [];
  }
}

// Criar paciente
export async function handleCreatePatient(formdata: FormData) {
  const name = formdata.get("name") as string;
  const cpf = formdata.get("cpf") as string;
  const date_birth = formdata.get("date_birth") as string;
  const address = formdata.get("address") as string;
  const phone = formdata.get("phone") as string;

  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!name || !cpf || !date_birth || !address || !phone) {
    return { error: "Todos os campos são obrigatórios" };
  }

  // Verifica se o CPF é válido (opcional, mas recomendado)
  try {
    const token = await getAuthToken();
    
    await api.post('/patient', {
      name,
      cpf,
      date_birth,
      address,
      phone
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // Revalida o caminho para atualizar a lista de pacientes
    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err: unknown) {
    console.log(err);
    if (err instanceof AxiosError && err.response?.data?.error) {
      return { error: err.response.data.error };
    }
    return { error: "Erro ao criar paciente" };
  }
}


// Atualizar paciente
export async function handleUpdatePatient(formdata: FormData) {
  const id = formdata.get("id") as string;
  const name = formdata.get("name") as string;
  const cpf = formdata.get("cpf") as string;
  const date_birth = formdata.get("date_birth") as string;
  const address = formdata.get("address") as string;
  const phone = formdata.get("phone") as string;

  // Verifica se o ID é fornecido
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  // Verifica se pelo menos um campo está preenchido
  try {
    const token = await getAuthToken();
    
    const updateData: { name?: string; cpf?: string; date_birth?: string; address?: string; phone?: string } = {};
    if (name) updateData.name = name;
    if (cpf) updateData.cpf = cpf;
    if (date_birth) updateData.date_birth = date_birth;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;

    // Verifica se há dados para atualizar
    await api.put(`/patient/${id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de pacientes
    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err: unknown) {
    console.log(err);
    if (err instanceof AxiosError && err.response?.data?.error) {
      return { error: err.response.data.error };
    }
    return { error: "Erro ao atualizar paciente" };
  }
}


// Deletar paciente - corrigir a função
export async function handleDeletePatient(id: string) {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

// Verifica se o ID é fornecido
  try {
    const token = await getAuthToken();
    
    // Faz a requisição para deletar o paciente
    await api.delete(`/patient/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Revalida o caminho para atualizar a lista de pacientes
    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err: unknown) {
    console.log(err);
    if (err instanceof AxiosError && err.response?.data?.error) {
      return { error: err.response.data.error };
    }
    return { error: "Erro ao excluir paciente" };
  }
}

