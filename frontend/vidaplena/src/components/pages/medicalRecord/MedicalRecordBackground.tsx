import React from 'react';
import { motion } from 'framer-motion';

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

// Elementos de background estilizados
const backgroundElements = [
  { left: '5%', top: '15%', size: 200 },
  { left: '90%', top: '10%', size: 250 },
  { left: '80%', top: '60%', size: 180 },
  { left: '20%', top: '80%', size: 220 },
  { left: '40%', top: '30%', size: 160 }
];

export const MedicalRecordBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {backgroundElements.map((el, i) => (
        <motion.div
          key={i}
          variants={floatingVariants}
          animate="animate"
          className="absolute rounded-full bg-gradient-to-r from-indigo-900/10 to-blue-900/10 dark:from-indigo-500/10 dark:to-blue-500/10 blur-3xl"
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