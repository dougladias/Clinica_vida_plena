"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Importação das server actions de prontuários médicos
import { 
  getMedicalRecords, 
  handleCreateMedicalRecord, 
  handleUpdateMedicalRecord, 
  handleDeleteMedicalRecord 
} from '@/server/medicalRecord/useMedicalRecord';

// Importação de outras funções e hooks
import { getConsultations } from '@/server/consultation/useConsultation';
import { getDoctors } from '@/server/doctor/useDoctor';
import { getPatients } from '@/server/patient/usePatient';

// Importação dos types
import { Patient } from '@/types/patient.type';
import { Consultation } from '@/types/consultation.type';
import { MedicalRecord } from '@/types/medicalRecord.type';
import { Doctor } from '@/types/doctor.type';

// Importação dos componentes componentizados
import { MedicalRecordHeader } from '@/components/pages/medicalRecord/MedicalRecordHeader';
import { MedicalRecordStats } from '@/components/pages/medicalRecord/MedicalRecordStats';
import { MedicalRecordFilters } from '@/components/pages/medicalRecord/MedicalRecordFilters';
import { MedicalRecordList } from '@/components/pages/medicalRecord/MedicalRecordList';
import { MedicalRecordSidebar } from '@/components/pages/medicalRecord/MedicalRecordSidebar';
import { MedicalRecordModal } from '@/components/pages/medicalRecord/MedicalRecordModal';
import { MedicalRecordBackground } from '@/components/pages/medicalRecord/MedicalRecordBackground';

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

interface MedicalRecordStatsType {
  total: number;
  thisMonth: number;
  completedConsultations: number;
  uniquePatients: number;
}

// Interface para os dados do formulário
interface FormData {
  consultation_id: string;
  diagnosis: string;
  notes: string;
}

