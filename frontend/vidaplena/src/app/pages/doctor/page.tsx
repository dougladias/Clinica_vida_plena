"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck,
  Plus,
  Edit,
  Trash2,  
  Phone,
  Mail,
  Stethoscope,
  Search,  
  Award,  
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle,
  Save  
} from 'lucide-react';
import { 
  getDoctors, 
  getDoctorStats,
  handleCreateDoctor,
  handleUpdateDoctor,
  handleDeleteDoctor 
} from '@/hooks/doctor/useDoctor';
import { 
  Medico, 
  MedicosStats, 
  CreateDoctorData, 
  UpdateDoctorData 
} from '@/types/doctor.type'; 

// Importando os componentes UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Interface para o formulário - podemos manter essa definição aqui já que é específica da UI
interface FormData {
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}

// Página principal do componente de médicos
export default function DoctorPage() {  
  // Estados
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [stats, setStats] = useState<MedicosStats>({
    totalMedicos: 0,
    especialidades: 0,
    consultasHoje: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEspecialidade, setSelectedEspecialidade] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados para o formulário
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Garantir que o componente está montado (para evitar problemas de hidratação)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  // Efeito para preencher o formulário quando estiver editando
  useEffect(() => {
    if (selectedMedico && modalMode === 'edit') {
      setFormData({
        nome: selectedMedico.name,
        crm: selectedMedico.crm,
        especialidade: selectedMedico.specialty,
        telefone: selectedMedico.phone,
        email: selectedMedico.email
      });
    } else {
      // Resetar formulário quando for criação
      setFormData({
        nome: '',
        crm: '',
        especialidade: '',
        telefone: '',
        email: ''
      });
    }
  }, [selectedMedico, modalMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [medicosData, statsData] = await Promise.all([
        getDoctors(),
        getDoctorStats()
      ]);

      setMedicos(medicosData);
      if (statsData) {
        setStats(statsData);
      } else {
        // Calcular estatísticas localmente se a API não retornar
        const especialidades = [...new Set(medicosData.map((medico: Medico) => medico.specialty))];
        
        setStats({
          totalMedicos: medicosData.length,
          especialidades: especialidades.length,
          consultasHoje: 0
        });
      }

      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados dos médicos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para atualização dos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (modalMode === 'create') {
        const createData: CreateDoctorData = {
          nome: formData.nome,
          crm: formData.crm,
          especialidade: formData.especialidade,
          telefone: formData.telefone,
          email: formData.email
        };
        
        const result = await handleCreateDoctor(createData);
        
        if (result.error) {
          setError(result.error);
          return;
        }
      } else if (modalMode === 'edit' && selectedMedico) {
        const updateData: UpdateDoctorData = {
          id: selectedMedico.id,
          nome: formData.nome,
          crm: formData.crm,
          especialidade: formData.especialidade,
          telefone: formData.telefone,
          email: formData.email
        };
        
        const result = await handleUpdateDoctor(updateData);
        
        if (result.error) {
          setError(result.error);
          return;
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        handleModalSuccess();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar médico:', error);
      setError('Ocorreu um erro ao salvar os dados. Por favor, tente novamente.');
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
    setSelectedMedico(null);
    setModalMode('create');
    setSuccess(false);
    setShowModal(true);
  };

  const handleEdit = (medico: Medico) => {
    setSelectedMedico(medico);
    setModalMode('edit');
    setSuccess(false);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este médico?')) {
      return;
    }

    try {
      const result = await handleDeleteDoctor(id);
      if (result?.error) {
        alert(`Erro: ${result.error}`);
      } else {
        await loadData();
      }
    } catch (error) {
      console.error('Erro ao excluir médico:', error);
      alert('Erro ao excluir médico');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedico(null);
    setError(null);
    setSuccess(false);
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Filtros
  const medicosFiltrados = medicos.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.crm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEspecialidade = !selectedEspecialidade || m.specialty === selectedEspecialidade;
    
    return matchesSearch && matchesEspecialidade;
  });

  const especialidades = [...new Set(medicos.map(m => m.specialty))];

  // Elementos de background estilizados com base na página de login
  const backgroundElements = [
    { left: '5%', top: '15%', size: 200 },
    { left: '90%', top: '10%', size: 250 },
    { left: '80%', top: '60%', size: 180 },
    { left: '20%', top: '80%', size: 220 },
    { left: '40%', top: '30%', size: 160 }
  ];

  if (!isMounted) {
    return null; // Evita problemas de hidratação durante SSR
  }

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
            className="absolute rounded-full bg-gradient-to-r from-blue-900/10 to-emerald-900/10 dark:from-blue-500/10 dark:to-emerald-500/10 blur-2xl"
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
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-300 font-medium">Erro ao carregar dados</p>
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="text-red-600 dark:text-red-400"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Tentar novamente
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between p-2">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <UserCheck className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Médicos</h2>
              <p className="text-slate-500 dark:text-slate-400">Gerencie o corpo médico da clínica</p>
            </div>
          </div>
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
          />
        </div>
        <div className="flex items-center space-x-4">
          {/* Filtro por especialidade */}
          <select
            value={selectedEspecialidade}
            onChange={(e) => setSelectedEspecialidade(e.target.value)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas especialidades</option>
            {especialidades.map(esp => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>

          <Button variant="default" onClick={handleAdd} disabled={loading}>
            <Plus className="w-5 h-5 mr-2" />
            Novo Médico
          </Button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total de Médicos
              </CardTitle>
              <motion.div whileHover={{ rotate: 15 }}>
                <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.totalMedicos || medicos.length
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Especialidades
              </CardTitle>
              <motion.div whileHover={{ rotate: 15 }}>
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.especialidades || especialidades.length
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Consultas Hoje
              </CardTitle>
              <motion.div whileHover={{ rotate: 15 }}>
                <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.consultasHoje || 0
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Disponíveis Hoje
              </CardTitle>
              <motion.div whileHover={{ rotate: 15 }}>
                <Award className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.totalMedicos || 0
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Barra de Pesquisa */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Corpo Médico</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar médico, especialidade ou CRM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-slate-500 dark:text-slate-400">Carregando médicos...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {medicosFiltrados.map((medico, index) => (
                  <motion.div
                    key={medico.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-md">
                              <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-white text-lg">{medico.name}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">CRM: {medico.crm}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(medico)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(medico.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {/* Especialidade */}
                        <div className="mb-4">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            <Award className="w-3 h-3 mr-1" />
                            {medico.specialty}
                          </Badge>
                        </div>

                        {/* Informações de contato */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                              <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <span>{medico.phone}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                              <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <span className="truncate">{medico.email}</span>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Status e ações */}
                        <div className="flex items-center justify-between">
                          <div>
                            {/* Informação adicional relevante - data de cadastro */}
                            {medico.created_at && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Cadastrado em: {new Date(medico.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="text-blue-600">
                              Ver Agenda
                            </Button>
                            
                            <Button variant="outline" size="sm" className="text-green-600">
                              Agendar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && medicosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">Nenhum médico encontrado</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  {searchTerm || selectedEspecialidade ? 'Tente ajustar os filtros de busca' : 'Comece cadastrando um novo médico'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Especialidades em destaque */}
      {!loading && especialidades.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Especialidades Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {especialidades.map((especialidade, index) => {
                  const medicosEspecialidade = medicos.filter(m => m.specialty === especialidade);
                  const isSelected = selectedEspecialidade === especialidade;
                  
                  return (
                    <motion.div
                      key={especialidade}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedEspecialidade(isSelected ? '' : especialidade)}
                      className={`text-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 border-2 border-blue-300 dark:border-blue-700' 
                          : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        isSelected ? 'bg-blue-600' : 'bg-blue-500'
                      }`}>
                        <Stethoscope className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-medium text-slate-800 dark:text-white text-sm mb-1">{especialidade}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {medicosEspecialidade.length} médico{medicosEspecialidade.length !== 1 ? 's' : ''}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}     

      {/* Modal para Criar/Editar Médico */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'Novo Médico' : 'Editar Médico'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'create' 
                ? 'Preencha os dados para cadastrar um novo médico' 
                : 'Atualize as informações do médico'}
            </DialogDescription>
          </DialogHeader>

          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-6"
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nome Completo
              </label>
              <Input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                placeholder="Dr. João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                CRM
              </label>
              <Input
                type="text"
                name="crm"
                value={formData.crm}
                onChange={handleInputChange}
                required
                placeholder="CRM/SP 12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Especialidade
              </label>
              <Input
                type="text"
                name="especialidade"
                value={formData.especialidade}
                onChange={handleInputChange}
                required
                placeholder="Cardiologia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Telefone
              </label>
              <Input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                required
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="medico@clinica.com"
              />
            </div>

            {/* Mensagem de erro */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensagem de sucesso */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Médico {modalMode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-3 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={`flex-1 ${success ? 'bg-green-500 hover:bg-green-600' : ''}`}
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
                    {modalMode === 'create' ? 'Cadastrar' : 'Salvar'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}