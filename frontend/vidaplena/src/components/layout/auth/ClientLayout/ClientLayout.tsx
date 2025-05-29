"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { validateTokenClient } from '@/lib/cookieClient';
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
  const [isValidating, setIsValidating] = useState(true);
  
  // Lista de rotas públicas onde não devemos mostrar header/sidebar
  const publicRoutes = ['/auth', '/404', '/500', '/maintenance'];
  
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  useEffect(() => {
    setIsClient(true);
    
    // Verifica autenticação apenas em rotas protegidas
    if (!isPublicRoute) {
      const validateAuth = async () => {
        setIsValidating(true);
        
        const isValid = await validateTokenClient();
        
        if (!isValid) {
          // Token inválido ou não existe, redireciona para login
          router.replace('/auth/login');
          return;
        }
        
        setIsValidating(false);
      };
      
      validateAuth();
    } else {
      setIsValidating(false);
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

  // Mostra loading enquanto valida token
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Layout completo para usuários autenticados
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex flex-1 mt-[72px]"> {/* Adicionando margin-top para compensar o header */}
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-6 flex justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="w-full max-w-[1800px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}