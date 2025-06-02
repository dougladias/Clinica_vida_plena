// ====================================
// ARQUIVO: src/components/pages/consultation/ConsultationDoctorsSidebar.tsx
// ====================================

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Loader2 } from 'lucide-react';
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
}

interface ConsultationDoctorsSidebarProps {
  loading: boolean;
  doctors: Doctor[];
  consultationsOfDay: Consultation[];
  getPatientById: (id: string) => Patient | undefined;
}

export const ConsultationDoctorsSidebar: React.FC<ConsultationDoctorsSidebarProps> = ({
  loading,
  doctors,
  consultationsOfDay,
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
    <div className="xl:col-span-1 space-y-8">
      {/* Consultas por Médico */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Stethoscope className="text-purple-500 dark:text-purple-400 w-6 h-6" />
              Consultas por Médico
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Visão geral do dia</p>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-emerald-300 rounded-full mt-2" />
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 dark:text-purple-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.slice(0, 6).map((doctor, index) => {
              const consultationsDoctor = consultationsOfDay.filter(c => c.doctor_id === doctor.id);
              
              return (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden"
                >
                  {/* Elementos decorativos */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center space-x-3 relative">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center shadow-inner flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Stethoscope className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{doctor.name}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{doctor.specialty || "Sem especialidade"}</p>
                        <span className="font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded-lg px-2 py-0.5 text-xs">
                          {consultationsDoctor.length} hoje
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {consultationsDoctor.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {consultationsDoctor.slice(0, 2).map(consultation => {
                        const patient = getPatientById(consultation.patient_id);
                        return (
                          <motion.div 
                            key={consultation.id} 
                            className="text-xs flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-100 dark:border-slate-700"
                            whileHover={{ x: 3 }}
                          >
                            <div className="flex items-center min-w-0 flex-1">
                              <span className="font-medium text-purple-600 dark:text-purple-400 mr-2">{consultation.time}</span>
                              <span className="text-slate-700 dark:text-slate-300 truncate">{patient?.name?.split(' ')[0] || "Paciente"}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                      {consultationsDoctor.length > 2 && (
                        <div className="text-xs text-center text-purple-600 dark:text-purple-400 font-medium">
                          +{consultationsDoctor.length - 2} mais
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {doctors.length > 6 && (
              <button 
                className="w-full py-2 text-sm text-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
              >
                Ver todos os {doctors.length} médicos
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};