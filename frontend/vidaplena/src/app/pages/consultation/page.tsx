"use client";

import React, { useState, useEffect, useCallback } from 'react'; 
import { motion } from 'framer-motion';
import { 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { 
  getConsultations,   
  handleCreateConsultation,
  handleUpdateConsultation,
  handleDeleteConsultation,
  getDoctors,
  getPatients
} from '@/server/consultation/useConsultation';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Consultation,           
  ConsultationDoctor, 
  ConsultationPatient,
  CreateConsultationData, 
  UpdateConsultationData  
} from '@/types/consultation.type';

// Importação dos componentes componentizados
import { ConsultationHeader } from '@/components/pages/consultation/ConsultationHeader';
import { ConsultationStats } from '@/components/pages/consultation/ConsultationStats';
import { ConsultationDayAgenda } from '@/components/pages/consultation/ConsultationDayAgenda';
import { ConsultationWeeklyView } from '@/components/pages/consultation/ConsultationWeeklyView';
import { ConsultationDoctorsSidebar } from '@/components/pages/consultation/ConsultationDoctorsSidebar';
import { ConsultationModal } from '@/components/pages/consultation/ConsultationModal';
import { ConsultationWeeklyTable } from '@/components/pages/consultation/ConsultationWeekTable';
import { ConsultationBackground } from '@/components/pages/consultation/BackgroundElements';

// Types estendidos para compatibilidade com o código existente
type Doctor = ConsultationDoctor & {
  specialty: string;
  crm: string;
  email: string;
  phone: string;
}

type Patient = ConsultationPatient & {
  cpf: string;
  birthdate: string;
  address: string;
  phone: string;
  email: string;
}

interface ConsultationStats {
  today: number;
  scheduled: number;
  inProgress: number;
  completed: number;
}

// Variantes de animação para o container principal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      duration: 0.6 
    }
  }
};

