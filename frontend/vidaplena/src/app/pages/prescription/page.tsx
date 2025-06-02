"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt,
  Plus,  
  Eye,
  Search,
  Calendar,
  User,
  Stethoscope,
  Pill,  
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X
} from 'lucide-react';

// Importações server actions corretas
import {
  getPrescriptions,
  handleAddMedication, 
  handleRemoveMedication  
} from '@/server/prescription/usePrescription';

// Server actions para médicos e pacientes
import { getDoctors } from '@/server/doctor/useDoctor';
import { getPatients } from '@/server/patient/usePatient';

import { Patient } from '@/types/patient.type';
import { Doctor } from '@/types/doctor.type'; 
import { Prescription } from '@/types/prescription.type';

// Componentes UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

interface PrescriptionStats {
  total: number;
  thisMonth: number;
  totalMedications: number;
  uniquePatients: number;
}

// Interface alinhada com o backend
interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Variantes de animação
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Elementos de background estilizados
const backgroundElements = [
  { left: '5%', top: '15%', size: 200 },
  { left: '90%', top: '10%', size: 250 },
  { left: '80%', top: '60%', size: 180 },
  { left: '20%', top: '80%', size: 220 },
  { left: '40%', top: '30%', size: 160 }
];

const floatingVariants = {
  animate: {
    y: ['-5%', '5%', '-5%'],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function PrescriptionPage() {
  // Estados
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]); // Corrigido: doctors em vez de medicos
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [medicationFilter, setMedicationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Estados para estatísticas
  const [stats, setStats] = useState<PrescriptionStats>({
    total: 0,
    thisMonth: 0,
    totalMedications: 0,
    uniquePatients: 0
  });
  
  // Estados para o modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add-medication' | 'view'>('add-medication');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    dosage: '',
    frequency: '',
    duration: ''
  });
  const [success, setSuccess] = useState(false);

  // Carregar dados da API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prescriptionsData, doctorsData, patientsData] = await Promise.all([
        getPrescriptions(),
        getDoctors(),
        getPatients()
      ]);

      console.log('Dados carregados:', {
        prescriptions: Array.isArray(prescriptionsData) ? prescriptionsData.length : 0,
        doctors: Array.isArray(doctorsData) ? doctorsData.length : 0,
        patients: Array.isArray(patientsData) ? patientsData.length : 0
      });

      // Verificar se os dados são válidos
      const validPrescriptions = Array.isArray(prescriptionsData) ? prescriptionsData : [];
      const validDoctors = Array.isArray(doctorsData) ? doctorsData : [];
      const validPatients = Array.isArray(patientsData) ? patientsData : [];

      // Atualizar estados
      setPrescriptions(validPrescriptions);
      setDoctors(validDoctors); // Corrigido
      setPatients(validPatients);

      // Calcular estatísticas
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const thisMonthPrescriptions = validPrescriptions.filter((prescription: Prescription) => {
        if (!prescription.created_at) return false;
        const prescriptionDate = new Date(prescription.created_at);
        return prescriptionDate.getMonth() === currentMonth && prescriptionDate.getFullYear() === currentYear;
      });

      const totalMedications = validPrescriptions.reduce((total: number, prescription: Prescription) => 
        total + (prescription.medications?.length || 0), 0
      );

      // Corrigido: Usar consultation para acessar patient_id e doctor_id
      const uniquePatients = new Set(
        validPrescriptions
          .map((prescription: Prescription) => prescription.consultation?.patient?.id)
          .filter(Boolean)
      ).size;

      setStats({
        total: validPrescriptions.length,
        thisMonth: thisMonthPrescriptions.length,
        totalMedications,
        uniquePatients
      });

      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados das receitas. Por favor, tente novamente.');
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
    setSuccess(false);
    setError(null);
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Funções de utilidade usando consultation
  const getPatientFromPrescription = (prescription: Prescription): Patient | undefined => {
    // Primeiro tenta pelo relationship direto
    if (prescription.consultation?.patient) {
      return prescription.consultation.patient as Patient;
    }
    
    // Se não tiver, busca pelo ID na lista de pacientes
    const patientId = prescription.consultation?.patient?.id;
    if (patientId) {
      return patients.find(patient => patient.id === patientId);
    }
    
    return undefined;
  };

  const getDoctorFromPrescription = (prescription: Prescription): Doctor | undefined => {
    // Primeiro tenta pelo relationship direto
    if (prescription.consultation?.doctor) {
      return prescription.consultation.doctor as Doctor;
    }
    
    // Se não tiver, busca pelo ID na lista de médicos
    const doctorId = prescription.consultation?.doctor?.id;
    if (doctorId) {
      return doctors.find(doctor => doctor.id === doctorId);
    }
    
    return undefined;
  };

  // Filtrar receitas usando consultation
  const filteredPrescriptions = prescriptions.filter((prescription: Prescription) => {
    const patient = getPatientFromPrescription(prescription);
    const doctor = getDoctorFromPrescription(prescription);

    const matchesSearch = !searchTerm || 
      (patient?.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDoctor = !doctorFilter || 
      (doctor?.name && doctor.name.toLowerCase().includes(doctorFilter.toLowerCase()));

    const matchesMedication = !medicationFilter || 
      prescription.medications?.some(med => 
        med.name.toLowerCase().includes(medicationFilter.toLowerCase())
      );

    const matchesDate = !dateFilter || 
      (prescription.consultation?.date && prescription.consultation.date.toString().split('T')[0] === dateFilter);

    return matchesSearch && matchesDoctor && matchesMedication && matchesDate;
  });

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (showModal && modalMode === 'add-medication') {
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        duration: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [showModal, modalMode]);

  // Manipulação do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.frequency || !formData.duration) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (!selectedPrescription?.id) {
      setError('Receita não encontrada');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Usar instructions em vez de frequency/duration conforme o type
      const result = await handleAddMedication(selectedPrescription.id, {
        name: formData.name,
        dosage: formData.dosage,
        instructions: `${formData.frequency} por ${formData.duration}` // Combinar em instructions
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          handleModalSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Ordenar por data de criação, mais recentes primeiro
  const recentPrescriptions = [...prescriptions]
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 w-full relative overflow-hidden pb-10"
    >
      {/* Elementos de background estilizados */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundElements.map((el, i) => (
          <motion.div
            key={i}
            variants={floatingVariants}
            animate="animate"
            className="absolute rounded-full bg-gradient-to-r from-emerald-900/10 to-blue-900/10 dark:from-emerald-500/10 dark:to-blue-500/10 blur-3xl"
            style={{
              left: el.left,
              top: el.top,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

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

      {/* Cabeçalho da página */}
      <motion.div
        variants={itemVariants}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-500 dark:from-emerald-400 dark:to-blue-300">
            Receitas Médicas
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Prescrições e medicamentos dos pacientes</p>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {/* Total de receitas */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
            <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.total}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Total de Receitas
          </h3>
          <Separator className="my-2 bg-emerald-200 dark:bg-emerald-800" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Receitas emitidas no sistema</p>
        </div>
        
        {/* Receitas este mês */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.thisMonth}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Este Mês
          </h3>
          <Separator className="my-2 bg-blue-200 dark:bg-blue-800" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Novas receitas no mês atual</p>
        </div>
        
        {/* Medicamentos */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <Pill className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.totalMedications}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Medicamentos
          </h3>
          <Separator className="my-2 bg-purple-200 dark:bg-purple-800" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Total de medicamentos prescritos</p>
        </div>
        
        {/* Pacientes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-orange-500 dark:text-orange-400" />
            <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.uniquePatients}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Pacientes
          </h3>
          <Separator className="my-2 bg-orange-200 dark:bg-orange-800" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Pacientes com prescrições</p>
        </div>
      </motion.div>

      {/* Busca e filtros */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-100 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Buscar Receitas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por médico..."
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por medicamento..."
              value={medicationFilter}
              onChange={(e) => setMedicationFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </motion.div>

      {/* Lista de receitas */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">Receitas Médicas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loading ? 'Carregando...' : `${filteredPrescriptions.length} receitas encontradas`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 dark:text-emerald-400" />
              <p className="text-slate-500 dark:text-slate-400">Carregando receitas...</p>
            </div>
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription: Prescription, index: number) => {
              // Usar as funções helper
              const patient = getPatientFromPrescription(prescription);
              const doctor = getDoctorFromPrescription(prescription);
              const medications = prescription.medications || [];
              
              return (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, backgroundColor: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
                  onClick={() => handleView(prescription)}
                >
                  {/* Conteúdo da receita */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{patient?.name || 'Paciente não encontrado'}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Dr(a). {doctor?.name || 'Médico não encontrado'} • 
                        {medications.length} medicamento{medications.length !== 1 ? 's' : ''}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400 dark:text-slate-500 mt-1">
                        <span>{prescription.consultation?.date ? new Date(prescription.consultation.date).toLocaleDateString('pt-BR') : 'Data desconhecida'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(prescription);
                      }}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Visualizar receita"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMedicationModal(prescription);
                      }}
                      className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                      title="Adicionar medicamento"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>    
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <Receipt className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">Nenhuma receita encontrada</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
              As receitas médicas aparecerão aqui após serem emitidas
            </p>
          </div>
        )}
      </motion.div>

      {/* Seção de prescrições recentes */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Receitas Recentes</h3>
        </div>

        {recentPrescriptions.length > 0 ? (
          <div className="space-y-3">
            {recentPrescriptions.map((prescription) => {
              const patient = getPatientFromPrescription(prescription);
              
              return (
                <div 
                  key={prescription.id}
                  className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => handleView(prescription)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{patient?.name || 'Paciente desconhecido'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {prescription.consultation?.date ? new Date(prescription.consultation.date).toLocaleDateString('pt-BR') : 'Data desconhecida'}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                      {prescription.medications?.length || 0} medicamentos
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">Nenhuma receita recente</p>
          </div>
        )}
      </motion.div>

      {/* Modal para Visualizar/Adicionar Medicamento */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-500 dark:from-emerald-400 dark:to-blue-300">
              {modalMode === 'add-medication' && 'Adicionar Medicamento'}
              {modalMode === 'view' && 'Visualizar Receita'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'add-medication' && 'Adicione um novo medicamento a esta receita.'}
              {modalMode === 'view' && 'Detalhes completos da receita médica.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={modalMode !== 'view' ? handleSubmit : undefined} className="space-y-4">
            {modalMode === 'view' ? (
              // Modo visualização
              <>
                {/* Informações do paciente e médico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Paciente</label>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {selectedPrescription ? getPatientFromPrescription(selectedPrescription)?.name || 'Não encontrado' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Médico</label>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {selectedPrescription ? getDoctorFromPrescription(selectedPrescription)?.name || 'Não encontrado' : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Data da consulta */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-emerald-200">Data da Receita</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-emerald-300">
                    {selectedPrescription?.consultation?.date ? 
                      new Date(selectedPrescription.consultation.date).toLocaleDateString('pt-BR') : 'Não encontrada'}
                  </p>
                </div>

                {/* Informações adicionais da consulta */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-blue-200">Informações da Consulta</label>
                  <p className="text-slate-800 dark:text-blue-300">
                    {selectedPrescription?.consultation?.time ? `Horário: ${selectedPrescription.consultation.time}` : 'Sem informações adicionais'}
                  </p>
                </div>

                {/* Medicamentos */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Medicamentos Prescritos ({selectedPrescription?.medications?.length || 0})
                  </label>
                  <div className="space-y-3">
                    {selectedPrescription?.medications?.map((medication, idx) => (
                      <div key={medication.id} className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-800 dark:text-emerald-200 mb-1">{medication.name} - {medication.dosage}</p>
                              <p className="text-sm text-slate-600 dark:text-emerald-300 mb-1">{medication.instructions || 'Sem instruções específicas'}</p>
                            </div>
                          </div>
                          {/* Botão para remover medicamento */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMedication(medication.id);
                              closeModal();
                            }}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                            title="Remover medicamento"
                            type="button"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <Pill className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">Nenhum medicamento prescrito</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Criado em</label>
                    <p className="text-slate-800 dark:text-slate-300">
                      {selectedPrescription ? new Date(selectedPrescription.created_at).toLocaleString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Última atualização</label>
                    <p className="text-slate-800 dark:text-slate-300">
                      {selectedPrescription ? new Date(selectedPrescription.updated_at).toLocaleString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                </div>
              </>
            ) : (
              // Modo adicionar medicamento
              <>
                {/* Informações da receita */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                    Receita: {selectedPrescription && getPatientFromPrescription(selectedPrescription)?.name || 'Paciente não encontrado'}
                  </h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">
                    Dr(a). {selectedPrescription && getDoctorFromPrescription(selectedPrescription)?.name || 'Médico não encontrado'}
                  </p>
                </div>

                {/* Nome do medicamento */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nome do Medicamento *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Paracetamol, Amoxicilina..."
                    required
                  />
                </div>

                {/* Dosagem */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Dosagem *
                  </label>
                  <Input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Ex: 500mg, 1g, 20ml..."
                    required
                  />
                </div>

                {/* Frequência */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Frequência *
                  </label>
                  <Input
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="Ex: A cada 8 horas, 2x ao dia..."
                    required
                  />
                </div>

                {/* Duração */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Duração *
                  </label>
                  <Input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex: 7 dias, 2 semanas, contínuo..."
                    required
                  />
                </div>

                {/* Mensagem de erro */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2"
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
                      className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>Medicamento adicionado com sucesso!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || success}
                    className={`${
                      success 
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Adicionado!
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Medicamento
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}