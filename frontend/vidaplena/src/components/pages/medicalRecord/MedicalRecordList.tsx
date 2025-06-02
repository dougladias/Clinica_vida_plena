import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicalRecord } from '@/types/medicalRecord.type';
import { Patient } from '@/types/patient.type';
import { Doctor } from '@/types/doctor.type';
import { Consultation } from '@/types/consultation.type';

interface MedicalRecordListProps {
  loading: boolean;
  filteredRecords: MedicalRecord[];
  onView: (record: MedicalRecord) => void;
  onEdit: (record: MedicalRecord) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  getConsultationById: (id: string) => Consultation | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
}

export const MedicalRecordList: React.FC<MedicalRecordListProps> = ({
  loading,
  filteredRecords,
  onView,
  onEdit,
  onDelete,
  onAdd,
  getConsultationById,
  getDoctorById,
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
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Prontuários Médicos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {loading ? 'Carregando...' : `${filteredRecords.length} registros encontrados`}
          </p>
        </div>

        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
        >
          Ver todas
          <ChevronRight className="w-4 h-4 ml-1" />
        </motion.button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 dark:text-indigo-400" />
            <p className="text-slate-500 dark:text-slate-400">Carregando prontuários...</p>
          </div>
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {filteredRecords.map((record: MedicalRecord, index: number) => {
            const consultation = record.consultation || getConsultationById(record.consultation_id || '');
            const doctor = consultation?.doctor || getDoctorById(consultation?.doctor?.id || ''); 
            const patient = consultation?.patient || getPatientById(consultation?.patient?.id || '');

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4, backgroundColor: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
                onClick={() => onView(record)}
              >
                <div className="flex items-center space-x-4">
                  {/* Ícone */}
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/40 rounded-xl flex items-center justify-center shadow-inner">
                    <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  {/* Informações do prontuário */}
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{patient?.name || 'Paciente não encontrado'}</h4>
                    <div className="flex items-center space-x-2 text-xs mt-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Dr(a). {doctor?.name || 'Médico não encontrado'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {record.diagnosis ? record.diagnosis.substring(0, 30) + (record.diagnosis.length > 30 ? '...' : '') : 'Sem diagnóstico'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs mt-1 text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{record.created_at ? new Date(record.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(record);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <Eye className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(record);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(record.id);
                    }}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
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
          <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-700 dark:text-slate-300 text-xl mb-2 font-semibold">Nenhum prontuário encontrado</p>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-6">
            Os prontuários aparecerão aqui após as consultas serem registradas
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Criar Prontuário</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};