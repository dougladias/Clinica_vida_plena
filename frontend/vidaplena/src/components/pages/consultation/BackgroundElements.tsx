import React from 'react';
import { motion } from 'framer-motion';

// Elementos de background estilizados
const backgroundElements = [
  { left: '5%', top: '15%', size: 200 },
  { left: '92%', top: '10%', size: 250 },
  { left: '85%', top: '50%', size: 180 },
  { left: '15%', top: '80%', size: 220 },
  { left: '40%', top: '30%', size: 160 }
];

// Variantes de animação para elementos flutuantes
const floatingVariants = {
  animate: {
    y: ['-5%', '5%', '-5%'],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const ConsultationBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {backgroundElements.map((el, i) => (
        <motion.div
          key={i}
          variants={floatingVariants}
          animate="animate"
          className="absolute rounded-full bg-gradient-to-r from-purple-900/10 to-emerald-900/10 dark:from-purple-500/10 dark:to-emerald-500/10 blur-3xl"
          style={{
            left: el.left,
            top: el.top,
            width: `${el.size}px`,
            height: `${el.size}px`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};