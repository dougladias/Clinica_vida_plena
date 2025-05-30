"use client";

import React, { useState, useEffect, useCallback } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  Stethoscope,
  CalendarDays, 
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw
} from 'lucide-react';
import { 
  getConsultations,   
  handleCreateConsultation,
  handleUpdateConsultation,
  handleDeleteConsultation,
  getDoctors,
  getPatients
} from '@/components/consultation/serverAction/consultationAction';
import { useSearchParams, useRouter } from 'next/navigation';

// Interfaces
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  email: string;
  phone: string;
}

interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthdate: string;
  address: string;
  phone: string;
  email: string;
}

interface Consultation {
  id: string;
  date: string;
  time: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  doctor?: Doctor;
  patient?: Patient;
}

interface ConsultationStats {
  today: number;
  scheduled: number;
  inProgress: number;
  completed: number;
}

export default function ConsultationPage() {
  // Estados para gerenciar os dados
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ConsultationStats>({
    today: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0
  });
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  
  const searchParams = useSearchParams();
  const doctorIdFilter = searchParams.get('doctor_id');

  // Usando useCallback para resolver o problema de dependência
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Carregar dados com filtro por data e médico se existir
      const filters: {
        date?: string;
        doctor_id?: string;
      } = { date: selectedDate };
      
      if (doctorIdFilter) {
        filters.doctor_id = doctorIdFilter;
      }
      
      const [consultationsData, doctorsData, patientsData] = await Promise.all([
        getConsultations(filters),
        getDoctors(),
        getPatients()
      ]);

      setConsultations(consultationsData);
      setDoctors(doctorsData);
      setPatients(patientsData);

      // Calcular estatísticas localmente
      const today = new Date().toISOString().split('T')[0];
      const consultationsToday = consultationsData.filter(
        (c: Consultation) => c.date === today
      );
      
      const scheduledConsultations = consultationsData.filter(
        (c: Consultation) => c.status === 'Agendada'
      );
      
      const inProgressConsultations = consultationsData.filter(
        (c: Consultation) => c.status === 'Em Andamento'
      );
      
      const completedConsultations = consultationsData.filter(
        (c: Consultation) => c.status === 'Concluída'
      );
      
      setStats({
        today: consultationsToday.length,
        scheduled: scheduledConsultations.length,
        inProgress: inProgressConsultations.length,
        completed: completedConsultations.length
      });

      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das consultas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, doctorIdFilter]);

  // Carregar dados de APIs - corrigido com loadData como dependência
  useEffect(() => {
    loadData();
  }, [loadData]); // loadData já inclui selectedDate e doctorIdFilter como dependências

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAdd = () => {
    setSelectedConsultation(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta consulta?')) {
      return;
    }

    try {
      const result = await handleDeleteConsultation(id);
      if (result?.error) {
        alert(`Erro: ${result.error}`);
      } else {
        await loadData();
      }
    } catch (error) {
      console.error('Erro ao excluir consulta:', error);
      alert('Erro ao excluir consulta');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedConsultation(null);
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Funções de utilidade
  const getDoctorById = (id: string) => {
    return doctors.find(doctor => doctor.id === id);
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  // Renderizar componente
  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Erro ao carregar dados</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Tentar novamente</span>
          </button>
        </motion.div>
      )}

      <ConsultationsComponent
        consultations={consultations}
        doctors={doctors}
        patients={patients}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        loading={loading}
        stats={stats}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getDoctorById={getDoctorById}
        getPatientById={getPatientById}
        doctorIdFilter={doctorIdFilter}
      />

      {/* Modal para Criar/Editar Consulta */}
      {showModal && (
        <ConsultationModal
          isOpen={showModal}
          onClose={closeModal}
          consultation={selectedConsultation}
          mode={modalMode}
          onSuccess={handleModalSuccess}
          doctors={doctors}
          patients={patients}
          preselectedDoctorId={doctorIdFilter || undefined}
        />
      )}
    </div>
  );
}

