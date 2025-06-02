import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MedicalRecordFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  doctorFilter: string;
  setDoctorFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
}

export const MedicalRecordFilters: React.FC<MedicalRecordFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  doctorFilter,
  setDoctorFilter,
  dateFilter,
  setDateFilter
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
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Buscar Prontuários</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por paciente ou diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por médico..."
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </motion.div>
  );
};
