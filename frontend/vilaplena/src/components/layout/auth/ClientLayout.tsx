"use client";

import React from 'react';
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar/sidebar";
import Header from "@/components/layout/header/header";

export default function ClientLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    );
  }

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