// Interface para o componente de Consultas
interface ConsultationsComponentProps {
  consultations: Consultation[];
  doctors: Doctor[];
  patients: Patient[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  loading: boolean;
  stats: ConsultationStats;
  handleAdd: () => void;
  handleEdit: (consultation: Consultation) => void;
  handleDelete: (id: string) => void;
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
  doctorIdFilter: string | null;
}

// Componente ConsultationsComponent
const ConsultationsComponent: React.FC<ConsultationsComponentProps> = ({ 
  consultations, 
  doctors,  
  selectedDate,
  setSelectedDate,
  loading,
  stats,
  handleAdd, 
  handleEdit, 
  handleDelete,
  getDoctorById,
  getPatientById,
  doctorIdFilter
}) => {
  // ADICIONE ESTA DEPURAÇÃO
  useEffect(() => {
    console.log("ConsultationsComponent - Consultas recebidas:", consultations);
    console.log("ConsultationsComponent - Data selecionada:", selectedDate);
    if (consultations?.length > 0) {
      console.log("Exemplo de data da consulta:", consultations[0].date);
      console.log("São iguais?", consultations[0].date === selectedDate);
    }
  }, [consultations, selectedDate]);

  // Modificar a comparação para ser mais robusta
  const consultationsOfDay = consultations.filter(c => {
    // Extrai apenas a parte da data (YYYY-MM-DD) de ambas as strings e compara
    const consultationDateStr = String(c.date).split('T')[0];
    return consultationDateStr === selectedDate;
  });

  console.log("ConsultationsComponent - Consultas filtradas para o dia:", consultationsOfDay);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Removidos: scheduledConsultations, inProgressConsultations, completedConsultations
  // Esses valores já estão sendo usados no cálculo das estatísticas

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendada':
        return 'bg-blue-100 text-blue-800';
      case 'Em Andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Concluída':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const nextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const previousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const router = useRouter();
  const clearDoctorFilter = () => {
    router.push('/pages/consultation');
  };

  return (
    <motion.div
      key="consultations"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Consultas</h2>
          <p className="text-slate-500 mt-1">Gerencie os agendamentos da clínica</p>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando...</span>
              </span>
            ) : (
              `${consultations.length} consultas no sistema`
            )}
          </p>

