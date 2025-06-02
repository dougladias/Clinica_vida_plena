"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  UserCheck, 
  Receipt,
  Plus,
  Clock,
  ChevronRight,
  FileText,  
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Importações de server actions
import { getConsultations } from '@/server/consultation/useConsultation';
import { getDoctors } from '@/server/doctor/useDoctor';
import { getPatients } from '@/server/patient/usePatient';
import { getPrescriptions } from '@/server/prescription/usePrescription';
import { getMedicalRecords } from '@/server/medicalRecord/useMedicalRecord';

// Importações de tipos
import { Doctor } from '@/types/doctor.type';
import { Patient } from '@/types/patient.type';
import { Consultation } from '@/types/consultation.type';
import { Prescription } from '@/types/prescription.type';
import { MedicalRecord } from '@/types/medicalRecord.type';

// Componentes UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert } from '@/components/ui/alert';

interface DashboardProps {
  consultations: Consultation[];
  patients: Patient[];
  doctors: Doctor[];
  prescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  stats: DashboardStats; 
}

interface DashboardStats {
  totalConsultations: number;
  todayConsultations: number;
  tomorrowConsultations: number;
  completedConsultations: number;
  inProgressConsultations: number;
  totalPatients: number;
  totalDoctors: number;
  specialties: number;
  totalPrescriptions: number;
  monthlyPrescriptions: number;
  totalMedicalRecords: number;
}

