"use server";

import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { cookies } from 'next/headers';

// Função para lidar com o login do usuário
export async function handleLogin(formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  // Verifica se os campos de email e senha estão preenchidos
  if (email === "" || password === "") {
    return;
  }

  // Tenta fazer a requisição de login para a API
  try {
    const response = await api.post('/session', {
      email,
      password        
    });

    // Se não houver token na resposta, retorna
    if(!response.data.token) {      
      return;
    }

    // Armazena o token no cookie Por 1D
    const expressTime = 60 * 60 * 24 * 1000; 

    // Obtém o armazenamento de cookies
    const cookieStorage = await cookies();

    // Armazena o token no cookie
    cookieStorage.set("session", response.data.token, {
      maxAge: expressTime, 
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    })

  // Verifica se o token foi retornado
  } catch(err) {
    console.log(err);
    return;
  }
  // Redireciona o usuário para a página do dashboard após o login bem-sucedido
  redirect("/pages/dashboard");
}