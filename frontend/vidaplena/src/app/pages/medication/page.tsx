"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt,
  Plus,
  Download,
  Eye,
  Search,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Clock,
  Printer,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X
} from 'lucide-react';

// Importar as novas ações do servidor
import {
  getPrescriptions,
  handleAddMedication, 
  handleRemoveMedication  
} from '@/hooks/medication/useMedication';

// Usar actions existentes para receitas e consultas
import {
  getConsultations,
  getDoctors,
  getPatients
} from '@/hooks/consultation/useConsultation';

// Vamos definir as interfaces importadas diretamente já que não conseguimos importá-las
interface ImportedDoctor {
  id: string;
  name: string;
  crm?: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

interface ImportedPatient {
  id: string;
  name: string;
  cpf?: string;
  date_birth?: string;
  address?: string;
  phone?: string;
}

interface ImportedConsultation {
  id: string;
  date: string;
  time: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  doctor?: ImportedDoctor;
  patient?: ImportedPatient;
}

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

interface PrescriptionConsultation {
  id: string;
  date: string;
  time: string;
  doctor: Doctor;
  patient: Patient;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  prescription_id: string;
}

interface Prescription {
  id: string;
  consultation_id: string;
  created_at: string;
  updated_at: string;
  consultation?: PrescriptionConsultation;
  medications: Medication[];
}

interface PrescriptionStats {
  total: number;
  thisMonth: number;
  totalMedications: number;
  uniquePatients: number;
}

export default function MedicationPage() {
  // Estados para gerenciar os dados
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [medicationFilter, setMedicationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const [stats, setStats] = useState<PrescriptionStats>({
    total: 0,
    thisMonth: 0,
    totalMedications: 0,
    uniquePatients: 0
  });
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add-medication' | 'view'>('add-medication');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Função para converter os tipos importados para os tipos locais
  const convertDoctor = useCallback((doctor: ImportedDoctor): Doctor => {
    return {
      id: doctor.id,
      name: doctor.name,
      crm: doctor.crm || '',
      specialty: doctor.specialty || '',
      phone: doctor.phone || '',
      email: doctor.email || ''
    };
  }, []);

  const convertPatient = useCallback((patient: ImportedPatient): Patient => {
    return {
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf || '',
      date_birth: patient.date_birth || '',
      address: patient.address || '',
      phone: patient.phone || ''
    };
  }, []);

  const convertConsultation = useCallback((consultation: ImportedConsultation): Consultation => {
    return {
      id: consultation.id,
      date: consultation.date,
      time: consultation.time,
      doctor_id: consultation.doctor_id,
      patient_id: consultation.patient_id,
      status: consultation.status,
      doctor: consultation.doctor ? convertDoctor(consultation.doctor) : undefined,
      patient: consultation.patient ? convertPatient(consultation.patient) : undefined
    };
  }, [convertDoctor, convertPatient]);

  // Carregar dados da API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prescriptionsData, consultationsData, doctorsData, patientsData] = await Promise.all([
        getPrescriptions(),
        getConsultations(),
        getDoctors(),
        getPatients()
      ]);

      // Verificar se houve erro na resposta de prescrições
      if (prescriptionsData.error) {
        throw new Error(prescriptionsData.error);
      }

      // Converter os tipos importados para os tipos locais
      const convertedConsultations = consultationsData.map(convertConsultation);
      const convertedDoctors = doctorsData.map(convertDoctor);
      const convertedPatients = patientsData.map(convertPatient);

      console.log('Dados carregados:', {
        prescriptions: prescriptionsData.length,
        consultations: convertedConsultations.length,
        doctors: convertedDoctors.length,
        patients: convertedPatients.length
      });

      // Usar dados reais em vez de dados mock
      setPrescriptions(prescriptionsData);
      setConsultations(convertedConsultations);
      setDoctors(convertedDoctors);
      setPatients(convertedPatients);

      // Calcular estatísticas
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const thisMonthPrescriptions = prescriptionsData.filter((prescription: Prescription) => {
        const prescriptionDate = new Date(prescription.created_at);
        return prescriptionDate.getMonth() === currentMonth && prescriptionDate.getFullYear() === currentYear;
      });

      const totalMedications = prescriptionsData.reduce((total: number, prescription: Prescription) => 
        total + (prescription.medications?.length || 0), 0
      );

      const uniquePatients = new Set(
        prescriptionsData.map((prescription: Prescription) => {
          if (prescription.consultation?.patient?.id) {
            return prescription.consultation.patient.id;
          }
          const relatedConsultation = convertedConsultations.find(c => c.id === prescription.consultation_id);
          return relatedConsultation?.patient_id;
        }).filter(Boolean)
      ).size;

