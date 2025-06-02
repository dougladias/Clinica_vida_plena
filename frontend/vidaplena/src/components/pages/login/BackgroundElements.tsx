'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedParticles from './AnimatedParticles';
import { Heart, Activity, Plus } from 'lucide-react';

// Define as propriedades para o componente BackgroundElements
interface BackgroundElementsProps {
  particlePositions: Array<{ left: string, x: number }>;
  isMounted: boolean;
}

// Componente para renderizar elementos de fundo com animações e partículas médicas
const BackgroundElements: React.FC<BackgroundElementsProps> = ({ particlePositions, isMounted }) => {  
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const icons = [
    <Heart key="heart" className="text-pink-400" size={24} />,
    <Plus key="plus" className="text-emerald-400" size={24} />,
    <Activity key="activity" className="text-blue-400" size={24} />
  ];

  // Variantes de animação para as partículas médicas
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Círculos flutuantes com gradiente */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
        className="absolute bottom-32 left-32 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '3s' }}
        className="absolute bottom-40 right-40 w-60 h-60 bg-gradient-to-r from-amber-400/20 to-red-400/20 rounded-full blur-xl"
      />

      {/* Partículas animadas */}
      {isMounted && particlePositions.map((position, index) => (
        <AnimatedParticles key={index} position={position} index={index}>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full shadow-lg">
            {icons[index % icons.length]}
          </div>
        </AnimatedParticles>
      ))}
    </div>
  );
};

export default BackgroundElements;