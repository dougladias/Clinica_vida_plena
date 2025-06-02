// ====================================
// ARQUIVO: src/components/pages/consultation/ConsultationHeader.tsx
// ====================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Consultation } from '@/types/consultation.type';

// Types para compatibilidade
type Doctor = {
  id: string;
  name: string;
  specialty: string;
}

interface ConsultationHeaderProps {
  loading: boolean;
  consultations: Consultation[];
  doctorIdFilter: string | null;
  getDoctorById: (id: string) => Doctor | undefined;
  clearDoctorFilter: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  nextDay: () => void;
  previousDay: () => void;
  handleAdd: () => void;
}

export const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({
  loading,
  consultations,
  doctorIdFilter,
  getDoctorById,
  clearDoctorFilter,
  selectedDate,
  setSelectedDate,
  nextDay,
  previousDay,
  handleAdd
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
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-500 dark:from-purple-400 dark:to-emerald-300">
          Consultas
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Gerencie os agendamentos da clínica</p>
        
        {/* Contador de consultas e status de carregamento */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center">
          {loading ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500 dark:text-purple-400" />
              <span>Carregando dados...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span><strong>{consultations.length}</strong> consultas no sistema</span>
            </span>
          )}
        </p>

        {/* Indicador de filtro ativo */}
        {doctorIdFilter && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 flex items-center"
          >
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 py-1.5 px-3 rounded-lg mr-2 shadow-sm">
              Filtrando por médico: {getDoctorById(doctorIdFilter)?.name || doctorIdFilter}
            </span>
            <button 
              onClick={clearDoctorFilter}
              className="text-xs text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 underline decoration-dashed underline-offset-2"
            >
              Limpar filtro
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex items-center space-x-3 flex-wrap gap-3">
        {/* Seletor de data com estilo melhorado */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center space-x-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
            whileTap={{ scale: 0.95 }}
            onClick={previousDay}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="relative">
            <input
              type="date"
              value={selectedDate.split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-lg"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
            whileTap={{ scale: 0.95 }}
            onClick={nextDay}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        {/* Botão de nova consulta */}
        <Button 
          onClick={handleAdd}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Consulta
        </Button>
      </div>
    </motion.div>
  );
};