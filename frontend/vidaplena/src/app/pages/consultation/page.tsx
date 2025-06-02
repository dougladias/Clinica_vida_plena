"use client";

import React, { useState, useEffect, useCallback } from 'react'; 
import { motion } from 'framer-motion';
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
} from '@/server/consultation/useConsultation';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Consultation,           
  ConsultationDoctor, 
  ConsultationPatient,
  CreateConsultationData, 
  UpdateConsultationData  
} from '@/types/consultation.type';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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

export default function ConsultationPage() {
  // Estados - TYPES ATUALIZADOS
  const [consultations, setConsultations] = useState<Consultation[]>([]); // ← TIPO ATUALIZADO
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
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null); // ← TIPO ATUALIZADO
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Estado do formulário - CAMPOS ATUALIZADOS
  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    doctor_id: '',
    patient_id: ''
  });
  
  const searchParams = useSearchParams();
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
      
      // CORREÇÃO: Usar 'Agendada' em vez de 'Agendada' para consistência
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

  // Manipulação do formulário - ATUALIZADO para novos tipos
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

  const handleEdit = (consultation: Consultation) => { // ← TIPO ATUALIZADO
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

  const router = useRouter();
  const clearDoctorFilter = () => {
    router.push('/pages/consultation');
  };  

  // Elementos de background estilizados
  const backgroundElements = [
    { left: '5%', top: '15%', size: 200 },
    { left: '92%', top: '10%', size: 250 },
    { left: '85%', top: '50%', size: 180 },
    { left: '15%', top: '80%', size: 220 },
    { left: '40%', top: '30%', size: 160 }
  ];

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
            className="absolute rounded-full bg-gradient-to-r from-purple-900/10 to-emerald-900/10 dark:from-purple-500/10 dark:to-emerald-500/10 blur-3xl"
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
      
      {/* Cabeçalho da página */}
      <motion.div 
        variants={itemVariants} 
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-500 dark:from-purple-400 dark:to-emerald-300">
            Consultas
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gerencie os agendamentos da clínica</p>
          
          {/* Contador de consultas e status de carregamento */}
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center">
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500 dark:text-purple-400" />
                <span>Carregando dados...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span><strong>{consultations.length}</strong> consultas no sistema</span>
              </span>
            )}
          </p>

          {/* Indicador de filtro ativo */}
          {doctorIdFilter && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 flex items-center"
            >
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 py-1.5 px-3 rounded-lg mr-2 shadow-sm">
                Filtrando por médico: {getDoctorById(doctorIdFilter)?.name || doctorIdFilter}
              </span>
              <button 
                onClick={clearDoctorFilter}
                className="text-xs text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 underline decoration-dashed underline-offset-2"
              >
                Limpar filtro
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-3">
          {/* Seletor de data com estilo melhorado */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm"
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
              whileTap={{ scale: 0.95 }}
              onClick={previousDay}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="relative">
              <input
                type="date"
                value={selectedDate.split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-lg"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
              whileTap={{ scale: 0.95 }}
              onClick={nextDay}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
          
          {/* Botão de nova consulta */}
          <Button 
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Consulta
          </Button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {/* Consultas de hoje */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-500" />
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.today}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-semibold">Consultas Hoje</CardTitle>
            <Separator className="mt-2 bg-purple-200 dark:bg-purple-800" />
          </CardContent>
        </Card>
        
        {/* Agendadas */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.scheduled}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-semibold">Agendadas</CardTitle>
            <Separator className="mt-2 bg-blue-200 dark:bg-blue-800" />
          </CardContent>
        </Card>
        
        {/* Em andamento */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Stethoscope className="w-8 h-8 text-yellow-500" />
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.inProgress}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-semibold">Em Andamento</CardTitle>
            <Separator className="mt-2 bg-yellow-200 dark:bg-yellow-800" />
          </CardContent>
        </Card>
        
        {/* Concluídas */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.completed}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-semibold">Concluídas</CardTitle>
            <Separator className="mt-2 bg-emerald-200 dark:bg-emerald-800" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Layout de duas colunas para melhor uso do espaço */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna principal (2/3) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Agenda do dia */}
          <motion.div 
            variants={itemVariants} 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Calendar className="text-purple-500 dark:text-purple-400 w-6 h-6" />
                  Agenda do Dia
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {(() => {
                    const [year, month, day] = selectedDate.split('-').map(Number);
                    const displayDate = new Date(year, month - 1, day);
                    
                    return displayDate.toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  })()}
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-emerald-300 rounded-full mt-2" />
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                  {loading ? '...' : `${consultationsOfDay.length} consultas`}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Agendadas para hoje</p>
              </div>
            </div>

            {/* Lista de consultas */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Carregando consultas...</p>
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
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-700 hover:border-purple-100 dark:hover:border-purple-800/50 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Horário */}
                          <div className="text-center min-w-[80px]">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl flex items-center justify-center mx-auto mb-1 shadow-inner">
                              <Clock className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{consultation.time}</p>
                          </div>
                          
                          {/* Paciente */}
                          <div className="min-w-[200px] border-l border-slate-200 dark:border-slate-700 pl-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{patient?.name || "Paciente não encontrado"}</p>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                              {patient?.phone || "Sem telefone"}
                            </p>
                          </div>
                          
                          {/* Médico */}
                          <div className="min-w-[200px] border-l border-slate-200 dark:border-slate-700 pl-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <p className="font-medium text-slate-800 dark:text-slate-200">{doctor?.name || "Médico não encontrado"}</p>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{doctor?.specialty || "Sem especialidade"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Status - REMOVIDO pois não existe no backend */}
                          
                          {/* Ações */}
                          <div className="flex items-center space-x-1">
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(consultation)}
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(consultation.id)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
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
                <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-700 dark:text-slate-300 text-xl mb-2 font-semibold">Nenhuma consulta agendada</p>
                <p className="text-slate-500 dark:text-slate-400 text-base mb-6">
                  Não há consultas marcadas para este dia.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25 -5px rgba(124, 58, 237, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Agendar Consulta</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Visão Semanal */}
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
        </div>

        {/* Coluna lateral (1/3) */}
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
      </div>

      {/* Modal para Criar/Editar Consulta */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-500">
              {modalMode === 'create' ? 'Agendar Consulta' : 'Editar Consulta'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'create' 
                ? 'Preencha os dados para agendar uma nova consulta'
                : 'Atualize os dados da consulta selecionada'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Data da Consulta
              </label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Horário
              </label>
              <Input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Médico
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all appearance-none text-slate-800 dark:text-slate-200"
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
              <label className="block text-sm font-medium mb-2">
                Paciente
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all appearance-none text-slate-800 dark:text-slate-200"
              >
                <option value="">Selecione um paciente</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.cpf}
                  </option>
                ))}
              </select>
            </div>

            {/* Mensagem de erro */}
            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm">{formError}</p>
              </div>
            )}

            {/* Mensagem de sucesso */}
            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Consulta {modalMode === 'create' ? 'agendada' : 'atualizada'} com sucesso!
                </p>
              </div>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || success}
                className={success ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Salvo com sucesso!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {modalMode === 'create' ? 'Agendar' : 'Atualizar'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Card de Consultas da Semana */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="text-purple-500 dark:text-purple-400 w-6 h-6" />
            Consultas da Semana
          </CardTitle>
          <CardDescription>Visão detalhada</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultationsOfDay.map(consultation => (
                <TableRow key={consultation.id}>
                  <TableCell>{consultation.date}</TableCell>
                  <TableCell>{consultation.time}</TableCell>
                  <TableCell>
                    {getPatientById(consultation.patient_id)?.name || "Não encontrado"}
                  </TableCell>
                  <TableCell>
                    {getDoctorById(consultation.doctor_id)?.name || "Não encontrado"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(consultation)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(consultation.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}