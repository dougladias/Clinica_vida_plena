"use server";

import { redirect } from 'next/navigation';
import { api } from '@/services/api';


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

    // Armazena o token de autenticação no localStorage
    console.log(response.data);

    // Verifica se o token foi retornado
  } catch(err) {
    console.log(err);
    return;
  }
  // Redireciona o usuário para a página do dashboard após o login bem-sucedido
  redirect("/pages/dashboard");
}