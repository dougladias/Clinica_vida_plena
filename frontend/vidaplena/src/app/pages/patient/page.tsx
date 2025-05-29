"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Users, Edit, Trash2, User, Phone, MapPin, Calendar, Search, 
  ChevronLeft, ChevronRight, X, Save, AlertCircle, CheckCircle, 
  FileText, UserPlus, RefreshCw, Shield, Activity
} from 'lucide-react';
import { 
  getPatients, 
  getActiveConsultations, 
  handleCreatePatient,
  handleUpdatePatient,
  handleDeletePatient 
} from '@/components/patient/serverAction/patientActions';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  date_birth: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface PatientStats {
  total: number;
  newThisMonth: number;
  activeConsultations: number;
  activePatients: number;
}

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

  const tableRowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.4
      }
    }),
    hover: {
      backgroundColor: "rgba(241, 245, 249, 0.7)",
      transition: { duration: 0.2 }
    }
  };

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
      <div className="relative overflow-hidden animate-pulse space-y-8 w-full min-h-[70vh] p-8 rounded-2xl">
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
          <div className="w-64 h-12 bg-slate-200 rounded-lg"></div>
          <div className="w-40 h-10 bg-slate-200 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl shadow-sm"></div>
          ))}
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
          <div className="h-16 bg-slate-100 rounded-t-xl"></div>
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-500">Carregando dados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            className="absolute rounded-full bg-gradient-to-r from-green-50/30 to-blue-50/30 blur-2xl"
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
              className="p-3 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl shadow-lg"
            >
              <Users className="w-6 h-6" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Pacientes
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 mt-1"
          >
            Gerenciamento de {stats.total} pacientes cadastrados
          </motion.p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddPatient}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow transition-all"
          >
            <UserPlus className="w-5 h-5" />
            <span>Novo Paciente</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
          className="bg-gradient-to-br from-slate-50 to-green-50 border-l-4 border-green-500 rounded-xl shadow-sm p-5 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Pacientes</p>
              <motion.h3 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mt-1 text-2xl font-semibold text-slate-800"
              >
                {stats.total}
              </motion.h3>
            </div>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 bg-green-100 rounded-lg"
            >
              <Users className="w-5 h-5 text-green-600" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
          className="bg-gradient-to-br from-slate-50 to-blue-50 border-l-4 border-blue-500 rounded-xl shadow-sm p-5 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Novos (Mês Atual)</p>
              <motion.h3 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="mt-1 text-2xl font-semibold text-slate-800"
              >
                {stats.newThisMonth}
              </motion.h3>
            </div>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 bg-blue-100 rounded-lg"
            >
              <UserPlus className="w-5 h-5 text-blue-600" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
          className="bg-gradient-to-br from-slate-50 to-purple-50 border-l-4 border-purple-500 rounded-xl shadow-sm p-5 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Consultas Ativas</p>
              <motion.h3 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="mt-1 text-2xl font-semibold text-slate-800"
              >
                {stats.activeConsultations}
              </motion.h3>
            </div>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 bg-purple-100 rounded-lg"
            >
              <Calendar className="w-5 h-5 text-purple-600" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
          className="bg-gradient-to-br from-slate-50 to-amber-50 border-l-4 border-amber-500 rounded-xl shadow-sm p-5 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pacientes Ativos</p>
              <motion.h3 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="mt-1 text-2xl font-semibold text-slate-800"
              >
                {stats.activePatients}
              </motion.h3>
            </div>
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 bg-amber-100 rounded-lg"
            >
              <FileText className="w-5 h-5 text-amber-600" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Lista de pacientes */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden"
      >
        <div className="border-b border-slate-100">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
            <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              Lista de Pacientes
            </h2>

            {/* Barra de pesquisa */}
            <motion.div 
              initial={{ opacity: 0, width: "80%" }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.5 }}
              className="relative max-w-md w-full"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.2)" }}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por nome ou CPF..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-50/80"
              />
              {searchTerm && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Tabela responsiva */}
        <div className="overflow-x-auto">
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 text-left">
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600">Paciente</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden sm:table-cell">CPF</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden md:table-cell">Idade</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden lg:table-cell">Contato</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden xl:table-cell">Endereço</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPatients.map((patient, index) => (
                  <motion.tr 
                    key={patient.id}
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-sm"
                        >
                          <User className="w-5 h-5 text-slate-600" />
                        </motion.div>
                        <div>
                          <p className="font-medium text-slate-800">{patient.name}</p>
                          <p className="text-xs text-slate-500 sm:hidden">
                            CPF: {patient.cpf}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="font-mono text-sm text-slate-600">{patient.cpf}</span>
                    </td>
                    
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div>
                        <span className="text-slate-800">{calculateAge(patient.date_birth)} anos</span>
                        <p className="text-xs text-slate-500">
                          {new Date(patient.date_birth).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{patient.phone}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="flex items-start gap-1 max-w-xs">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600 line-clamp-1">{patient.address}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.2, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditPatient(patient)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar paciente"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.2, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Ver prontuário"
                        >
                          <FileText className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.2, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeletePatientClick(patient.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Excluir paciente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
                className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner mb-4"
              >
                <Users className="w-10 h-10 text-slate-400" />
              </motion.div>
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 text-lg font-medium text-slate-700"
              >
                Nenhum paciente encontrado
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-1 text-slate-500 text-center max-w-md"
              >
                {searchTerm 
                  ? `Não encontramos resultados para "${searchTerm}". Tente outro termo.`
                  : 'Você ainda não cadastrou nenhum paciente. Clique em "Novo Paciente" para começar.'
                }
              </motion.p>
              {searchTerm && (
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: 0.9 }}
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors shadow-sm"
                >
                  Limpar pesquisa
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Paginação */}
        {filteredPatients.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="px-6 py-4 border-t border-slate-100 bg-white/80"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500 order-2 sm:order-1">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPatients.length)} de {filteredPatients.length} pacientes
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center px-3 py-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </motion.button>
                
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
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors shadow-sm ${
                          page === currentPage
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </motion.button>
                    );
                  })}
                </div>
                
                <div className="sm:hidden">
                  <span className="text-sm text-slate-600 px-3 py-1.5 bg-white border border-slate-200 rounded">
                    {currentPage} de {totalPages}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center px-3 py-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal de paciente */}
      <PatientModal 
        isOpen={showModal}
        onClose={closeModal}
        patient={selectedPatient}
        mode={modalMode}
        onSuccess={handleModalSuccess}
      />
    </motion.div>
  );
};

