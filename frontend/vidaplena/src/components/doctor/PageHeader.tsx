import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center space-x-3 mb-2">
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <UserCheck className="w-6 h-6 text-white" />
      </motion.div>
      <div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mt-2"
        />
      </div>
    </div>
  );
};