          {/* Mostrar filtro atual se aplicado */}
          {doctorIdFilter && (
            <div className="mt-2 flex items-center">
              <span className="text-xs font-medium text-purple-600 bg-purple-50 py-1 px-2 rounded-lg mr-2">
                Filtrando por médico: {getDoctorById(doctorIdFilter)?.name || doctorIdFilter}
              </span>
              <button 
                onClick={clearDoctorFilter}
                className="text-xs text-purple-700 hover:text-purple-900"
              >
                (Limpar filtro)
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={previousDay}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextDay}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Consulta</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Hoje</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.today
                )}
              </p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Agendadas</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.scheduled
                )}
              </p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Em Andamento</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.inProgress
                )}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Concluídas</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.completed
                )}
              </p>
            </div>
            <CalendarDays className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Agenda do dia */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Agenda do Dia - {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className="text-sm text-slate-500">
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Carregando consultas...
                </span>
              ) : (
                `${consultationsOfDay.length} consultas agendadas`
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-slate-500">Carregando consultas...</p>
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
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: '#f8fafc' }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Horário */}
                      <div className="text-center min-w-[80px]">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{consultation.time}</p>
                      </div>
                      
                      {/* Paciente */}
                      <div className="min-w-[200px]">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="font-semibold text-slate-800">{patient?.name}</p>
                        </div>
                        <p className="text-sm text-slate-500">{patient?.phone}</p>
                      </div>
                      
                      {/* Médico */}
                      <div className="min-w-[200px]">
                        <div className="flex items-center space-x-2 mb-1">
                          <Stethoscope className="w-4 h-4 text-slate-400" />
                          <p className="font-medium text-slate-800">{doctor?.name}</p>
                        </div>
                        <p className="text-sm text-slate-500">{doctor?.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                      
                      {/* Ações */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(consultation)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar consulta"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(consultation.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Cancelar consulta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhuma consulta agendada para este dia</p>
            <p className="text-slate-400 text-sm mb-4">
              Que tal agendar uma nova consulta?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Agendar Consulta
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Vista semanal */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Visão Semanal</h3>
        
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(selectedDate);
            const adjust = date.getDay() === 0 ? 6 : date.getDay() - 1;
            date.setDate(date.getDate() - adjust + i);
            const dateStr = date.toISOString().split('T')[0];
            const consultationsDay = consultations.filter(c => {
              // Normaliza as datas para o formato YYYY-MM-DD antes de comparar
              const consultationDate = String(c.date).split('T')[0];
              return consultationDate === dateStr;
            });
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate;
            
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                    : isToday 
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="text-center">
                  <p className={`text-xs font-medium mb-1 ${
                    isSelected ? 'text-purple-100' : 'text-slate-500'
                  }`}>
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold mb-2 ${
                    isSelected ? 'text-white' : isToday ? 'text-blue-800' : 'text-slate-800'
                  }`}>
                    {date.getDate()}
                  </p>
                  <div className={`text-xs ${
                    isSelected ? 'text-purple-100' : 'text-slate-500'
                  }`}>
                    {consultationsDay.length} consulta{consultationsDay.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Resumo por médico */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Consultas por Médico</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor, index) => {
            const consultationsDoctor = consultationsOfDay.filter(c => c.doctor_id === doctor.id);
            
            return (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{doctor.name}</p>
                    <p className="text-xs text-slate-500">{doctor.specialty}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Consultas hoje:</span>
                    <span className="font-semibold text-slate-800">{consultationsDoctor.length}</span>
                  </div>
                  
                  {consultationsDoctor.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Próximas:</p>
                      <div className="space-y-1">
                        {consultationsDoctor.slice(0, 2).map(consultation => {
                          const patient = getPatientById(consultation.patient_id);
                          return (
                            <div key={consultation.id} className="text-xs text-slate-600 bg-white rounded px-2 py-1">
                              {consultation.time} - {patient?.name}
                            </div>
                          );
                        })}
                        {consultationsDoctor.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{consultationsDoctor.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente Modal para Criar/Editar Consulta
interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
  doctors: Doctor[];
  patients: Patient[];
  preselectedDoctorId?: string;
}

function ConsultationModal({ 
  isOpen, 
  onClose, 
  consultation, 
  mode, 
  onSuccess, 
  doctors,
  patients,
  preselectedDoctorId
}: ConsultationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<{
    date: string;
    time: string;
    doctor_id: string;
    patient_id: string;
    status: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    doctor_id: preselectedDoctorId || '',
    patient_id: '',
    status: 'Agendada'
  });

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && consultation) {
        setFormData({
          date: consultation.date,
          time: consultation.time,
          doctor_id: consultation.doctor_id,
          patient_id: consultation.patient_id,
          status: consultation.status
        });
      } else {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          time: '08:00',
          doctor_id: preselectedDoctorId || '',
          patient_id: '',
          status: 'Agendada'
        });
      }
      setError('');
      setSuccess(false);
    }
  }, [isOpen, mode, consultation, preselectedDoctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.doctor_id || !formData.patient_id) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('doctor_id', formData.doctor_id);
      formDataToSend.append('patient_id', formData.patient_id);
      formDataToSend.append('status', formData.status);

      let result;
      if (mode === 'edit' && consultation) {
        formDataToSend.append('id', consultation.id);
        result = await handleUpdateConsultation(formDataToSend);
      } else {
        result = await handleCreateConsultation(formDataToSend);
      }

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {mode === 'create' ? 'Nova Consulta' : 'Editar Consulta'}
          </h3>

          <motion.form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data da Consulta
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Horário
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Médico
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um médico</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Paciente
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um paciente</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.cpf}
                  </option>
                ))}
              </select>
            </div>

            {mode === 'edit' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Agendada">Agendada</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            )}

            {/* Mensagem de erro */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Mensagem de sucesso */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Consulta {mode === 'create' ? 'agendada' : 'atualizada'} com sucesso!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading && !success ? { scale: 1.02 } : {}}
                whileTap={!isLoading && !success ? { scale: 0.98 } : {}}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 font-medium ${
                  success 
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } transition-colors disabled:opacity-70`}
              >
                {isLoading ? (
                  <>
                    <div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                    <span>Salvando...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Salvo com sucesso!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{mode === 'create' ? 'Agendar' : 'Atualizar'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}