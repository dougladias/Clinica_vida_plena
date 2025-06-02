// ====================================
// ARQUIVO: src/components/pages/consultation/ConsultationWeeklyView.tsx
// ====================================

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { Consultation } from '@/types/consultation.type';

// Types para compatibilidade
type Patient = {
  id: string;
  name: string;
}

interface ConsultationWeeklyViewProps {
  loading: boolean;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  consultations: Consultation[];
  getPatientById: (id: string) => Patient | undefined;
}

export const ConsultationWeeklyView: React.FC<ConsultationWeeklyViewProps> = ({
  loading,
  selectedDate,
  setSelectedDate,
  consultations,
  getPatientById
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
            <CalendarDays className="text-purple-500 dark:text-purple-400 w-6 h-6" />
            Visão Semanal
          </h3>
          <p className="text-slate-600 dark:text-slate-400">Consultas agendadas para a semana</p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-emerald-300 rounded-full mt-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 7 }, (_, i) => {
          // Calcular datas da semana sem problemas de timezone
          const [year, month, day] = selectedDate.split('-').map(Number);
          const baseDate = new Date(year, month - 1, day);
          
          const adjust = baseDate.getDay() === 0 ? 6 : baseDate.getDay() - 1;
          const currentDate = new Date(baseDate);
          currentDate.setDate(currentDate.getDate() - adjust + i);
          
          const dateStr = currentDate.toISOString().split('T')[0];
          
          const consultationsDay = consultations.filter(c => {
            const consultationDate = String(c.date).split('T')[0];
            return consultationDate === dateStr;
          });
          
          const today = new Date().toISOString().split('T')[0];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate.split('T')[0];
          
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDate(dateStr)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white shadow-lg ring-2 ring-purple-500 dark:ring-purple-600 ring-offset-2 dark:ring-offset-slate-900' 
                  : isToday 
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow'
              }`}
            >
              <div className="text-center">
                <p className={`text-xs uppercase tracking-wider mb-1 ${
                  isSelected ? 'text-purple-100' : isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {currentDate.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </p>
                <p className={`text-xl font-bold mb-2 ${
                  isSelected ? 'text-white' : isToday ? 'text-blue-800 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {currentDate.getDate()}
                </p>
                
                {loading ? (
                  <div className="w-full h-6 flex justify-center items-center">
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-current opacity-50"></div>
                  </div>
                ) : (
                  <>
                    <div className={`py-1 px-2 rounded-full text-xs font-medium inline-block ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : consultationsDay.length > 0 
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {consultationsDay.length} consulta{consultationsDay.length !== 1 ? 's' : ''}
                    </div>
                    
                    {consultationsDay.length > 0 && !isSelected && (
                      <div className="mt-2 space-y-1">
                        {consultationsDay.slice(0, 2).map((c, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs py-1 px-1 rounded bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 truncate"
                            title={`${c.time} - ${getPatientById(c.patient_id)?.name || 'Sem nome'}`}
                          >
                            {c.time}
                          </div>
                        ))}
                        {consultationsDay.length > 2 && (
                          <div className="text-xs text-center text-purple-600 dark:text-purple-400 font-medium">
                            +{consultationsDay.length - 2} mais
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};