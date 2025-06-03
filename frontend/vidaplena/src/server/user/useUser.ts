"use server";

import { revalidatePath } from 'next/cache';
import { api } from '@/services/api.service';
import { handleApiError } from '@/lib/errorHandler';
import { ApiResponse } from '@/types/api.type';

// Interface para dados de criação de usuário
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string; 
}

// Função para registrar um novo usuário
export async function handleRegister(data: CreateUserData): Promise<ApiResponse> {
  // Validações
  if (!data.name?.trim()) {
    return { error: "Nome é obrigatório" };
  }

  if (!data.email?.trim()) {
    return { error: "Email é obrigatório" };
  }

  if (!data.email.includes('@')) {
    return { error: "Email inválido" };
  }

  if (!data.password?.trim()) {
    return { error: "Senha é obrigatória" };
  }

  if (data.password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres" };
  }

  try {
    // Adicionar o role padrão como "user" se não for especificado
    const userData = {
      ...data,
      role: data.role || "user" // Define "user" como valor padrão
    };
    
    await api.post('/user', userData);
    
    // Se a criação do usuário foi bem-sucedida, revalidate o caminho de login
    revalidatePath('/auth/login');
    return { success: true };
  } catch(err) {
    return { error: handleApiError(err) };
  }
}