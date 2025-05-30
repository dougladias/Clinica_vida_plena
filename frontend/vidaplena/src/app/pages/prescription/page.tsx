"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Search,  
  Calendar,
  User,
  Stethoscope,
  ClipboardList,
  Activity,
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw
} from 'lucide-react';

import {
  getMedicalRecords,
  handleCreateMedicalRecord,
  handleUpdateMedicalRecord,
  handleDeleteMedicalRecord
} from '@/hooks/prescription/usePrescription';

import {
  getConsultations as getApiConsultations,
  getDoctors as getApiDoctors,
  getPatients as getApiPatients,
  ConsultationDoctor,
  ConsultationPatient,
  Consultation as ApiConsultation
} from '@/hooks/consultation/useConsultation';

// Interfaces baseadas na sua API
interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;
}

interface Patient {
  id: string;
  name: string;
  cpf: string;
  date_birth: string;
  address: string;
  phone: string;
  email: string; // Adicionando email à interface
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

interface MedicalRecord {
  id: string;
  consultation_id: string;
  notes: string;
  diagnosis: string;
  created_at: string;
  updated_at: string;
  consultation?: {
    id: string;
    date: string;
    time: string;
    doctor_id: string; // Adicionando doctor_id
    patient_id: string; // Adicionando patient_id
    doctor: Doctor;
    patient: Patient;
  };
}

interface MedicalRecordStats {
  total: number;
  thisMonth: number;
  completedConsultations: number;
  uniquePatients: number;
}

// Função auxiliar para converter ApiConsultation para Consultation
function convertApiConsultation(apiConsultation: ApiConsultation): Consultation {
  // Converter doctor de ConsultationDoctor para Doctor, se existir
  let doctor: Doctor | undefined = undefined;
  if (apiConsultation.doctor) {
    doctor = {
      id: apiConsultation.doctor.id,
      name: apiConsultation.doctor.name,
      specialty: apiConsultation.doctor.specialty || '',
      crm: apiConsultation.doctor.crm || '',
      email: apiConsultation.doctor.email || '',
      phone: apiConsultation.doctor.phone || ''
    };
  }

  // Converter patient de ConsultationPatient para Patient, se existir
  let patient: Patient | undefined = undefined;
  if (apiConsultation.patient) {
    patient = {
      id: apiConsultation.patient.id,
      name: apiConsultation.patient.name,
      cpf: apiConsultation.patient.cpf || '',
      date_birth: apiConsultation.patient.birthdate || '',
      address: apiConsultation.patient.address || '',
      phone: apiConsultation.patient.phone || '',
      email: apiConsultation.patient.email || ''
    };
  }

  return {
    id: apiConsultation.id,
    date: apiConsultation.date,
    time: apiConsultation.time,
    doctor_id: apiConsultation.doctor_id,
    patient_id: apiConsultation.patient_id,
    status: apiConsultation.status,
    doctor,
    patient
  };
}

export default function PrescriptionPage() {
  // Estados para gerenciar os dados
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
  
  const [stats, setStats] = useState<MedicalRecordStats>({
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
      const [recordsData, apiConsultationsData, apiDoctorsData, apiPatientsData] = await Promise.all([
        getMedicalRecords(),
        getApiConsultations(),
        getApiDoctors(),
        getApiPatients()
      ]);

      // Converter dados da API para formatos locais
      const convertedConsultations = apiConsultationsData.map(convertApiConsultation);

      // Converter doutores da API para o formato local
      const convertedDoctors = apiDoctorsData.map((apiDoctor: ConsultationDoctor): Doctor => ({
        id: apiDoctor.id,
        name: apiDoctor.name,
        specialty: apiDoctor.specialty || '',
        crm: apiDoctor.crm || '',
        email: apiDoctor.email || '',
        phone: apiDoctor.phone || ''
      }));

      // Converter pacientes da API para o formato local
      const convertedPatients = apiPatientsData.map((apiPatient: ConsultationPatient): Patient => ({
        id: apiPatient.id,
        name: apiPatient.name,
        cpf: apiPatient.cpf || '',
        date_birth: apiPatient.birthdate || '',
        address: apiPatient.address || '',
        phone: apiPatient.phone || '',
        email: apiPatient.email || ''
      }));

      console.log('Dados carregados:', {
        records: recordsData.length,
        consultations: convertedConsultations.length,
        doctors: convertedDoctors.length,
        patients: convertedPatients.length
      });

      setMedicalRecords(recordsData);
      setConsultations(convertedConsultations);
      setDoctors(convertedDoctors);
      setPatients(convertedPatients);

      // Calcular estatísticas
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const thisMonthRecords = recordsData.filter((record: MedicalRecord) => {
        const recordDate = new Date(record.created_at);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      });

      const completedConsultations = convertedConsultations.filter(
        (c: Consultation) => c.status === 'Concluída'
      );

      // Correção da função uniquePatients no loadData
      const uniquePatients = new Set(
        recordsData.map((record: MedicalRecord) => {
          const consultationId = record.consultation_id;
          const consultation = record.consultation || convertedConsultations.find(c => c.id === consultationId);
          
          // Verificar adequadamente se temos patient.id ou patient_id disponível
          if (consultation?.patient?.id) {
            return consultation.patient.id;
          } else if (consultation?.patient_id) {
            return consultation.patient_id;
          }
          return null;
        }).filter(Boolean)
      ).size;

      setStats({
        total: recordsData.length,
        thisMonth: thisMonthRecords.length,
        completedConsultations: completedConsultations.length,
        uniquePatients
      });

      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados dos prontuários. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      const result = await handleDeleteMedicalRecord(id);
      if (result?.error) {
        alert(`Erro: ${result.error}`);
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
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Funções de utilidade
  const getConsultationById = (id: string) => {
    const consultation = consultations.find(c => c.id === id);
    if (!consultation) return undefined;
    return consultation;
  };

  const getDoctorById = (id: string) => {
    return doctors.find(doctor => doctor.id === id);
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  // Filtrar prontuários
  const filteredRecords = medicalRecords.filter(record => {
    const consultation = record.consultation || getConsultationById(record.consultation_id);
    const patient = consultation?.patient || getPatientById(consultation?.patient_id || '');
    const doctor = consultation?.doctor || getDoctorById(consultation?.doctor_id || '');

    const matchesSearch = !searchTerm || 
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoctor = !doctorFilter || 
      doctor?.name.toLowerCase().includes(doctorFilter.toLowerCase());

    const matchesDate = !dateFilter || 
      record.created_at.split('T')[0] === dateFilter;

    return matchesSearch && matchesDoctor && matchesDate;
  });

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

      <MedicalRecordsComponent
        medicalRecords={filteredRecords}
        loading={loading}
        stats={stats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        doctorFilter={doctorFilter}
        setDoctorFilter={setDoctorFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleView={handleView}
        handleDelete={handleDelete}
        getConsultationById={getConsultationById}
        getDoctorById={getDoctorById}
        getPatientById={getPatientById}
      />

      {/* Modal para Criar/Editar/Visualizar Prontuário */}
      {showModal && (
        <MedicalRecordModal
          isOpen={showModal}
          onClose={closeModal}
          record={selectedRecord}
          mode={modalMode}
          onSuccess={handleModalSuccess}
          consultations={consultations.filter(c => c.status === 'Concluída')}
          doctors={doctors}
          patients={patients}
          getConsultationById={getConsultationById}
          getDoctorById={getDoctorById}
          getPatientById={getPatientById}
        />
      )}
    </div>
  );
}

// Interface para o componente de Prontuários
interface MedicalRecordsComponentProps {
  medicalRecords: MedicalRecord[];
  loading: boolean;
  stats: MedicalRecordStats;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  doctorFilter: string;
  setDoctorFilter: (doctor: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  handleAdd: () => void;
  handleEdit: (record: MedicalRecord) => void;
  handleView: (record: MedicalRecord) => void;
  handleDelete: (id: string) => void;
  getConsultationById: (id: string) => Consultation | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
}

// Componente principal dos prontuários
const MedicalRecordsComponent: React.FC<MedicalRecordsComponentProps> = ({
  medicalRecords,
  loading,
  stats,
  searchTerm,
  setSearchTerm,
  doctorFilter,
  setDoctorFilter,
  dateFilter,
  setDateFilter,
  handleAdd,
  handleEdit,
  handleView,
  handleDelete,
  getConsultationById,
  getDoctorById,
  getPatientById
}) => {
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

  const recentRecords = medicalRecords
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <motion.div
      key="medical-records"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Prontuários</h2>
          <p className="text-slate-500 mt-1">Registros médicos e histórico dos pacientes</p>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando...</span>
              </span>
            ) : (
              `${medicalRecords.length} prontuários no sistema`
            )}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Prontuário</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total de Prontuários</p>
              <p className="text-2xl font-bold">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total}
              </p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Este Mês</p>
              <p className="text-2xl font-bold">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.thisMonth}
              </p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Registradas</p>
              <p className="text-2xl font-bold">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.completedConsultations}
              </p>
            </div>
            <ClipboardList className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pacientes Atendidos</p>
              <p className="text-2xl font-bold">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.uniquePatients}
              </p>
            </div>
            <User className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Busca e filtros */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Buscar Prontuários</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por paciente ou diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por médico..."
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Lista de prontuários */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Prontuários Médicos</h3>
          <p className="text-sm text-slate-500">
            {loading ? 'Carregando...' : `${medicalRecords.length} registros encontrados`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-slate-500">Carregando prontuários...</p>
            </div>
          </div>
        ) : medicalRecords.length > 0 ? (
          <div className="grid gap-6">
            {medicalRecords.map((record, index) => {
              const consultation = record.consultation || getConsultationById(record.consultation_id);
              const doctor = consultation?.doctor || getDoctorById(consultation?.doctor_id || '');
              const patient = consultation?.patient || getPatientById(consultation?.patient_id || '');
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300"
                >
                  {/* Header do prontuário */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-800">{patient?.name}</h4>
                        <p className="text-sm text-slate-500 mb-1">
                          Atendido por: {doctor?.name} • {doctor?.specialty}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span>📅 {new Date(record.created_at).toLocaleDateString('pt-BR')}</span>
                          <span>🕐 {consultation?.time}</span>
                          <span>📋 Prontuário #{record.id.slice(-6)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleView(record)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Visualizar prontuário"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(record)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                        title="Editar prontuário"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Baixar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(record.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir prontuário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Conteúdo do prontuário */}
                  <div className="space-y-6">
                    {/* Diagnóstico */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center space-x-2 mb-3">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <h5 className="font-semibold text-slate-800">Diagnóstico</h5>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{record.diagnosis}</p>
                    </div>
                    
                    {/* Anotações */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <ClipboardList className="w-5 h-5 text-slate-600" />
                        <h5 className="font-semibold text-slate-800">Anotações da Consulta</h5>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{record.notes}</p>
                    </div>
                    
                    {/* Informações adicionais */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                      <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                        <User className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 mb-1">Paciente</p>
                        <p className="font-medium text-slate-800">{patient?.name}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                        <Stethoscope className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 mb-1">Médico</p>
                        <p className="font-medium text-slate-800">{doctor?.name}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 mb-1">Data da Consulta</p>
                        <p className="font-medium text-slate-800">
                          {consultation?.date ? new Date(consultation.date).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhum prontuário encontrado</p>
            <p className="text-slate-400 text-sm mb-6">
              Os prontuários aparecerão aqui após as consultas serem registradas
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Criar Primeiro Prontuário
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Resumo recente */}
      {recentRecords.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Prontuários Recentes</h3>
          <div className="space-y-3">
            {recentRecords.map((record, index) => {
              const consultation = record.consultation || getConsultationById(record.consultation_id);
              const patient = consultation?.patient || getPatientById(consultation?.patient_id || '');
              const doctor = consultation?.doctor || getDoctorById(consultation?.doctor_id || '');
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => handleView(record)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{patient?.name}</p>
                      <p className="text-sm text-slate-500">
                        {doctor?.name} • {new Date(record.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(record);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Componente Modal para Criar/Editar/Visualizar Prontuário
interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
  consultations: Consultation[];
  doctors: Doctor[];
  patients: Patient[];
  getConsultationById: (id: string) => Consultation | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
}

function MedicalRecordModal({
  isOpen,
  onClose,
  record,
  mode,
  onSuccess,
  consultations,  
  getConsultationById,
  getDoctorById,
  getPatientById
}: MedicalRecordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<{
    consultation_id: string;
    notes: string;
    diagnosis: string;
  }>({
    consultation_id: '',
    notes: '',
    diagnosis: ''
  });

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      if ((mode === 'edit' || mode === 'view') && record) {
        setFormData({
          consultation_id: record.consultation_id,
          notes: record.notes,
          diagnosis: record.diagnosis
        });
      } else {
        setFormData({
          consultation_id: '',
          notes: '',
          diagnosis: ''
        });
      }
      setError('');
      setSuccess(false);
    }
  }, [isOpen, mode, record]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consultation_id || !formData.notes || !formData.diagnosis) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('consultation_id', formData.consultation_id);
      formDataToSend.append('notes', formData.notes);
      formDataToSend.append('diagnosis', formData.diagnosis);

      let result;
      if (mode === 'edit' && record) {
        formDataToSend.append('id', record.id);
        result = await handleUpdateMedicalRecord(formDataToSend);
      } else {
        result = await handleCreateMedicalRecord(formDataToSend);
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
      console.error('Erro ao salvar prontuário:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Dados para visualização
  const consultation = record ? (record.consultation || getConsultationById(record.consultation_id)) : null;
  const doctor = consultation ? (consultation.doctor || getDoctorById(consultation.doctor_id || '')) : null;
  const patient = consultation ? (consultation.patient || getPatientById(consultation.patient_id || '')) : null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {mode === 'create' && 'Novo Prontuário'}
            {mode === 'edit' && 'Editar Prontuário'}
            {mode === 'view' && 'Visualizar Prontuário'}
          </h3>

          {mode === 'view' ? (
            // Modo visualização
            <div className="space-y-6">
              {/* Informações do paciente e médico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-slate-600">Paciente</label>
                  <p className="text-lg font-semibold text-slate-800">{patient?.name}</p>
                  <p className="text-sm text-slate-500">{patient?.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Médico</label>
                  <p className="text-lg font-semibold text-slate-800">{doctor?.name}</p>
                  <p className="text-sm text-slate-500">{doctor?.specialty}</p>
                </div>
              </div>

              {/* Data da consulta */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <label className="text-sm font-medium text-slate-600">Data da Consulta</label>
                <p className="text-lg font-semibold text-slate-800">
                  {consultation?.date ? new Date(consultation.date).toLocaleDateString('pt-BR') : 'N/A'} às {consultation?.time}
                </p>
              </div>

              {/* Diagnóstico */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Diagnóstico
                </label>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <p className="text-slate-700 leading-relaxed">{record?.diagnosis}</p>
                </div>
              </div>

              {/* Anotações */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Anotações da Consulta
                </label>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{record?.notes}</p>
                </div>
              </div>

              {/* Metadados */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="text-sm font-medium text-slate-600">Criado em</label>
                  <p className="text-slate-800">
                    {record ? new Date(record.created_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Última atualização</label>
                  <p className="text-slate-800">
                    {record ? new Date(record.updated_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Fechar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Baixar PDF
                </motion.button>
              </div>
            </div>
          ) : (
            // Modo criação/edição
            <motion.form onSubmit={handleSubmit} className="space-y-4">
              {/* Seleção de consulta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Consulta *
                </label>
                <select
                  name="consultation_id"
                  value={formData.consultation_id}
                  onChange={handleInputChange}
                  required
                  disabled={mode === 'edit'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                >
                  <option value="">Selecione uma consulta</option>
                  {consultations.map(consultation => {
                    const doctorId = consultation.doctor_id || (consultation.doctor?.id || '');
                    const patientId = consultation.patient_id || (consultation.patient?.id || '');
                    const doctor = consultation.doctor || getDoctorById(doctorId);
                    const patient = consultation.patient || getPatientById(patientId);
                    return (
                      <option key={consultation.id} value={consultation.id}>
                        {patient?.name} - {doctor?.name} ({new Date(consultation.date).toLocaleDateString('pt-BR')} às {consultation.time})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Diagnóstico */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Diagnóstico *
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Ex: Gripe comum, Hipertensão arterial..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Anotações */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Anotações da Consulta *
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Descreva os sintomas, exames realizados, tratamento recomendado..."
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                />
              </div>

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
                      Prontuário {mode === 'create' ? 'criado' : 'atualizado'} com sucesso!
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
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
                      <span>{mode === 'create' ? 'Criar Prontuário' : 'Atualizar Prontuário'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}