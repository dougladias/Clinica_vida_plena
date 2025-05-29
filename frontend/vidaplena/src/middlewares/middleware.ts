import { NextRequest, NextResponse } from 'next/server';

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
    
    // Pega o token do cookie
    const token = request.cookies.get('session')?.value;
    
    // Se não tem token e está tentando acessar rota protegida
    if (!token && !isPublicRoute && pathname !== '/') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Se tem token e está tentando acessar rota pública, redireciona para dashboard
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/pages/dashboard', request.url));
    }
    
    // Se não tem token e está na raiz, redireciona para login
    if (!token && pathname === '/') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    return NextResponse.next();
}

// Define quais rotas o middleware deve interceptar
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}