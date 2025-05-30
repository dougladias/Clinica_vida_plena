"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Users, Edit, Trash2, User, Phone, MapPin, Calendar, Search, 
  ChevronLeft, ChevronRight, X, Save, AlertCircle, CheckCircle, 
  UserPlus, RefreshCw, Shield, Activity, MoreHorizontal
} from 'lucide-react';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

import { 
  getPatients, 
  getActiveConsultations, 
  handleCreatePatient,
  handleUpdatePatient,
  handleDeletePatient 
} from '@/hooks/patient/usePatient';
import { Patient, PatientStats, PatientModalProps, PatientFormData } from '@/types/patient.type';

export default function PatientsPage() {
  // Estados principais
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats>({
    total: 0,
    newThisMonth: 0,
    activeConsultations: 0,
    activePatients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [backgroundElements, setBackgroundElements] = useState<Array<{left: string, top: string, size: number}>>([]);

  const itemsPerPage = 10;

  // Gerar elementos de fundo para efeito visual
  useEffect(() => {
    const elements = Array.from({ length: 8 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 100 + 50
    }));
    setBackgroundElements(elements);
  }, []);

  // Animações
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Animation variants
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patientsData, consultationsData] = await Promise.all([
        getPatients(),
        getActiveConsultations(),
      ]);

      setPatients(patientsData);

      // Calcular estatísticas
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const newThisMonth = patientsData.filter((patient: Patient) => {
        const createdDate = new Date(patient.created_at);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      }).length;

      setStats({
        total: patientsData.length,
        newThisMonth,
        activeConsultations: consultationsData.length,
        activePatients: patientsData.length,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeletePatientClick = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) {
      return;
    }

    try {
      const result = await handleDeletePatient(id);
      if (result?.error) {
        alert(`Erro: ${result.error}`);
      } else {
        await loadData();
      }
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
      alert('Erro ao excluir paciente');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Utilitários
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filtragem e paginação
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  // Loading
  if (loading) {
    return (
      <div className="relative overflow-hidden space-y-8 w-full min-h-[70vh] p-8 rounded-2xl">
        {/* Elementos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2 }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              className="absolute rounded-full bg-gradient-to-r from-slate-200/40 to-slate-300/40 blur-2xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 100}px`,
                height: `${Math.random() * 100 + 100}px`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>

        <div className="flex justify-between items-center relative z-10">
          <Skeleton className="w-64 h-12" />
          <Skeleton className="w-40 h-10" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-500">Carregando dados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 w-full relative overflow-hidden"
      >
        {/* Elementos de fundo dinâmicos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {backgroundElements.map((el, i) => (
            <motion.div
              key={i}
              variants={floatingVariants}
              animate="animate"
              className="absolute rounded-full bg-gradient-to-r from-emerald-900/20 to-blue-900/20 dark:from-emerald-500/10 dark:to-blue-500/10 blur-2xl"
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

        {/* Header com título e botões */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 text-white rounded-xl shadow-lg"
              >
                <Users className="w-6 h-6" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">
                  Pacientes
                </h1>                
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="shadow-sm dark:border-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            
            <Button
              onClick={handleAddPatient}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 shadow-md"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Novo Paciente
            </Button>
          </div>
        </motion.div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-emerald-500 dark:border-l-emerald-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total de Pacientes
                </CardTitle>
                <motion.div whileHover={{ rotate: 15 }}>
                  <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-2xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {stats.total}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Novos (Mês Atual)
                </CardTitle>
                <motion.div whileHover={{ rotate: 15 }}>
                  <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="text-2xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {stats.newThisMonth}
                </motion.div>                
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Consultas Ativas
                </CardTitle>
                <motion.div whileHover={{ rotate: 15 }}>
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="text-2xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {stats.activeConsultations}
                </motion.div>                
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Pacientes Ativos
                </CardTitle>
                <motion.div whileHover={{ rotate: 15 }}>
                  <Activity className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="text-2xl font-bold text-slate-800 dark:text-slate-200"
                >
                  {stats.activePatients}
                </motion.div>                
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Lista de pacientes */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-md dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 dark:text-slate-200">
                    <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    Lista de Pacientes
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Gerencie todos os pacientes cadastrados no sistema
                  </CardDescription>
                </div>

                {/* Barra de pesquisa */}
                <motion.div 
                  initial={{ opacity: 0, width: "80%" }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 0.5 }}
                  className="relative max-w-md w-full"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Buscar por nome ou CPF..."
                    className="pl-10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:placeholder:text-slate-500"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {filteredPatients.length > 0 ? (
                <Table>
                  <TableHeader className="dark:bg-slate-900/50">
                    <TableRow className="dark:border-slate-700">
                      <TableHead className="pl-11 dark:text-slate-300">Paciente</TableHead>
                      <TableHead className="hidden sm:table-cell pl-12 dark:text-slate-300">CPF</TableHead>
                      <TableHead className="hidden md:table-cell pl-5 dark:text-slate-300">Idade</TableHead>
                      <TableHead className="hidden lg:table-cell pl-12 dark:text-slate-300">Contato</TableHead>
                      <TableHead className="hidden xl:table-cell dark:text-slate-300">Endereço</TableHead>
                      <TableHead className="text-right pr-2 dark:text-slate-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPatients.map((patient, index) => (
                      <TableRow
                        key={patient.id}
                        className={`transition-colors animate-in fade-in slide-in-from-left-5 duration-300 dark:border-slate-700`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          backgroundColor: "rgba(241, 245, 249, 0)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0.7)";
                          if (document.documentElement.classList.contains('dark')) {
                            e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.7)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0)";
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 text-slate-700 dark:text-slate-300 font-medium">
                                {getInitials(patient.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200">{patient.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                                CPF: {patient.cpf}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="font-mono text-xs dark:border-slate-600 dark:text-slate-300">
                            {patient.cpf}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <span className="text-slate-800 dark:text-slate-300 pl-2 font-medium">{calculateAge(patient.date_birth)} anos</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(patient.date_birth).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">{patient.phone}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden xl:table-cell">
                          <div className="flex items-start gap-2 max-w-xs">
                            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{patient.address}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 dark:text-slate-400 dark:hover:text-slate-300">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-700">
                                <DropdownMenuItem onClick={() => handleEditPatient(patient)} className="dark:text-slate-300 dark:focus:text-slate-200 dark:focus:bg-slate-800">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </DropdownMenuItem>                                
                                <Separator className="dark:bg-slate-700" />
                                <DropdownMenuItem 
                                  onClick={() => handleDeletePatientClick(patient.id)}
                                  className="text-red-600 dark:text-red-500 dark:focus:bg-slate-800"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Excluir</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>        
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      delay: 0.6 
                    }}
                    className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center shadow-inner mb-4"
                  >
                    <Users className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                  </motion.div>
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300"
                  >
                    Nenhum paciente encontrado
                  </motion.h3>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-1 text-slate-500 dark:text-slate-400 text-center max-w-md"
                  >
                    {searchTerm 
                      ? `Não encontramos resultados para "${searchTerm}". Tente outro termo.`
                      : 'Você ainda não cadastrou nenhum paciente. Clique em "Novo Paciente" para começar.'
                    }
                  </motion.p>
                  {searchTerm && (
                    <Button 
                      variant="outline"
                      onClick={() => setSearchTerm('')}
                      className="mt-4 dark:border-slate-700 dark:text-slate-300"
                    >
                      Limpar pesquisa
                    </Button>
                  )}
                </motion.div>
              )}
            </CardContent>
            
            {/* Paginação */}
            {filteredPatients.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="px-6 py-4 border-t dark:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 order-2 sm:order-1">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPatients.length)} de {filteredPatients.length} pacientes
                  </p>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Anterior
                    </Button>
                    
                    <div className="hidden sm:flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page = i + 1;
                        if (totalPages > 5) {
                          if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                        }
                        
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 p-0 ${
                              page === currentPage
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-800'
                                : 'dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <div className="sm:hidden">
                      <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                        {currentPage} de {totalPages}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage >= totalPages}
                      className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Modal de paciente - adaptação para tema escuro */}
        <PatientModal 
          isOpen={showModal}
          onClose={closeModal}
          patient={selectedPatient}
          mode={modalMode}
          onSuccess={handleModalSuccess}
        />
      </motion.div>
    </TooltipProvider>
  );
}

// Componente Modal com shadcn/ui adaptado para tema escuro
function PatientModal({ isOpen, onClose, patient, mode, onSuccess }: PatientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [particleElements, setParticleElements] = useState<Array<{left: string, top: string}>>([]);

  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    cpf: '',
    date_birth: '',
    address: '',
    phone: '',
  });

  // Gerar elementos decorativos
  useEffect(() => {
    if (isOpen) {
      const particles = Array.from({ length: 5 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }));
      setParticleElements(particles);
    }
  }, [isOpen]);

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && patient) {
        setFormData({
          name: patient.name,
          cpf: patient.cpf,
          date_birth: patient.date_birth.split('T')[0],
          address: patient.address,
          phone: patient.phone,
        });
      } else {
        setFormData({
          name: '',
          cpf: '',
          date_birth: '',
          address: '',
          phone: '',
        });
      }
      setError('');
      setSuccess(false);
    }
  }, [isOpen, mode, patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpf || !formData.date_birth || !formData.address || !formData.phone) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('cpf', formData.cpf);
      formDataToSend.append('date_birth', formData.date_birth);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone);

      let result;
      if (mode === 'edit' && patient) {
        formDataToSend.append('id', patient.id);
        result = await handleUpdatePatient(formDataToSend);
      } else {
        result = await handleCreatePatient(formDataToSend);
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
      console.error('Erro ao salvar paciente:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particleElements.map((el, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8, 1], 
                opacity: [0, 0.8, 0.5, 0],
                y: [0, -50, -100]
              }}
              transition={{ 
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="absolute w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-600"
              style={{
                left: el.left,
                top: el.top,
              }}
            />
          ))}
        </div>

        <DialogHeader>
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 10 }}
              whileInView={{ rotate: 0 }}
              transition={{ 
                scale: { type: "spring", damping: 10, delay: 0.2 },
                rotate: { type: "spring", damping: 10, delay: 0.4 }
              }}
              className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 rounded-lg flex items-center justify-center shadow-md"
            >
              {mode === 'create' ? (
                <UserPlus className="w-5 h-5 text-white" />
              ) : (
                <Edit className="w-5 h-5 text-white" />
              )}
            </motion.div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {mode === 'create' ? 'Novo Paciente' : 'Editar Paciente'}
              </DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                {mode === 'create' 
                  ? 'Preencha os dados para cadastrar um novo paciente' 
                  : 'Atualize as informações do paciente'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Mensagens de feedback */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.6, 1] 
                  }}
                >
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                </motion.div>
                <AlertDescription className="text-emerald-800 dark:text-emerald-400 font-medium pl-5">
                  Paciente {mode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Alert variant="destructive">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <AlertCircle className="h-4 w-4" />
                </motion.div>
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2"
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <User className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Nome Completo *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Shield className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                CPF *
              </label>
              <Input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Data de Nascimento *
              </label>
              <Input
                type="date"
                name="date_birth"
                value={formData.date_birth}
                onChange={handleInputChange}
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Phone className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Telefone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="md:col-span-2"
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <MapPin className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Endereço Completo *
              </label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                placeholder="Rua, número, bairro, cidade, CEP"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>
          </div>

          <Separator className="dark:bg-slate-700" />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-end gap-3 pt-2"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-800"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Salvando...
                </>
              ) : success ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                  </motion.div>
                  Salvo com sucesso!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Cadastrar' : 'Salvar'}
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Elementos de segurança no rodapé */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-500 dark:text-slate-400 border-t dark:border-slate-700"
        >
          <Activity className="w-3 h-3" />
          <span>Dados protegidos e criptografados</span>
          <Shield className="w-3 h-3" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}