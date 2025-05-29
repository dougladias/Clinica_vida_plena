'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';


// Define as propriedades para o componente AnimatedParticles
interface AnimatedParticlesProps {
  position: { left: string; x: number };
  index: number;
  children: ReactNode;
}

// Componente para animar partículas com um efeito de movimento
const AnimatedParticles: React.FC<AnimatedParticlesProps> = ({ position, index, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [-100, -800],
        x: position.x
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: index * 1.5,
        ease: "easeOut"
      }}
      className="absolute bottom-0"
      style={{ left: position.left }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedParticles;