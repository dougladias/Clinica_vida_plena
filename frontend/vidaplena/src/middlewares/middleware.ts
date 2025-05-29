import { NextRequest, NextResponse } from 'next/server';
import { getCookieServer } from '@/lib/cookieServer';
import { api } from '@/services/api';

// Middleware para interceptar requisições e verificar o estado de autenticação do usuário
export async function middleware(requerst: NextRequest) {
    const { pathname } = requerst.nextUrl;
    
    // Permite acesso a recursos do Next.js e à página inicial
    if (pathname.startsWith('/_next') || pathname === "/") {
        return NextResponse.next();
    }
    
    // Permite acesso às páginas de login e cadastro
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/cadastro')) {
        return NextResponse.next();
    }
    
    // Verifica se o usuário está autenticado
    const token = await getCookieServer();
    
    // Para qualquer outra rota, verifica autenticação
    if (!token) {
        // Retorna erro 404 para usuários não autenticados
        return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
    }
    
    // Valida o token
    const isValid = await validateToken(token);
    if (!isValid) {
        // Retorna erro 404 se o token for inválido
        return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
    }
    
    // Se o usuário estiver autenticado, permite o acesso à rota
    return NextResponse.next();
}

// Define quais rotas o middleware deve ser aplicado
async function validateToken(token: string) {
    if (!token) return false;
    // Verifica se o token é válido fazendo uma requisição à API
    try {
        await api.get('/me', {
            headers: {
                Autorization: `Bearer ${token}`
            }
        })
        // Se a requisição for bem-sucedida, o token é válido
        return true;
    } catch (err) {
        console.error('Erro ao validar o token:', err);
        return false;
    }
}

