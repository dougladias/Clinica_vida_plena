import { getCookie, deleteCookie } from 'cookies-next';
import { api } from '@/services/api';

export function getCookieClient() {
  // Obtém o cookie pelo nome
  const token = getCookie("session");
  
  // Retorna o valor do cookie ou null se não existir
  return token || null;
}

// Função para validar token no cliente
export async function validateTokenClient(): Promise<boolean> {
  const token = getCookieClient();
  
  if (!token) return false;
  
  // Tenta fazer uma requisição para verificar se o token é válido
  try {
    await api.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Se a requisição foi bem-sucedida, o token é válido
    return true;
  } catch (error) {
    console.error('Token inválido no cliente:', error);
    // Remove o cookie inválido
    deleteCookie('session');
    return false;
  }
}

// Função para logout completo
export function logoutClient() {
  deleteCookie('session');
  window.location.href = '/auth/login';
}