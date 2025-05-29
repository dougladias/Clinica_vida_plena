"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookieClient } from '@/lib/cookieClient';

export default function Home() {  
  const router = useRouter();

  useEffect(() => {
    const token = getCookieClient();
    
    if (token) {
      // Se tem token, vai para o dashboard
      router.replace('/pages/dashboard');
    } else {
      // Se não tem token, vai para login
      router.replace('/auth/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}