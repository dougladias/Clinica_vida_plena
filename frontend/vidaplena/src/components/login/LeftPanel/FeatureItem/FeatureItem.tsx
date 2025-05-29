'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';


// Define as propriedades para o componente FeatureItem
interface FeatureItemProps {
  icon: LucideIcon;
  text: string;
}

// Componente para exibir um item de recurso com ícone e texto
const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, text }) => {
  return (
    <motion.div
      whileHover={{ x: 10 }}
      className="flex items-center space-x-3 text-white/90"
    >
     {/* Ícone do recurso */}   
      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <span>{text}</span>
    </motion.div>
  );
};

export default FeatureItem;