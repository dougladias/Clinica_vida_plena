"use server";

import { revalidatePath } from 'next/cache';
import { api } from '@/services/api.service';
import { getAuthToken, getAuthHeaders } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandler';
import { ApiResponse } from '@/types/api.type';
import { Prescription, CreatePrescriptionData, AddMedicationData } from '@/types/prescription.type';

// Buscar todas as receitas médicas
export async function getPrescriptions(): Promise<Prescription[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get<Prescription[]>('/prescription', {
      headers: getAuthHeaders(token)
    });
    
    console.log('Resposta da API de receitas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }
}

// Buscar receita por ID
export async function getPrescriptionById(id: string): Promise<Prescription | null> {
  if (!id) {
    return null;
  }

  try {
    const token = await getAuthToken();
    
    const response = await api.get<Prescription>(`/prescription/${id}`, {
      headers: getAuthHeaders(token)
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar receita ${id}:`, error);
    return null;
  }
}

// Criar receita médica
export async function handleCreatePrescription(data: CreatePrescriptionData): Promise<ApiResponse> {
  // Validações
  if (!data.consultation_id) {
    return { error: "ID da consulta é obrigatório" };
  }

  if (!data.medications || data.medications.length === 0) {
    return { error: "Pelo menos um medicamento deve ser informado" };
  }

  // Validar cada medicamento
  for (const med of data.medications) {
    if (!med.name?.trim()) {
      return { error: "Nome do medicamento é obrigatório" };
    }
    if (!med.dosage?.trim()) {
      return { error: "Dosagem do medicamento é obrigatória" };
    }
    if (!med.instructions?.trim()) {
      return { error: "Instruções do medicamento são obrigatórias" };
    }
  }

  try {
    const token = await getAuthToken();
    
    await api.post('/prescription', data, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/prescription');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Adicionar medicamento à receita
export async function handleAddMedication(
  prescriptionId: string, 
  data: AddMedicationData
): Promise<ApiResponse> {
  if (!prescriptionId) {
    return { error: "ID da receita é obrigatório" };
  }

  if (!data.name?.trim() || !data.dosage?.trim() || !data.instructions?.trim()) {
    return { error: "Todos os campos do medicamento são obrigatórios" };
  }

  try {
    const token = await getAuthToken();
    
    await api.post(`/prescription/${prescriptionId}/medications`, data, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/prescription');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Remover medicamento da receita
export async function handleRemoveMedication(medicationId: string): Promise<ApiResponse> {
  if (!medicationId) {
    return { error: "ID do medicamento é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/prescription/medications/${medicationId}`, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/prescription');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Excluir receita médica
export async function handleDeletePrescription(id: string): Promise<ApiResponse> {
  if (!id) {
    return { error: "ID da receita é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/prescription/${id}`, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/prescription');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}