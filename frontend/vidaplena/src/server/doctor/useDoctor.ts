"use server";

import { revalidatePath } from 'next/cache';
import { api } from '@/services/api.service';
import { getAuthToken, getAuthHeaders } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandler';
import { ApiResponse } from '@/types/api.type';
import { Doctor, CreateDoctorData, UpdateDoctorData, DoctorStats } from '@/types/doctor.type';

// Buscar todos os médicos
export async function getDoctors(): Promise<Doctor[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get<Doctor[]>('/doctor', {
      headers: getAuthHeaders(token)     
    });

    console.log('Resposta da API de médicos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar médicos:', error);
    return [];
  }
}

// Buscar estatísticas dos médicos
export async function getDoctorStats(): Promise<DoctorStats | null> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get<Doctor[]>('/doctor', {
      headers: getAuthHeaders(token)     
    });

    if (response.data) {
      const medicos = response.data;
      const especialidades = [...new Set(medicos.map(medico => medico.specialty))];
      
      return {
        totalMedicos: medicos.length,
        especialidades: especialidades.length,
        consultasHoje: 0 // Implementar endpoint específico no backend
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    return null;
  }
}

// Criar médico
export async function handleCreateDoctor(dadosDoctor: CreateDoctorData): Promise<ApiResponse> {
  // Validações
  if (!dadosDoctor.name?.trim()) {
    return { error: "Nome é obrigatório" };
  }

  if (!dadosDoctor.crm?.trim()) {
    return { error: "CRM é obrigatório" };
  }

  if (!dadosDoctor.specialty?.trim()) {
    return { error: "Especialidade é obrigatória" };
  }

  if (!dadosDoctor.phone?.trim()) {
    return { error: "Telefone é obrigatório" };
  }

  if (!dadosDoctor.email?.trim()) {
    return { error: "Email é obrigatório" };
  }

  if (!dadosDoctor.email.includes('@')) {
    return { error: "Email inválido" };
  }

  try {
    const token = await getAuthToken();
    
    await api.post('/doctor', dadosDoctor, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/doctor');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Atualizar médico
export async function handleUpdateDoctor(dadosDoctor: UpdateDoctorData): Promise<ApiResponse> {
  if (!dadosDoctor.id) {
    return { error: "ID é obrigatório" };
  }

  // Validações dos campos que serão atualizados
  if (dadosDoctor.email && !dadosDoctor.email.includes('@')) {
    return { error: "Email inválido" };
  }

  try {
    const token = await getAuthToken();
    
    const updateData = {
      name: dadosDoctor.name,
      crm: dadosDoctor.crm,
      specialty: dadosDoctor.specialty,
      phone: dadosDoctor.phone,
      email: dadosDoctor.email
    };
    
    await api.put(`/doctor/${dadosDoctor.id}`, updateData, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/doctor');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
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
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/doctor');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}
