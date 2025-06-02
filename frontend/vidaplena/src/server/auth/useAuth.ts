"use server";

import { redirect } from 'next/navigation';
import { api } from '@/services/api.service';
import { cookies } from 'next/headers';
import { handleApiError } from '@/lib/errorHandler';

// Interface para a resposta de login
interface LoginResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  role: string;
}
export async function handleLogin(formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  // Validações de entrada
  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" };
  }

  if (!email.includes('@')) {
    return { error: "Email inválido" };
  }

  if (password.length < 3) {
    return { error: "Senha deve ter pelo menos 3 caracteres" };
  }

  try {
    const response = await api.post<LoginResponse>('/session', {
      email,
      password        
    });

    if (!response.data.token) {      
      return { error: "Token não recebido do servidor" };
    }

    // Configurações de cookie mais seguras
    const expressTime = 60 * 60 * 24 * 1000; // 1 dia
    const cookieStorage = await cookies();

    cookieStorage.set("session", response.data.token, {
      maxAge: expressTime,
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Armazenar dados do usuário se necessário
    cookieStorage.set("user", JSON.stringify({
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role
    }), {
      maxAge: expressTime,
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return { success: true };

  } catch(err) {
    return { error: handleApiError(err) };
  }
}

export async function handleLogout() {
  try {
    const cookieStorage = await cookies();
    cookieStorage.delete('session');
    cookieStorage.delete('user');
    
    redirect('/auth/login');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}