"use server";

import { revalidatePath } from 'next/cache';
import { api } from '@/services/api.service';
import { getAuthToken, getAuthHeaders } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandler';
import { ApiResponse } from '@/types/api.type';
import { 
  Patient, 
  CreatePatientData, 
  UpdatePatientData 
} from '@/types/patient.type';

// Buscar todos os pacientes
export async function getPatients(): Promise<Patient[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get<Patient[]>('/patient', {
      headers: getAuthHeaders(token)     
    });

    console.log('Resposta da API de pacientes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return [];
  }
}

// Criar paciente
export async function handleCreatePatient(data: CreatePatientData): Promise<ApiResponse> {
  // Validações
  if (!data.name?.trim()) {
    return { error: "Nome é obrigatório" };
  }

  if (!data.cpf?.trim()) {
    return { error: "CPF é obrigatório" };
  }

  if (!data.date_birth) {
    return { error: "Data de nascimento é obrigatória" };
  }

  if (!data.address?.trim()) {
    return { error: "Endereço é obrigatório" };
  }

  if (!data.phone?.trim()) {
    return { error: "Telefone é obrigatório" };
  }

  // Validação básica de CPF (11 dígitos)
  const cleanCPF = data.cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) {
    return { error: "CPF deve ter 11 dígitos" };
  }

  try {
    const token = await getAuthToken();
    
    await api.post('/patient', data, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Atualizar paciente
export async function handleUpdatePatient(data: UpdatePatientData): Promise<ApiResponse> {
  if (!data.id) {
    return { error: "ID é obrigatório" };
  }

  // Validações condicionais
  if (data.cpf) {
    const cleanCPF = data.cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) {
      return { error: "CPF deve ter 11 dígitos" };
    }
  }

  try {
    const token = await getAuthToken();
    
    // Remove campos vazios e o ID para o body
    const { id, ...updateData } = data;
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    );

    await api.put(`/patient/${id}`, cleanedData, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Deletar paciente
export async function handleDeletePatient(id: string): Promise<ApiResponse> {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/patient/${id}`, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/patient');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Buscar paciente por ID
export async function getPatientById(id: string): Promise<Patient | null> {
  if (!id) {
    return null;
  }

  try {
    const token = await getAuthToken();
    
    const response = await api.get<Patient>(`/patient/${id}`, {
      headers: getAuthHeaders(token)
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar paciente ${id}:`, error);
    return null;
  }
}

// Buscar estatísticas de pacientes
export async function getPatientStats() {
  try {
    const patients = await getPatients();
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const newThisMonth = patients.filter(patient => {
      const createdDate = new Date(patient.created_at);
      return createdDate.getMonth() === currentMonth && 
             createdDate.getFullYear() === currentYear;
    }).length;

    return {
      total: patients.length,
      newThisMonth,
      activeConsultations: 0, // Por enquanto 0, pode ser implementado posteriormente
      activePatients: patients.length
    };
  } catch (error) {
    console.error('Erro ao calcular estatísticas de pacientes:', error);
    return {
      total: 0,
      newThisMonth: 0,
      activeConsultations: 0,
      activePatients: 0
    };
  }
}