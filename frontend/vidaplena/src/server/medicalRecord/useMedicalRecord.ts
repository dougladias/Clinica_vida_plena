"use server";

import { revalidatePath } from 'next/cache';
import { api } from '@/services/api.service';
import { getAuthToken, getAuthHeaders } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandler';
import { ApiResponse } from '@/types/api.type';
import { MedicalRecord, CreateMedicalRecordData, UpdateMedicalRecordData } from '@/types/medicalRecord.type';

// Buscar todos os prontuários médicos
export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  try {
    const token = await getAuthToken();
    
    const response = await api.get<MedicalRecord[]>('/medicalRecord', {
      headers: getAuthHeaders(token)
    });
    
    console.log('Resposta da API de prontuários:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar prontuários:', error);
    return [];
  }
}

// Criar prontuário médico
export async function handleCreateMedicalRecord(data: CreateMedicalRecordData): Promise<ApiResponse> {
  // Validações
  if (!data.consultation_id) {
    return { error: "ID da consulta é obrigatório" };
  }

  if (!data.diagnosis?.trim()) {
    return { error: "Diagnóstico é obrigatório" };
  }

  if (!data.notes?.trim()) {
    return { error: "Anotações são obrigatórias" };
  }

  try {
    const token = await getAuthToken();
    
    await api.post('/medicalRecord', data, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/medicalRecord');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Atualizar prontuário médico
export async function handleUpdateMedicalRecord(data: UpdateMedicalRecordData): Promise<ApiResponse> {
  if (!data.id) {
    return { error: "ID é obrigatório" };
  }

  if (!data.notes?.trim() && !data.diagnosis?.trim()) {
    return { error: "Pelo menos um campo deve ser fornecido para atualização" };
  }

  try {
    const token = await getAuthToken();
    
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => 
        key === 'id' || (value !== undefined && value !== null && value !== '')
      )
    );

    await api.put(`/medicalRecord/${data.id}`, updateData, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/medicalRecord');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}

// Deletar prontuário médico
export async function handleDeleteMedicalRecord(id: string): Promise<ApiResponse> {
  if (!id) {
    return { error: "ID é obrigatório" };
  }

  try {
    const token = await getAuthToken();
    
    await api.delete(`/medicalRecord/${id}`, {
      headers: getAuthHeaders(token)
    });

    revalidatePath('/pages/medicalRecord');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}