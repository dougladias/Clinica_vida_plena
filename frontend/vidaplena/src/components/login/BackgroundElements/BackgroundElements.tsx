'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedParticles from '../AnimatedParticles/AnimatedParticles';
import { Heart } from 'lucide-react';


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

  // Variantes de animação para as partículas médicas
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Círculos flutuantes */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
      />
      {/* Círculo flutuante com animação de atraso */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"
      />
      {/* Círculo flutuante com animação de atraso */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
        className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
      />

      {/* Partículas médicas flutuantes */}
      {isMounted && particlePositions.map((position, i) => (
        <AnimatedParticles key={i} position={position} index={i}>
          <Heart className="w-6 h-6 text-emerald-400/40" />
        </AnimatedParticles>
      ))}
    </div>
  );
};

export default BackgroundElements;