      setStats({
        total: prescriptionsData.length,
        thisMonth: thisMonthPrescriptions.length,
        totalMedications,
        uniquePatients
      });

      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das receitas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [convertConsultation, convertDoctor, convertPatient]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleView = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setModalMode('view');
    setShowModal(true);
  };

  const handleAddMedicationModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setModalMode('add-medication');
    setShowModal(true);
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (!confirm('Tem certeza que deseja remover este medicamento?')) {
      return;
    }

    try {
      const result = await handleRemoveMedication(medicationId);
      if (result?.error) {
        alert(`Erro: ${result.error}`);
      } else {
        await loadData();
      }
    } catch (error) {
      console.error('Erro ao remover medicamento:', error);
      alert('Erro ao remover medicamento');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Funções de utilidade
  const getConsultationById = (id: string) => {
    return consultations.find(consultation => consultation.id === id);
  };

  const getDoctorById = (id: string) => {
    return doctors.find(doctor => doctor.id === id);
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  // Filtrar receitas
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const consultation = getConsultationById(prescription.consultation_id);
    
    // Para o objeto consultation dentro da receita, já temos patient e doctor diretos
    const prescriptionPatient = prescription.consultation?.patient;
    const prescriptionDoctor = prescription.consultation?.doctor;

    // Para uma consulta normal, precisamos buscar patient e doctor
    const patient = prescriptionPatient || (consultation?.patient || (consultation?.patient_id ? getPatientById(consultation.patient_id) : undefined));
    const doctor = prescriptionDoctor || (consultation?.doctor || (consultation?.doctor_id ? getDoctorById(consultation.doctor_id) : undefined));

    const matchesSearch = !searchTerm || 
      (patient?.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDoctor = !doctorFilter || 
      (doctor?.name && doctor.name.toLowerCase().includes(doctorFilter.toLowerCase()));

    const matchesMedication = !medicationFilter || 
      prescription.medications?.some(med => 
        med.name.toLowerCase().includes(medicationFilter.toLowerCase())
      );

    const matchesDate = !dateFilter || 
      prescription.created_at.split('T')[0] === dateFilter;

    return matchesSearch && matchesDoctor && matchesMedication && matchesDate;
  });

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

  const recentPrescriptions = filteredPrescriptions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

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

      <motion.div
        key="prescriptions"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="space-y-6"
      >
        {/* Header da página */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-slate-800">Receitas Médicas</h2>
            <p className="text-slate-500 mt-1">Prescrições e medicamentos dos pacientes</p>
            <p className="text-sm text-slate-400 mt-1">
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando...</span>
                </span>
              ) : (
                `${filteredPrescriptions.length} receitas emitidas`
              )}
            </p>
          </div>
        </motion.div>

        {/* Cards de estatísticas */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total de Receitas</p>
                <p className="text-2xl font-bold">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total}
                </p>
              </div>
              <Receipt className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
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
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Medicamentos Prescritos</p>
                <p className="text-2xl font-bold">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalMedications}
                </p>
              </div>
              <Pill className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
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
            <h3 className="text-lg font-semibold text-slate-800">Buscar Receitas</h3>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Todas</span>
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por médico..."
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por medicamento..."
                value={medicationFilter}
                onChange={(e) => setMedicationFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Lista de receitas */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800">Receitas Médicas</h3>
            <p className="text-sm text-slate-500">
              {loading ? 'Carregando...' : `${filteredPrescriptions.length} receitas encontradas`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-slate-500">Carregando receitas...</p>
              </div>
            </div>
          ) : filteredPrescriptions.length > 0 ? (
            <div className="grid gap-6">
              {filteredPrescriptions.map((prescription, index) => {
                const consultation = getConsultationById(prescription.consultation_id);
                
                // Para o objeto consultation dentro da receita, já temos patient e doctor diretos
                const prescriptionPatient = prescription.consultation?.patient;
                const prescriptionDoctor = prescription.consultation?.doctor;

                // Para uma consulta normal, precisamos buscar patient e doctor
                const patient = prescriptionPatient || (consultation?.patient || (consultation?.patient_id ? getPatientById(consultation.patient_id) : undefined));
                const doctor = prescriptionDoctor || (consultation?.doctor || (consultation?.doctor_id ? getDoctorById(consultation.doctor_id) : undefined));

                const medications = prescription.medications || [];
                
                return (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Header da receita */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                          <Receipt className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-800">{patient?.name}</h4>
                          <p className="text-sm text-slate-500 mb-1">
                            Prescrito por: Dr(a). {doctor?.name} • CRM: {doctor?.crm}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <span>📅 {consultation?.date ? new Date(consultation.date).toLocaleDateString('pt-BR') : prescription.consultation?.date ? new Date(prescription.consultation.date).toLocaleDateString('pt-BR') : 'N/A'}</span>
                            <span>🕐 {consultation?.time || prescription.consultation?.time}</span>
                            <span>💊 {medications.length} medicamento{medications.length !== 1 ? 's' : ''}</span>
                            <span>📋 Receita #{prescription.id.slice(-6)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleView(prescription)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Visualizar receita"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddMedicationModal(prescription)}
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Adicionar medicamento"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Imprimir receita"
                        >
                          <Printer className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="Baixar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Conteúdo da receita */}
                    <div className="space-y-6">
                      {/* Medicamentos prescritos */}
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Pill className="w-6 h-6 text-emerald-600" />
                            <h5 className="font-bold text-slate-800 text-lg">Medicamentos Prescritos</h5>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddMedicationModal(prescription)}
                            className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Adicionar</span>
                          </motion.button>
                        </div>
                        <div className="space-y-3">
                          {medications.map((medication, idx) => (
                            <motion.div
                              key={medication.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start justify-between p-3 bg-white rounded-lg border border-emerald-100"
                            >
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs font-bold">{idx + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-800">{medication.name} - {medication.dosage}</p>
                                  <p className="text-sm text-slate-600 mt-1">{medication.instructions}</p>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteMedication(medication.id)}
                                className="p-1 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                title="Remover medicamento"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          ))}
                          {medications.length === 0 && (
                            <div className="text-center py-8">
                              <Pill className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                              <p className="text-emerald-600 font-medium">Nenhum medicamento prescrito</p>
                              <p className="text-emerald-500 text-sm">Clique em &quot;Adicionar&quot; para incluir medicamentos</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Informações da consulta */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                        <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                          <User className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 mb-1">Paciente</p>
                          <p className="font-semibold text-slate-800 text-sm">{patient?.name}</p>
                          <p className="text-xs text-slate-400">{patient?.cpf}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                          <Stethoscope className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 mb-1">Médico Responsável</p>
                          <p className="font-semibold text-slate-800 text-sm">{doctor?.name}</p>
                          <p className="text-xs text-slate-400">{doctor?.specialty}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                          <Calendar className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 mb-1">Data da Prescrição</p>
                          <p className="font-semibold text-slate-800 text-sm">
                            {consultation?.date ? new Date(consultation.date).toLocaleDateString('pt-BR') : prescription.consultation?.date ? new Date(prescription.consultation.date).toLocaleDateString('pt-BR') : 'N/A'}
                          </p>
                          <p className="text-xs text-slate-400">{consultation?.time || prescription.consultation?.time}</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                          <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                          <p className="text-xs text-emerald-600 mb-1">Validade</p>
                          <p className="font-semibold text-emerald-800 text-sm">30 dias</p>
                          <p className="text-xs text-emerald-500">A partir da emissão</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-2">Nenhuma receita encontrada</p>
              <p className="text-slate-400 text-sm mb-6">
                As receitas médicas aparecerão aqui após serem emitidas
              </p>
            </div>
          )}
        </motion.div>

        {/* Receitas recentes */}
        {recentPrescriptions.length > 0 && (
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Receitas Recentes</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Ver todas
              </motion.button>
            </div>
            
            <div className="space-y-3">
              {recentPrescriptions.map((prescription, index) => {
                const consultation = getConsultationById(prescription.consultation_id);
                
                // Para o objeto consultation dentro da receita, já temos patient e doctor diretos
                const prescriptionPatient = prescription.consultation?.patient;
                const prescriptionDoctor = prescription.consultation?.doctor;

                // Para uma consulta normal, precisamos buscar patient e doctor
                const patient = prescriptionPatient || (consultation?.patient || (consultation?.patient_id ? getPatientById(consultation.patient_id) : undefined));
                const doctor = prescriptionDoctor || (consultation?.doctor || (consultation?.doctor_id ? getDoctorById(consultation.doctor_id) : undefined));

                const numMedicamentos = prescription.medications?.length || 0;
                
                return (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:from-emerald-100 hover:to-green-100 transition-all cursor-pointer"
                    onClick={() => handleView(prescription)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{patient?.name}</p>
                        <p className="text-sm text-slate-500">
                          {doctor?.name} • {numMedicamentos} medicamento{numMedicamentos !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-slate-400">
                          {consultation?.date ? new Date(consultation.date).toLocaleDateString('pt-BR') : prescription.consultation?.date ? new Date(prescription.consultation.date).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(prescription);
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors"
                        title="Ver receita"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Lógica para imprimir
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal para Visualizar/Adicionar Medicamento */}
      {showModal && (
        <MedicationModal
          isOpen={showModal}
          onClose={closeModal}
          prescription={selectedPrescription}
          mode={modalMode}
          onSuccess={handleModalSuccess}
          getConsultationById={getConsultationById}
          getDoctorById={getDoctorById}
          getPatientById={getPatientById}
        />
      )}
    </div>
  );
}

// Componente Modal para Visualizar/Adicionar Medicamento
interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  mode: 'add-medication' | 'view';
  onSuccess: () => void;
  getConsultationById: (id: string) => Consultation | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
}

function MedicationModal({
  isOpen,
  onClose,
  prescription,
  mode,
  onSuccess,
  getConsultationById,
  getDoctorById,
  getPatientById
}: MedicationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    dosage: string;
    instructions: string;
  }>({
    name: '',
    dosage: '',
    instructions: ''
  });

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen && mode === 'add-medication') {
      setFormData({
        name: '',
        dosage: '',
        instructions: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [isOpen, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.instructions) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (!prescription?.id) {
      setError('Receita não encontrada');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('prescription_id', prescription.id);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('dosage', formData.dosage);
      formDataToSend.append('instructions', formData.instructions);

      const result = await handleAddMedication(formDataToSend);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Dados para visualização
  const consultation = prescription ? getConsultationById(prescription.consultation_id) : null;
  
  // Para o objeto consultation dentro da receita, já temos patient e doctor diretos
  const prescriptionPatient = prescription?.consultation?.patient;
  const prescriptionDoctor = prescription?.consultation?.doctor;

  // Para uma consulta normal, precisamos buscar patient e doctor
  const patient = prescriptionPatient || (consultation?.patient || (consultation?.patient_id ? getPatientById(consultation.patient_id) : undefined));
  const doctor = prescriptionDoctor || (consultation?.doctor || (consultation?.doctor_id ? getDoctorById(consultation.doctor_id) : undefined));

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
            {mode === 'add-medication' && 'Adicionar Medicamento'}
            {mode === 'view' && 'Visualizar Receita'}
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
              <div className="p-4 bg-emerald-50 rounded-lg">
                <label className="text-sm font-medium text-slate-600">Data da Consulta</label>
                <p className="text-lg font-semibold text-slate-800">
                  {consultation?.date ? new Date(consultation.date).toLocaleDateString('pt-BR') : prescription?.consultation?.date ? new Date(prescription.consultation.date).toLocaleDateString('pt-BR') : 'N/A'} às {consultation?.time || prescription?.consultation?.time}
                </p>
              </div>

              {/* Medicamentos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Medicamentos Prescritos ({prescription?.medications?.length || 0})
                </label>
                <div className="space-y-3">
                  {prescription?.medications?.map((medication, idx) => (
                    <div key={medication.id} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 mb-1">{medication.name} - {medication.dosage}</p>
                          <p className="text-sm text-slate-600">{medication.instructions}</p>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                      <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">Nenhum medicamento prescrito</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadados */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="text-sm font-medium text-slate-600">Criado em</label>
                  <p className="text-slate-800">
                    {prescription ? new Date(prescription.created_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Última atualização</label>
                  <p className="text-slate-800">
                    {prescription ? new Date(prescription.updated_at).toLocaleString('pt-BR') : 'N/A'}
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
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Baixar PDF
                </motion.button>
              </div>
            </div>
          ) : (
            // Modo adicionar medicamento
            <motion.form onSubmit={handleSubmit} className="space-y-4">
              {/* Informações da receita */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <h4 className="font-semibold text-emerald-800 mb-2">Receita: {patient?.name}</h4>
                <p className="text-sm text-emerald-600">
                  Dr(a). {doctor?.name} • {consultation?.date ? new Date(consultation.date).toLocaleDateString('pt-BR') : prescription?.consultation?.date ? new Date(prescription.consultation.date).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>

              {/* Nome do medicamento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Medicamento *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Paracetamol, Amoxicilina..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Dosagem */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dosagem *
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  placeholder="Ex: 500mg, 1g, 20ml..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Instruções */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Instruções de Uso *
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Ex: Tomar 1 comprimido a cada 8 horas por 7 dias..."
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-vertical"
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
                    <span>Medicamento adicionado com sucesso!</span>
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
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  } transition-colors disabled:opacity-70`}
                >
                  {isLoading ? (
                    <>
                      <div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      />
                      <span>Adicionando...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Medicamento</span>
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