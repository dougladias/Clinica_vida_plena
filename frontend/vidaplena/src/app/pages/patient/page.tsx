"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Edit, Trash2, User, Phone, MapPin, Calendar, Search, 
  ChevronLeft, ChevronRight, X, Save, AlertCircle, CheckCircle, 
  FileText, UserPlus, RefreshCw
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

  const itemsPerPage = 10;

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
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
      <div className="animate-pulse space-y-8 w-full max-w-[1280px]">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="w-64 h-12 bg-slate-200 rounded"></div>
          <div className="w-40 h-10 bg-slate-200 rounded"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="h-16 bg-slate-100 rounded-t-xl"></div>
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded"></div>
            ))}
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
      className="space-y-8 w-full max-w-[1280px]"
    >
      {/* Header com título e botões */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-green-600" />
            Pacientes
          </h1>
          <p className="text-slate-500 mt-1">
            Gerenciamento de {stats.total} pacientes cadastrados
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddPatient}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-sm hover:shadow transition-all"
          >
            <UserPlus className="w-5 h-5" />
            <span>Novo Paciente</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Pacientes</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-800">{stats.total}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Novos (Mês Atual)</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-800">{stats.newThisMonth}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border-l-4 border-purple-500 rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Consultas Ativas</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-800">{stats.activeConsultations}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border-l-4 border-amber-500 rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pacientes Ativos</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-800">{stats.activePatients}</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista de pacientes */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-100">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
            <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              Lista de Pacientes
            </h2>

            {/* Barra de pesquisa */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por nome ou CPF..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-50"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabela responsiva */}
        <div className="overflow-x-auto">
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600">Paciente</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden sm:table-cell">CPF</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden md:table-cell">Idade</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden lg:table-cell">Contato</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 hidden xl:table-cell">Endereço</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-600 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
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
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar paciente"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Ver prontuário"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeletePatientClick(patient.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Excluir paciente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-slate-50 rounded-full p-4">
                <Users className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-slate-700">Nenhum paciente encontrado</h3>
              <p className="mt-1 text-slate-500 text-center max-w-md">
                {searchTerm 
                  ? `Não encontramos resultados para "${searchTerm}". Tente outro termo.`
                  : 'Você ainda não cadastrou nenhum paciente. Clique em "Novo Paciente" para começar.'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Limpar pesquisa
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Paginação */}
        {filteredPatients.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500 order-2 sm:order-1">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPatients.length)} de {filteredPatients.length} pacientes
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center px-3 py-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>
                
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
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
                          page === currentPage
                            ? 'bg-green-500 text-white font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <div className="sm:hidden">
                  <span className="text-sm text-slate-600">
                    {currentPage} de {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center px-3 py-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
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

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    date_birth: '',
    address: '',
    phone: '',
  });

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-200 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                {mode === 'create' ? (
                  <UserPlus className="w-5 h-5 text-green-600" />
                ) : (
                  <Edit className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {mode === 'create' ? 'Novo Paciente' : 'Editar Paciente'}
                </h3>
                <p className="text-sm text-slate-500">
                  {mode === 'create' 
                    ? 'Preencha os dados para cadastrar um novo paciente' 
                    : 'Atualize as informações do paciente'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
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
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
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
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <User className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400"
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400"
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="date_birth"
                  value={formData.date_birth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Phone className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <MapPin className="inline w-4 h-4 mr-1.5 text-slate-500" />
                  Endereço Completo *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none placeholder-slate-400"
                  placeholder="Rua, número, bairro, cidade, CEP"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || success}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    <span>{mode === 'create' ? 'Cadastrar' : 'Salvar'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}