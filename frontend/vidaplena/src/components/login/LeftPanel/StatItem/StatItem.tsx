'use client';

import React from 'react';
import { motion } from 'framer-motion';


// Define as propriedades para o componente StatItem
interface StatItemProps {
  number: string;
  label: string;
}

// Componente para exibir um item de estatística com número e rótulo
const StatItem: React.FC<StatItemProps> = ({ number, label }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
    {/* Exibe o número em destaque */}
      <div className="text-2xl font-bold text-white">{number}</div>
      <div className="text-white/70 text-sm">{label}</div>
    </motion.div>
  );
};

export default StatItem;