// ====================================
// ARQUIVO: src/components/pages/consultation/ConsultationDayAgenda.tsx
// ====================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Edit,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Consultation } from '@/types/consultation.type';

// Types para compatibilidade
type Doctor = {
  id: string;
  name: string;
  specialty: string;
}

type Patient = {
  id: string;
  name: string;
  phone: string;
}

interface ConsultationDayAgendaProps {
  loading: boolean;
  selectedDate: string;
  consultationsOfDay: Consultation[];
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
  handleEdit: (consultation: Consultation) => void;
  handleDelete: (id: string) => void;
  handleAdd: () => void;
}

export const ConsultationDayAgenda: React.FC<ConsultationDayAgendaProps> = ({
  loading,
  selectedDate,
  consultationsOfDay,
  getDoctorById,
  getPatientById,
  handleEdit,
  handleDelete,
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
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Calendar className="text-purple-500 dark:text-purple-400 w-6 h-6" />
            Agenda do Dia
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {(() => {
              const [year, month, day] = selectedDate.split('-').map(Number);
              const displayDate = new Date(year, month - 1, day);
              
              return displayDate.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
            })()}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-emerald-300 rounded-full mt-2" />
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-purple-700 dark:text-purple-300">
            {loading ? '...' : `${consultationsOfDay.length} consultas`}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Agendadas para hoje</p>
        </div>
      </div>

      {/* Lista de consultas */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Carregando consultas...</p>
          </div>
        </div>
      ) : consultationsOfDay.length > 0 ? (
        <div className="space-y-4">
          {consultationsOfDay
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((consultation, index) => {
              const doctor = getDoctorById(consultation.doctor_id);
              const patient = getPatientById(consultation.patient_id);
              
              return (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-700 hover:border-purple-100 dark:hover:border-purple-800/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {/* Horário */}
                    <div className="text-center min-w-[80px]">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl flex items-center justify-center mx-auto mb-1 shadow-inner">
                        <Clock className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{consultation.time}</p>
                    </div>
                    
                    {/* Paciente */}
                    <div className="min-w-[200px] border-l border-slate-200 dark:border-slate-700 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{patient?.name || "Paciente não encontrado"}</p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                        {patient?.phone || "Sem telefone"}
                      </p>
                    </div>
                    
                    {/* Médico */}
                    <div className="min-w-[200px] border-l border-slate-200 dark:border-slate-700 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="font-medium text-slate-800 dark:text-slate-200">{doctor?.name || "Médico não encontrado"}</p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{doctor?.specialty || "Sem especialidade"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Ações */}
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(consultation)}
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      
                      <Button 
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(consultation.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700"
        >
          <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-700 dark:text-slate-300 text-xl mb-2 font-semibold">Nenhuma consulta agendada</p>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-6">
            Não há consultas marcadas para este dia.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Agendar Consulta</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};