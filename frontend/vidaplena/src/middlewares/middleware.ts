import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/services/api';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Permite acesso a recursos do Next.js
    if (pathname.startsWith('/_next') || 
        pathname.startsWith('/api') || 
        pathname.includes('.')) {
        return NextResponse.next();
    }
    
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/auth/login', '/auth/cadastro'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    // Pega o token do cookie usando a mesma lógica do cookieServer
    const token = request.cookies.get('session')?.value;
    
    // Se não tem token e está tentando acessar rota protegida
    if (!token && !isPublicRoute && pathname !== '/') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Se tem token, valida se é válido
    if (token && !isPublicRoute) {
        const isValidToken = await validateToken(token);
        
        if (!isValidToken) {
            // Token inválido, remove o cookie e redireciona para login
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete('session');
            return response;
        }
    }
    
    // Se tem token válido e está tentando acessar rota pública, redireciona para dashboard
    if (token && isPublicRoute) {
        const isValidToken = await validateToken(token);
        
        if (isValidToken) {
            return NextResponse.redirect(new URL('/pages/dashboard', request.url));
        } else {
            // Token inválido, remove o cookie e permite acesso à rota pública
            const response = NextResponse.next();
            response.cookies.delete('session');
            return response;
        }
    }
    
    // Se não tem token e está na raiz, redireciona para login
    if (!token && pathname === '/') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    return NextResponse.next();
}

// Função para validar o token
async function validateToken(token: string): Promise<boolean> {
    if (!token) return false;
    
    try {
        // Faz uma requisição para verificar se o token é válido
        await api.get('/me', {
            headers: {
                Authorization: `Bearer ${token}` // Corrigido: estava "Autorization"
            }
        });
        
        return true;
    } catch (error) {
        console.error('Token inválido:', error);
        return false;
    }
}

// Define quais rotas o middleware deve interceptar
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}