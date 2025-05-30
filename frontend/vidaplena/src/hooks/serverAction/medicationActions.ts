'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/services/api';

// Função para obter todas as receitas com medicamentos
export async function getPrescriptions() {
  try {
    // Assumindo que você já tem uma rota para obter prescrições
    const response = await fetch(`${api}/prescriptions`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar receitas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return { error: 'Falha ao buscar receitas' };
  }
}

// Função para adicionar um medicamento a uma receita
export async function handleAddMedication(formData: FormData) {
  try {
    const prescription_id = formData.get('prescription_id') as string;
    const name = formData.get('name') as string;
    const dosage = formData.get('dosage') as string;
    const instructions = formData.get('instructions') as string;

    if (!prescription_id || !name || !dosage || !instructions) {
      return { error: 'Todos os campos são obrigatórios' };
    }

    const response = await fetch(`${api}/medications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prescription_id,
        name,
        dosage,
        instructions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Erro ao adicionar medicamento' };
    }

    const data = await response.json();
    revalidatePath('/pages/medicalRecord');
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao adicionar medicamento:', error);
    return { error: 'Falha ao adicionar medicamento' };
  }
}

// Função para remover um medicamento
export async function handleRemoveMedication(medicationId: string) {
  try {
    const response = await fetch(`${api}/medications/${medicationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Erro ao remover medicamento' };
    }

    revalidatePath('/pages/medication');
    return { success: true };
  } catch (error) {
    console.error('Erro ao remover medicamento:', error);
    return { error: 'Falha ao remover medicamento' };
  }
}

// Função para criar uma nova receita
export async function handleCreatePrescription(consultationId: string) {
  try {
    const response = await fetch(`${api}/prescriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consultation_id: consultationId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Erro ao criar receita' };
    }

    const data = await response.json();
    revalidatePath('/pages/medication');
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    return { error: 'Falha ao criar receita' };
  }
}