export default function MedicalRecordPage() {
  // Estados
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Estados para o formulário e modal
  const [formData, setFormData] = useState<FormData>({
    consultation_id: '',
    diagnosis: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [stats, setStats] = useState<MedicalRecordStatsType>({
    total: 0,
    thisMonth: 0,
    completedConsultations: 0,
    uniquePatients: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Carregar dados da API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar prontuários médicos usando a server action
      const recordsData = await getMedicalRecords();
      
      // Garantir que temos um array válido
      const validRecords = recordsData && Array.isArray(recordsData) ? recordsData : [];
      
      // Atualizar o estado com os prontuários
      setMedicalRecords(validRecords);
      
      // Buscar dados relacionados
      const apiConsultationsData = await getConsultations() || [];
      const apiDoctorsData = await getDoctors() || [];
      const apiPatientsData = await getPatients() || [];

      console.log('Dados carregados:', {
        records: validRecords.length,
        consultations: Array.isArray(apiConsultationsData) ? apiConsultationsData.length : 0,
        doctors: Array.isArray(apiDoctorsData) ? apiDoctorsData.length : 0,
        patients: Array.isArray(apiPatientsData) ? apiPatientsData.length : 0
      });

      // Configuração das consultas, médicos e pacientes
      if (Array.isArray(apiConsultationsData)) setConsultations(apiConsultationsData);
      if (Array.isArray(apiDoctorsData)) setDoctors(apiDoctorsData);
      if (Array.isArray(apiPatientsData)) setPatients(apiPatientsData);

      // Calcular estatísticas
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const thisMonthRecords = validRecords.filter((record: MedicalRecord) => {
        if (!record.created_at) return false;
        const recordDate = new Date(record.created_at);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      });

      // Buscar consultas concluídas corretamente
      const completedConsultations = Array.isArray(apiConsultationsData) ? 
        apiConsultationsData.filter((c: Consultation) => c.status === 'Concluída').length : 0;

      // Cálculo dos pacientes únicos atendidos
      const uniquePatientIds = new Set<string>();
      
      validRecords.forEach((record: MedicalRecord) => {
        const consultationId = record.consultation_id;
        const consultation = record.consultation || 
          (Array.isArray(apiConsultationsData) ? 
            apiConsultationsData.find(c => c.id === consultationId) : null);
      
        if (consultation?.patient?.id) {
          uniquePatientIds.add(consultation.patient.id);
        } else if (consultation?.patient?.id) {
          uniquePatientIds.add(consultation.patient.id);
        }
      });

      setStats({
        total: validRecords.length,
        thisMonth: thisMonthRecords.length,
        completedConsultations,
        uniquePatients: uniquePatientIds.size
      });

      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados dos prontuários. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Inicializar o formulário com os dados do registro selecionado
  useEffect(() => {
    if (selectedRecord && modalMode === 'edit') {
      setFormData({
        consultation_id: selectedRecord.consultation_id || '',
        diagnosis: selectedRecord.diagnosis || '',
        notes: selectedRecord.notes || ''
      });
    } else {
      setFormData({
        consultation_id: '',
        diagnosis: '',
        notes: ''
      });
    }
  }, [selectedRecord, modalMode]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este prontuário?')) {
      return;
    }

    try {
      // Usar a server action para deletar o registro
      const result = await handleDeleteMedicalRecord(id);
      if (result.error) {
        alert(`Erro ao excluir prontuário: ${result.error}`);
      } else {
        await loadData();
      }
    } catch (error) {
      console.error('Erro ao excluir prontuário:', error);
      alert('Erro ao excluir prontuário');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
    setSuccess(false);
    setError(null);
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Funções de utilidade
  const getConsultationById = (id: string): Consultation | undefined => {
    if (!id) return undefined;
    return consultations.find(c => c.id === id);
  };

  const getDoctorById = (id: string): Doctor | undefined => {
    if (!id) return undefined;
    return doctors.find(doctor => doctor.id === id);
  };

  const getPatientById = (id: string): Patient | undefined => {
    if (!id) return undefined;
    return patients.find(patient => patient.id === id);
  };

  // Filtrar prontuários
  const filteredRecords = medicalRecords.filter((record: MedicalRecord) => {
    const consultation = record.consultation || getConsultationById(record.consultation_id || '');
    const patient = consultation?.patient || getPatientById(consultation?.patient?.id || '');
    const doctor = consultation?.doctor || getDoctorById(consultation?.doctor?.id || '');

    const matchesSearch = !searchTerm ||
      (patient?.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDoctor = !doctorFilter ||
      (doctor?.name && doctor.name.toLowerCase().includes(doctorFilter.toLowerCase()));

    const matchesDate = !dateFilter ||
      (record.created_at && record.created_at.toString().split('T')[0] === dateFilter);

    return matchesSearch && matchesDoctor && matchesDate;
  });

  // Função para lidar com alterações nos inputs do formulário
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Função para lidar com o envio do formulário
  async function handleSubmitModal(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.consultation_id || !formData.notes || !formData.diagnosis) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let result;
      if (modalMode === 'edit' && selectedRecord) {
        // Atualiza o prontuário usando a server action
        result = await handleUpdateMedicalRecord({
          id: selectedRecord.id,
          diagnosis: formData.diagnosis,
          notes: formData.notes
        });
      } else {
        // Cria um novo prontuário usando a server action
        result = await handleCreateMedicalRecord({
          consultation_id: formData.consultation_id,
          diagnosis: formData.diagnosis,
          notes: formData.notes
        });
      }

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          handleModalSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  } 
  
  // Renderização do componente
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 w-full relative overflow-hidden pb-10"
    >
      {/* Background Elements */}
      <MedicalRecordBackground />

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-300 font-medium">Erro ao carregar dados</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Tentar novamente</span>
          </button>
        </motion.div>
      )}

      {/* Header */}
      <MedicalRecordHeader 
        onAdd={handleAdd}
        loading={loading}
      />

      {/* Stats Cards */}
      <MedicalRecordStats 
        stats={stats}
        loading={loading}
      />

      {/* Layout de duas colunas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna principal (2/3) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Filters */}
          <MedicalRecordFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            doctorFilter={doctorFilter}
            setDoctorFilter={setDoctorFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          {/* Records List */}
          <MedicalRecordList
            loading={loading}
            filteredRecords={filteredRecords}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            getConsultationById={getConsultationById}
            getDoctorById={getDoctorById}
            getPatientById={getPatientById}
          />
        </div>

        {/* Sidebar (1/3) */}
        <MedicalRecordSidebar stats={stats} />
      </div>

      {/* Modal */}
      <MedicalRecordModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalMode={modalMode}
        selectedRecord={selectedRecord}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmitModal={handleSubmitModal}
        isLoading={isLoading}
        success={success}
        error={error}
        closeModal={closeModal}
        consultations={consultations}
        getDoctorById={getDoctorById}
        getPatientById={getPatientById}
        getConsultationById={getConsultationById}
      />
    </motion.div>
  );
}