// Componente Modal
interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

function PatientModal({ isOpen, onClose, patient, mode, onSuccess }: PatientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [particleElements, setParticleElements] = useState<Array<{left: string, top: string}>>([]);

  const [formData, setFormData] = useState({
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
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
              className="absolute w-3 h-3 rounded-full bg-green-400"
              style={{
                left: el.left,
                top: el.top,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorações de fundo */}
          <div className="absolute top-0 right-0 -z-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
          
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-200 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 10 }}
                whileInView={{ rotate: 0 }}
                transition={{ 
                  scale: { type: "spring", damping: 10, delay: 0.2 },
                  rotate: { type: "spring", damping: 10, delay: 0.4 }
                }}
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md"
              >
                {mode === 'create' ? (
                  <UserPlus className="w-5 h-5 text-white" />
                ) : (
                  <Edit className="w-5 h-5 text-white" />
                )}
              </motion.div>
              <div>
                <motion.h3 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-lg font-semibold text-slate-800"
                >
                  {mode === 'create' ? 'Novo Paciente' : 'Editar Paciente'}
                </motion.h3>
                <motion.p 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-slate-500"
                >
                  {mode === 'create' 
                    ? 'Preencha os dados para cadastrar um novo paciente' 
                    : 'Atualize as informações do paciente'
                  }
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(241, 245, 249, 1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </motion.button>
          </div>

          {/* Mensagens de feedback */}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-6 mt-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-800"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                </motion.div>
                <span className="font-medium">
                  Paciente {mode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso!
                </span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-800"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                </motion.div>
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="p-6 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2"
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <User className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 transition-all"
                  placeholder="Digite o nome completo"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Shield className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 transition-all"
                  placeholder="000.000.000-00"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="date_birth"
                  value={formData.date_birth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Phone className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 transition-all"
                  placeholder="(00) 00000-0000"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="md:col-span-2"
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <MapPin className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Endereço Completo *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none placeholder-slate-400 transition-all"
                  placeholder="Rua, número, bairro, cidade, CEP"
                  required
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || success}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-70 shadow-md"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Salvando...</span>
                  </>
                ) : success ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.div>
                    <span>Salvo com sucesso!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{mode === 'create' ? 'Cadastrar' : 'Salvar'}</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Elementos de segurança no rodapé */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="px-6 py-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500"
          >
            <Activity className="w-3 h-3" />
            <span>Dados protegidos e criptografados</span>
            <Shield className="w-3 h-3" />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}