import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MedicalRecordHeaderProps {
  onAdd: () => void;
  loading: boolean;
}

export const MedicalRecordHeader: React.FC<MedicalRecordHeaderProps> = ({
  onAdd,
  loading
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
    >
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
          Prontuários
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Registros médicos e histórico dos pacientes</p>
      </div>

      <Button
        onClick={onAdd}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Novo Prontuário
      </Button>
    </motion.div>
  );
};