export default function ConsultationPage() {
  // Estados
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
  
  // Estados para modal e formulário
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    doctor_id: '',
    patient_id: ''
  });
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorIdFilter = searchParams.get('doctor_id');

  // Função loadData com tratamento robusto de datas
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Garantir que selectedDate está no formato YYYY-MM-DD
      const normalizedSelectedDate = selectedDate.split('T')[0];
      
      const filters: {
        date?: string;
        doctor_id?: string;
      } = { date: normalizedSelectedDate };
      
      if (doctorIdFilter) {
        filters.doctor_id = doctorIdFilter;
      }
      
      console.log('=== LOAD DATA DEBUG ===');
      console.log('Data selecionada normalizada:', normalizedSelectedDate);
      console.log('Filtros aplicados:', filters);
      
      const [consultationsData, doctorsData, patientsData] = await Promise.all([
        getConsultations(filters),
        getDoctors(),
        getPatients()
      ]);

      console.log('Dados recebidos:', {
        consultations: consultationsData.length,
        doctors: doctorsData.length,
        patients: patientsData.length
      });

      // Log das consultas para debug
      if (consultationsData.length > 0) {
        console.log('Primeiras 3 consultas:', consultationsData.slice(0, 3).map(c => ({
          id: c.id,
          date: c.date,
          time: c.time
        })));
      }

      setConsultations(consultationsData);
      setDoctors(doctorsData as Doctor[]);
      setPatients(patientsData as Patient[]);

      // Calcular estatísticas com comparação de datas normalizada
      const today = new Date().toISOString().split('T')[0];
      console.log('Data de hoje para comparação:', today);
      
      const consultationsToday = consultationsData.filter((c: Consultation) => {
        const consultationDate = String(c.date).split('T')[0];
        const isToday = consultationDate === today;
        console.log(`Consulta ${c.id}: ${consultationDate} === ${today} = ${isToday}`);
        return isToday;
      });
      
      // Usar 'Agendada' em vez de 'Agendada' para consistência
      const scheduledConsultations = consultationsData.filter(
        (c: Consultation) => c.status === 'Agendada'
      );
      
      const inProgressConsultations = consultationsData.filter(
        (c: Consultation) => c.status === 'Em Andamento'
      );
      
      const completedConsultations = consultationsData.filter(
        (c: Consultation) => c.status === 'Concluída'
      );
      
      const newStats = {
        today: consultationsToday.length,
        scheduled: scheduledConsultations.length,
        inProgress: inProgressConsultations.length,
        completed: completedConsultations.length
      };
      
      console.log('Estatísticas calculadas:', newStats);
      setStats(newStats);

      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das consultas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, doctorIdFilter]);

  // Garantir que selectedDate seja sempre normalizada
  useEffect(() => {
    const normalizedDate = selectedDate.split('T')[0];
    if (normalizedDate !== selectedDate) {
      console.log('Normalizando selectedDate:', selectedDate, '->', normalizedDate);
      setSelectedDate(normalizedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Manipulação do input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manipulação do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      if (modalMode === 'create') {
        // Criar consulta com novos tipos
        const createData: CreateConsultationData = {
          date: formData.date,
          time: formData.time,
          doctor_id: formData.doctor_id,
          patient_id: formData.patient_id
        };
        
        const result = await handleCreateConsultation(createData);
        
        if (result?.error) {
          setFormError(result.error);
        } else {
          setSuccess(true);
          setTimeout(() => {
            handleModalSuccess();
          }, 1500);
        }
      } else if (modalMode === 'edit' && selectedConsultation) {
        // Editar consulta com novos tipos
        const updateData: UpdateConsultationData = {
          id: selectedConsultation.id,
          date: formData.date,
          time: formData.time,
          doctor_id: formData.doctor_id,
          patient_id: formData.patient_id
        };
        
        const result = await handleUpdateConsultation(updateData);
        
        if (result?.error) {
          setFormError(result.error);
        } else {
          setSuccess(true);
          setTimeout(() => {
            handleModalSuccess();
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      setFormError('Erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAdd = () => {
    // Reset do formulário para valores padrão
    setFormData({
      id: '',
      date: selectedDate,
      time: '08:00',
      doctor_id: '',
      patient_id: ''
    });
    setSelectedConsultation(null);
    setModalMode('create');
    setSuccess(false);
    setFormError(null);
    setShowModal(true);
  };

  const handleEdit = (consultation: Consultation) => {
    setFormData({
      id: consultation.id,
      date: consultation.date,
      time: consultation.time,
      doctor_id: consultation.doctor_id,
      patient_id: consultation.patient_id
    });
    setSelectedConsultation(consultation);
    setModalMode('edit');
    setSuccess(false);
    setFormError(null);
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

  const clearDoctorFilter = () => {
    router.push('/pages/consultation');
  };

  // Filtro robusto para consultas do dia
  const consultationsOfDay = consultations.filter(c => {
    // Normalizar ambas as datas para comparação
    const consultationDateStr = String(c.date).split('T')[0];
    const selectedDateStr = selectedDate.split('T')[0];
    return consultationDateStr === selectedDateStr;
  });

  // Navegação de datas sem problemas de timezone
  const nextDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 1);
    const newDateStr = date.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
  };

  const previousDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    const newDateStr = date.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 w-full relative overflow-hidden pb-10"
    >
      {/* Background Elements */}
      <ConsultationBackground />

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3 mb-6 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-300 font-medium">Erro ao carregar dados</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Tentar novamente</span>
          </button>
        </motion.div>
      )}
      
      {/* Header */}
      <ConsultationHeader 
        loading={loading}
        consultations={consultations}
        doctorIdFilter={doctorIdFilter}
        getDoctorById={getDoctorById}
        clearDoctorFilter={clearDoctorFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        nextDay={nextDay}
        previousDay={previousDay}
        handleAdd={handleAdd}
      />

      {/* Stats Cards */}
      <ConsultationStats 
        stats={stats}
        loading={loading}
      />

      {/* Layout de duas colunas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna principal (2/3) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Day Agenda */}
          <ConsultationDayAgenda
            loading={loading}
            selectedDate={selectedDate}
            consultationsOfDay={consultationsOfDay}
            getDoctorById={getDoctorById}
            getPatientById={getPatientById}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAdd={handleAdd}
          />

          {/* Weekly View */}
          <ConsultationWeeklyView
            loading={loading}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            consultations={consultations}
            getPatientById={getPatientById}
          />
        </div>

        {/* Sidebar (1/3) */}
        <ConsultationDoctorsSidebar
          loading={loading}
          doctors={doctors}
          consultationsOfDay={consultationsOfDay}
          getPatientById={getPatientById}
        />
      </div>

      {/* Weekly Table */}
      <ConsultationWeeklyTable
        consultationsOfDay={consultationsOfDay}
        getDoctorById={getDoctorById}
        getPatientById={getPatientById}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Modal */}
      <ConsultationModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalMode={modalMode}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        success={success}
        formError={formError}
        doctors={doctors}
        patients={patients}
      />
    </motion.div>
  );
}