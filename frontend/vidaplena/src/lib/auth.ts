import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';


// Função para obter o token de autenticação
export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  // Verifica se o token existe, caso contrário redireciona para a página de login
  if (!token) {
    redirect('/auth/login');
  }
  
  // Verifica se o token é válido (não está vazio)
  return token;
}

// Função para obter os headers de autenticação
export function getAuthHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}
