import { cookies } from 'next/headers';
import { api } from '@/services/api.service';

// Função para obter cookie no servidor
export async function getCookieServer() {
    const cookiesStorage = await cookies();
    const token = cookiesStorage.get('session')?.value;
    return token || null;
}

// Função para validar token no servidor
export async function validateTokenServer(): Promise<boolean> {
    const token = await getCookieServer();
    
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
        console.error('Token inválido no servidor:', error);
        return false;
    }
}

// Função para remover cookie no servidor
export async function removeCookieServer() {
    const cookiesStorage = await cookies();
    cookiesStorage.delete('session');
}