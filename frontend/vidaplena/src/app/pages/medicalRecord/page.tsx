"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  RefreshCw,
  ChevronRight,
  CalendarDays
} from 'lucide-react';

// Importação das server actions de prontuários médicos (correto)
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
import { Medico } from '@/types/doctor.type';

// Componentes UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

// Variantes para os itens individuais
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Variantes de animação para elementos flutuantes
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

// Elementos de background estilizados
const backgroundElements = [
  { left: '5%', top: '15%', size: 200 },
  { left: '90%', top: '10%', size: 250 },
  { left: '80%', top: '60%', size: 180 },
  { left: '20%', top: '80%', size: 220 },
  { left: '40%', top: '30%', size: 160 }
];

interface MedicalRecordStats {
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
  const [medicos, setMedicos] = useState<Medico[]>([]);
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
      if (Array.isArray(apiDoctorsData)) setMedicos(apiDoctorsData);
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
        } else if (consultation?.patient_id) {
          uniquePatientIds.add(consultation.patient_id);
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

  const getDoctorById = (id: string): Medico | undefined => {  
    if (!id) return undefined;
    return medicos.find(medico => medico.id === id);  
  };

  const getPatientById = (id: string): Patient | undefined => {
    if (!id) return undefined;
    return patients.find(patient => patient.id === id);
  };

  // Filtrar prontuários
  const filteredRecords = medicalRecords.filter((record: MedicalRecord) => {
    const consultation = record.consultation || getConsultationById(record.consultation_id || '');
    const patient = consultation?.patient || getPatientById(consultation?.patient_id || '');
    const doctor = getDoctorById(consultation?.doctor_id || '');

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

  // Ordenar por data de criação, com tratamento de dados ausentes
  const sortedMedicalRecords = [...medicalRecords].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const recentRecords = sortedMedicalRecords.slice(0, 3);

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
            className="absolute rounded-full bg-gradient-to-r from-indigo-900/10 to-blue-900/10 dark:from-indigo-500/10 dark:to-blue-500/10 blur-3xl"
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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
            Prontuários
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Registros médicos e histórico dos pacientes</p>
        </div>

        <Button
          onClick={handleAdd}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Prontuário
        </Button>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {/* Total de Prontuários */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.total}
              </Badge>
            </div>

            <CardTitle className="text-lg font-semibold">Total de Prontuários</CardTitle>
            <Separator className="mt-2 bg-indigo-200 dark:bg-indigo-800" />
          </CardContent>
        </Card>

        {/* Prontuários este mês */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.thisMonth}
              </Badge>
            </div>

            <CardTitle className="text-lg font-semibold">Este Mês</CardTitle>
            <Separator className="mt-2 bg-blue-200 dark:bg-blue-800" />
          </CardContent>
        </Card>

        {/* Consultas Registradas */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <ClipboardList className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.completedConsultations}
              </Badge>
            </div>

            <CardTitle className="text-lg font-semibold">Consultas Registradas</CardTitle>
            <Separator className="mt-2 bg-purple-200 dark:bg-purple-800" />
          </CardContent>
        </Card>

        {/* Pacientes Atendidos */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <User className="w-8 h-8 text-green-500 dark:text-green-400" />
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.uniquePatients}
              </Badge>
            </div>

            <CardTitle className="text-lg font-semibold">Pacientes Atendidos</CardTitle>
            <Separator className="mt-2 bg-green-200 dark:bg-green-800" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Layout de duas colunas para melhor uso do espaço */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna principal (2/3) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Busca e filtros */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Buscar Prontuários</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar por paciente ou diagnóstico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar por médico..."
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>

          {/* Lista de prontuários */}
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
                  const medico = consultation?.medico || getDoctorById(consultation?.doctor_id || '');
                  const patient = consultation?.patient || getPatientById(consultation?.patient_id || '');

                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4, backgroundColor: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
                      onClick={() => handleView(record)}
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
                              Dr(a). {medico?.name || 'Médico não encontrado'} {/* Corrigido */}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {/* Adicionando verificação antes de chamar substring */}
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
                            handleView(record);
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
                            handleEdit(record);
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
                            handleDelete(record.id);
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
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Criar Prontuário</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Coluna lateral (1/3) */}
        <div className="xl:col-span-1 space-y-8">
          {/* Card de Prontuários Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays className="text-indigo-500 dark:text-indigo-400 w-6 h-6" />
                Prontuários Recentes
              </CardTitle>
              <CardDescription>Últimos registros</CardDescription>
            </CardHeader>
            <CardContent>
              {recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record: MedicalRecord, index: number) => {
                    const consultation = record.consultation || getConsultationById(record.consultation_id || '');
                    const patient = consultation?.patient || getPatientById(consultation?.patient_id || '');
                    const doctor = consultation?.medico || getDoctorById(consultation?.doctor_id || '');

                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        onClick={() => handleView(record)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            <p className="font-medium text-slate-800 dark:text-slate-200">{patient?.name || 'Paciente não encontrado'}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs"
                          >
                            Novo
                          </Badge>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="w-3 h-3" />
                            <span>Dr(a). {doctor?.name || 'Médico não encontrado'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="w-3 h-3" />
                            <span>
                              {record.diagnosis ?
                                (record.diagnosis.length > 35 ? record.diagnosis.substring(0, 35) + '...' : record.diagnosis)
                                : 'Sem diagnóstico'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {record.created_at ?
                                new Date(record.created_at).toLocaleDateString('pt-BR') :
                                'Data não disponível'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-2"
                  >
                    Ver todos os prontuários
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Nenhum prontuário recente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas detalhadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Desempenho Mensal</CardTitle>
              <CardDescription>Evolução dos prontuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Prontuários criados</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{stats.thisMonth}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.thisMonth / (stats.total || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Consultas registradas</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{stats.completedConsultations}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.completedConsultations / (stats.total || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Pacientes atendidos</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{stats.uniquePatients}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.uniquePatients / (stats.total || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para Criar/Editar/Visualizar Prontuário */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              {modalMode === 'create' ? 'Novo Prontuário' : modalMode === 'edit' ? 'Editar Prontuário' : 'Visualizar Prontuário'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'create'
                ? 'Preencha os dados para criar um novo prontuário'
                : modalMode === 'edit'
                  ? 'Atualize os dados do prontuário selecionado'
                  : 'Detalhes do prontuário'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={modalMode !== 'view' ? handleSubmitModal : undefined} className="space-y-4">
            {modalMode === 'view' ? (
              // Modo visualização
              <>
                {/* Informações do paciente e médico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Paciente</label>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {selectedRecord?.consultation?.patient?.name ||
                        (selectedRecord?.consultation_id &&
                          getConsultationById(selectedRecord.consultation_id)?.patient_id &&
                          getPatientById(getConsultationById(selectedRecord.consultation_id)?.patient_id || '')?.name) ||
                        'Não encontrado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Médico</label>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {selectedRecord?.consultation?.medico?.name ||
                        (selectedRecord?.consultation_id &&
                          getConsultationById(selectedRecord.consultation_id)?.doctor_id &&
                          getDoctorById(getConsultationById(selectedRecord.consultation_id)?.doctor_id || '')?.name) ||
                        'Não encontrado'}
                    </p>
                  </div>
                </div>

                {/* Data da consulta */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Data da Consulta</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {selectedRecord?.consultation?.date
                      ? new Date(selectedRecord.consultation.date).toLocaleDateString('pt-BR')
                      : selectedRecord?.consultation_id
                        ? getConsultationById(selectedRecord.consultation_id)?.date
                          ? new Date(getConsultationById(selectedRecord.consultation_id)!.date).toLocaleDateString('pt-BR')
                          : 'N/A'
                        : 'N/A'}
                    às {selectedRecord?.consultation?.time ||
                      (selectedRecord?.consultation_id ?
                        getConsultationById(selectedRecord?.consultation_id)?.time || 'N/A'
                        : 'N/A')}
                  </p>
                </div>

                {/* Diagnóstico */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Diagnóstico</label>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedRecord?.diagnosis || 'Sem diagnóstico registrado'}</p>
                  </div>
                </div>

                {/* Anotações */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Anotações da Consulta</label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedRecord?.notes || 'Sem anotações registradas'}</p>
                  </div>
                </div>

                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Criado em</label>
                    <p className="text-slate-800 dark:text-slate-200">
                      {selectedRecord && selectedRecord.created_at ?
                        new Date(selectedRecord.created_at).toLocaleString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Última atualização</label>
                    <p className="text-slate-800 dark:text-slate-200">
                      {selectedRecord && selectedRecord.updated_at ?
                        new Date(selectedRecord.updated_at).toLocaleString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </>
            ) : (
              // Modo criação/edição
              <>
                {/* Seleção de consulta */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Consulta *</label>
                  <select
                    name="consultation_id"
                    value={formData.consultation_id}
                    onChange={handleInputChange}
                    required
                    disabled={modalMode === 'edit'}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:bg-slate-100 dark:disabled:bg-slate-900 text-slate-900 dark:text-slate-200"
                  >
                    <option value="">Selecione uma consulta</option>
                    {consultations.map(consultation => {
                      const doctorId = consultation.doctor_id || (consultation.medico?.id || '');  
                      const patientId = consultation.patient_id || (consultation.patient?.id || '');
                      const medico = consultation.medico || getDoctorById(doctorId);  
                      const patient = consultation.patient || getPatientById(patientId);
                      return (
                        <option key={consultation.id} value={consultation.id}>
                          {patient?.name || 'Paciente'} - {medico?.name || 'Médico'} ({/* ... */})  
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Diagnóstico */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Diagnóstico *</label>
                  <Input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    placeholder="Ex: Gripe comum, Hipertensão arterial..."
                    required
                  />
                </div>

                {/* Anotações */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Anotações da Consulta *</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Descreva os sintomas, exames realizados, tratamento recomendado..."
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-vertical text-slate-900 dark:text-slate-200"
                  />
                </div>

                {/* Mensagem de erro */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Mensagem de sucesso */}
                {success && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Prontuário {modalMode === 'create' ? 'criado' : 'atualizado'} com sucesso!
                    </p>
                  </div>
                )}

                {/* Botões de ação */}
                <div className="flex items-center space-x-3 pt-4">
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
                    className={`flex items-center space-x-2 ${success
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
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
                        <span>{modalMode === 'create' ? 'Criar Prontuário' : 'Atualizar Prontuário'}</span>
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}