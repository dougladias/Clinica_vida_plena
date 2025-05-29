'use client';

import React, { useState, useEffect } from 'react';
import BackgroundElements from '@/components/login/BackgroundElements/BackgroundElements';
import LeftPanel from '@/components/login/LeftPanel/index';
import LoginForm from '@/components/login/LoginForm/index';

// Componente de Login com animações e partículas médicas
const Login: React.FC = () => {
  const [particlePositions, setParticlePositions] = useState<Array<{ left: string, x: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Gerar posições aleatórias apenas no lado do cliente
  useEffect(() => {
    const positions = [...Array(6)].map(() => ({
      left: `${Math.random() * 100}%`,
      x: Math.random() * 100 - 50
    }));

    // Ajustar posições para evitar que as partículas saiam da tela
    setParticlePositions(positions);
    setIsMounted(true);
  }, []);

  // Efeito de animação para as partículas
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 overflow-hidden">
      <BackgroundElements particlePositions={particlePositions} isMounted={isMounted} />
      
      {/* Painel Principal */}
      <div className="relative z-10 min-h-screen flex">
        <LeftPanel />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;