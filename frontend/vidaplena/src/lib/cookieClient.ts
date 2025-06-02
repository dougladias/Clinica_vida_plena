import { getCookie, deleteCookie } from 'cookies-next';
import { api } from '@/services/api.service';

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
  try {
    console.log("Removendo cookie de sessão...");
    deleteCookie('session');
    
    console.log("Redirecionando para página de login...");
    // Força o redirecionamento sem cache
    window.location.replace('/auth/login');
  } catch (error) {
    console.error("Erro durante o logout:", error);
    // Tentativa alternativa de redirecionamento
    window.location.href = '/auth/login';
  }
}