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

// Buscar todos os pacientes
export async function getPatients() {
  try {
    const token = await getAuthToken();
    
    const response = await api.get('/patient', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }      
    });

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

  if (!name || !cpf || !date_birth || !address || !phone) {
    return { error: "Todos os campos são obrigatórios" };
  }

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

    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err) {
    console.log(err);
    if (err.response?.data?.error) {
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

  if (!id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    const updateData: { name?: string; cpf?: string; date_birth?: string; address?: string; phone?: string } = {};
    if (name) updateData.name = name;
    if (cpf) updateData.cpf = cpf;
    if (date_birth) updateData.date_birth = date_birth;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;

    await api.put(`/patient/${id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err) {
    console.log(err);
    if (err.response?.data?.error) {
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

  try {
    const token = await getAuthToken();
    
    await api.delete(`/patient/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err) {
    console.log(err);
    if (err.response?.data?.error) {
      return { error: err.response.data.error };
    }
    return { error: "Erro ao excluir paciente" };
  }
}
