'use client';

import React, { useState, useEffect } from 'react';
import BackgroundElements from '@/components/pages/login/BackgroundElements';
import LoginForm from '@/components/pages/login/LoginForm';

// Componente de Login com animações e partículas médicas
const Login: React.FC = () => {
  const [particlePositions, setParticlePositions] = useState<Array<{ left: string, x: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Gerar posições aleatórias apenas no lado do cliente
  useEffect(() => {
    // Aumentando o número de partículas para 12 para um efeito mais rico
    const positions = [...Array(12)].map(() => ({
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
      {/* Background com partículas de corações */}
      <BackgroundElements particlePositions={particlePositions} isMounted={isMounted} />
      
      {/* Painel Principal - Formulário centralizado com efeito de vidro */}
      <div className="relative z-10 min-h-screen flex justify-center items-center px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;