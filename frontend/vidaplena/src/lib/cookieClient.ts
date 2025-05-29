import { getCookie } from 'cookies-next'

export function getCookieClient() {
  // Obtém o cookie pelo nome
  const token = getCookie("session");
  
  // Retorna o valor do cookie ou null se não existir
  return token;
}