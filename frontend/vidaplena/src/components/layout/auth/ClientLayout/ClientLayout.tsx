"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar/sidebar";
import Header from "@/components/layout/header/header";

export default function ClientLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Lista de rotas onde não devemos mostrar header/sidebar
  const noLayoutRoutes = ['/auth', '/404', '/500', '/maintenance'];
  
  // Verifica se a rota atual não deve ter o layout completo
  const isNoLayoutPage = noLayoutRoutes.some(route => pathname.startsWith(route));
  
  // Resolver problema de hidratação usando um estado para controlar renderização no cliente
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Durante SSR ou primeira renderização no cliente, retorna um layout mínimo
  if (!isClient) {
    return <div className="min-h-screen">{null}</div>;
  }

  // Para rotas sem layout completo (auth, páginas de erro, etc)
  if (isNoLayoutPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    );
  }

  // Para as rotas principais do aplicativo com layout completo
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