export default function DashboardPage() {
  // Estados para armazenar dados
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultations: 0,
    todayConsultations: 0,
    tomorrowConsultations: 0,
    completedConsultations: 0,
    inProgressConsultations: 0,
    totalPatients: 0,
    totalDoctors: 0,
    specialties: 0,
    totalPrescriptions: 0,
    monthlyPrescriptions: 0,
    totalMedicalRecords: 0
  });
  
  const [selectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Carregar dados da API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [consultationsData, patientsData, doctorsData, prescriptionsData, medicalRecordsData] = await Promise.all([
        getConsultations(),
        getPatients(),
        getDoctors(),
        getPrescriptions(),
        getMedicalRecords()
      ]);

      console.log('Dados carregados:', {
        consultations: Array.isArray(consultationsData) ? consultationsData.length : 0,
        patients: Array.isArray(patientsData) ? patientsData.length : 0,
        doctors: Array.isArray(doctorsData) ? doctorsData.length : 0,
        prescriptions: Array.isArray(prescriptionsData) ? prescriptionsData.length : 0,
        medicalRecords: Array.isArray(medicalRecordsData) ? medicalRecordsData.length : 0
      });

      // Garantir que os dados são válidos
      const validConsultations = Array.isArray(consultationsData) ? consultationsData : [];
      const validPatients = Array.isArray(patientsData) ? patientsData : [];
      const validDoctors = Array.isArray(doctorsData) ? doctorsData : [];
      const validPrescriptions = Array.isArray(prescriptionsData) ? prescriptionsData : [];
      const validMedicalRecords = Array.isArray(medicalRecordsData) ? medicalRecordsData : [];

      // Atualizar estados
      setConsultations(validConsultations);
      setPatients(validPatients);
      setDoctors(validDoctors);
      setPrescriptions(validPrescriptions);
      setMedicalRecords(validMedicalRecords);

      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // Consultas de hoje
      const todayConsultations = validConsultations.filter(
        c => c.date?.split('T')[0] === today
      );
      
      // Consultas de amanhã
      const tomorrowConsultations = validConsultations.filter(
        c => c.date?.split('T')[0] === tomorrowStr
      );

      // Consultas completadas e em andamento
      const completedConsultations = validConsultations.filter(
        c => c.status === 'Concluída'
      );
      
      const inProgressConsultations = validConsultations.filter(
        c => c.status === 'Em Andamento'
      );

      // Prescrições do mês atual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyPrescriptions = validPrescriptions.filter(p => {
        if (!p.created_at) return false;
        const date = new Date(p.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      // Especialidades únicas
      const uniqueSpecialties = new Set(validDoctors.map(d => d.specialty)).size;

      setStats({
        totalConsultations: validConsultations.length,
        todayConsultations: todayConsultations.length,
        tomorrowConsultations: tomorrowConsultations.length,
        completedConsultations: completedConsultations.length,
        inProgressConsultations: inProgressConsultations.length,
        totalPatients: validPatients.length,
        totalDoctors: validDoctors.length,
        specialties: uniqueSpecialties,
        totalPrescriptions: validPrescriptions.length,
        monthlyPrescriptions: monthlyPrescriptions.length,
        totalMedicalRecords: validMedicalRecords.length
      });

      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do dashboard. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Renderizar o componente Dashboard com as props necessárias
  return (
    <Dashboard 
      consultations={consultations}
      patients={patients}
      doctors={doctors}
      prescriptions={prescriptions}
      medicalRecords={medicalRecords}
      selectedDate={selectedDate}
      loading={loading}
      error={error}
      onRefresh={loadData}
      stats={stats}
    />
  );
}

// O componente Dashboard
const Dashboard: React.FC<DashboardProps> = ({ 
  consultations, 
  patients, 
  doctors, 
  prescriptions,
  medicalRecords,
  selectedDate,
  loading,
  error,
  onRefresh,
  stats
}) => {
  const consultationsToday = consultations.filter(c => {
    if (!c.date) return false;
    return c.date.split('T')[0] === selectedDate;
  });  
  
  const completedConsultations = stats.completedConsultations;
  const inProgressConsultations = stats.inProgressConsultations;
  const specialties = stats.specialties;
  
  const monthlyPrescriptions = stats.monthlyPrescriptions;

  // Variantes de animação
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

  // Atividades recentes (combinando consultas, prontuários e prescrições)
  const getRecentActivities = () => {
    const activities = [
      ...prescriptions.map(p => ({
        type: 'prescription',
        date: p.created_at || '',
        title: 'Receita emitida',
        entity: p.consultation?.patient?.name || 'Paciente',
      })),
      ...medicalRecords.map(mr => ({
        type: 'medicalRecord',
        date: mr.created_at || '',
        title: 'Prontuário atualizado',
        entity: (mr as MedicalRecord & { patient?: Patient }).patient?.name || 'Paciente',
      })),
      ...consultations.map(c => ({
        type: 'consultation',
        date: c.created_at || '',
        title: 'Consulta agendada',
        entity: c.patient?.name || 'Paciente',
      }))
    ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

    return activities;
  };

  const activities = getRecentActivities();

  // Função para formatar o tempo relativo
  const getRelativeTime = (dateString: string) => {
    if (!dateString) return 'Data desconhecida';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours} h`;
    return `há ${diffDays} dias`;
  };

  // Função para obter o ícone da atividade
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <Receipt className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'medicalRecord':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'consultation':
        return <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default:
        return <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />;
    }
  };

  // Função para obter a cor do background do ícone
  const getActivityIconBg = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'medicalRecord': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'consultation': return 'bg-green-100 dark:bg-green-900/30';
      default: return 'bg-green-100 dark:bg-green-900/30';
    }
  };

  // Função para determinar a variante do badge com base no status
  const getStatusVariant = (status: string | undefined): "default" | "destructive" | "secondary" | "outline" | null | undefined => {
    switch (status) {
      case 'Agendada': return 'default';
      case 'Em Andamento': return 'secondary';
      case 'Concluída': return 'default';
      case 'Cancelada': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <motion.div
      key="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >   
      {/* Mensagem de erro */}
      {error && (
        <Alert variant="destructive" className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Erro ao carregar dados</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="ml-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Tentar novamente
          </Button>
        </Alert>
      )}

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Consultas */}
        <motion.div whileHover={{ y: -4 }}>
          <Card className="border-l-4 border-l-blue-500 shadow-md dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Consultas Agendadas</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{stats.todayConsultations}</p>
                      <Badge variant="outline" className="text-blue-500 border-blue-200 dark:border-blue-800">
                        Hoje
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.tomorrowConsultations} amanhã
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Card 2 - Pacientes */}
        <motion.div whileHover={{ y: -4 }}>
          <Card className="border-l-4 border-l-green-500 shadow-md dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pacientes Ativos</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{patients.length}</p>
                      <Badge variant="outline" className="text-green-500 border-green-200 dark:border-green-800">
                        Total
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Cadastrados no sistema
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-500 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Card 3 - Médicos */}
        <motion.div whileHover={{ y: -4 }}>
          <Card className="border-l-4 border-l-purple-500 shadow-md dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Médicos Disponíveis</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{doctors.length}</p>
                      <Badge variant="outline" className="text-purple-500 border-purple-200 dark:border-purple-800">
                        Ativo
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Especialidades: {specialties}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Card 4 - Receitas */}
        <motion.div whileHover={{ y: -4 }}>
          <Card className="border-l-4 border-l-orange-500 shadow-md dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Receitas Emitidas</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{monthlyPrescriptions}</p>
                      <Badge variant="outline" className="text-orange-500 border-orange-200 dark:border-orange-800">
                        Mês
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Total: {prescriptions.length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Área principal com consultas e atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consultas de hoje */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-t-4 border-t-blue-500 shadow-md dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Consultas de Hoje</CardTitle>
                <CardDescription>
                  {loading 
                    ? 'Carregando consultas...' 
                    : `${consultationsToday.length} consultas agendadas`
                  }
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-[200px] mb-2" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-[60px] mb-2" />
                        <Skeleton className="h-6 w-[80px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : consultationsToday.length > 0 ? (
                <div className="space-y-4">
                  {consultationsToday.map((consultation, index) => (
                    <motion.div
                      key={consultation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 2, backgroundColor: 'var(--hover-bg)' }}
                      style={{ '--hover-bg': 'var(--card-hover)' } as React.CSSProperties & { '--hover-bg': string }}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {consultation.patient?.name || 'Paciente não encontrado'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {consultation.doctor?.name || 'Médico não encontrado'} • 
                            {consultation.doctor?.specialty || 'Especialidade não especificada'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {consultation.date 
                            ? new Date(consultation.date).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) 
                            : 'Horário não definido'
                          }
                        </p>
                        <Badge variant={getStatusVariant(consultation.status)}>
                          {consultation.status || 'Sem status'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma consulta agendada para hoje</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Atividades recentes */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-t-4 border-t-purple-500 shadow-md dark:bg-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${getActivityIconBg(activity.type)} rounded-full flex items-center justify-center`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.entity} - {getRelativeTime(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">Nenhuma atividade recente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-t-4 border-t-indigo-500 shadow-md bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-800 dark:to-indigo-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resumo Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Consultas Concluídas</span>
                    <span className="font-semibold">{completedConsultations}</span>
                  </div>
                  <Separator className="my-2 opacity-50" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Em Andamento</span>
                    <span className="font-semibold">{inProgressConsultations}</span>
                  </div>
                  <Separator className="my-2 opacity-50" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prontuários</span>
                    <span className="font-semibold">{medicalRecords.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};