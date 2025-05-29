"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { getCookieClient } from '@/lib/cookieClient';
import Sidebar from "@/components/layout/sidebar/sidebar";
import Header from "@/components/layout/header/header";

export default function ClientLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Lista de rotas públicas onde não devemos mostrar header/sidebar
  const publicRoutes = ['/auth', '/404', '/500', '/maintenance'];
  
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  useEffect(() => {
    setIsClient(true);
    
    // Verifica autenticação apenas em rotas protegidas
    if (!isPublicRoute) {
      const token = getCookieClient();
      
      if (!token) {
        // Se não tem token em rota protegida, redireciona para login
        router.replace('/auth/login');
        return;
      }
    }
  }, [pathname, router, isPublicRoute]);

  // Durante SSR ou primeira renderização no cliente
  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"></div>;
  }

  // Para rotas públicas (auth, páginas de erro, etc) - sem header/sidebar
  if (isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    );
  }

  // Verifica token para rotas protegidas
  const token = getCookieClient();
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Layout completo para usuários autenticados
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}