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

// Interfaces Medico
interface Medico {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;  
  created_at?: string;
  updated_at?: string;
}

// Interface para estatísticas dos médicos
interface MedicosStats {
  totalMedicos: number;
  especialidades: number;
  consultasHoje: number; 
}

// Página principal do componente de médicos
export default function DoctorPage() {  
  // Estados
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [stats, setStats] = useState<MedicosStats>({
    totalMedicos: 0,
    especialidades: 0,
    consultasHoje: 0
    // Removido disponiveis
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEspecialidade, setSelectedEspecialidade] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

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
          consultasHoje: 0  // Podemos não ter essa informação disponível
          // Removido disponiveis
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

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAdd = () => {
    setSelectedMedico(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (medico: Medico) => {
    setSelectedMedico(medico);
    setModalMode('edit');
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
  };

  const handleModalSuccess = () => {
    closeModal();
    loadData();
  };

  // Renderizar componente principal
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

      <Medicos
        medicos={medicos}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedEspecialidade={selectedEspecialidade}
        setSelectedEspecialidade={setSelectedEspecialidade}
        loading={loading}
        stats={stats}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Modal para Criar/Editar Médico */}
      {showModal && (
        <MedicoModal
          isOpen={showModal}
          onClose={closeModal}
          medico={selectedMedico}
          mode={modalMode}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}

// Componente Modal para Criar/Editar Médico
interface MedicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  medico: Medico | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

function MedicoModal({ isOpen, onClose, medico, mode, onSuccess }: MedicoModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Remover status do formData
  const [formData, setFormData] = useState<{
    nome: string;
    crm: string;
    especialidade: string;
    telefone: string;
    email: string;
  }>({
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: ''
  });

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && medico) {
        setFormData({
          nome: medico.name,
          crm: medico.crm,
          especialidade: medico.specialty,
          telefone: medico.phone,
          email: medico.email
          // Removido o status
        });
      } else {
        setFormData({
          nome: '',
          crm: '',
          especialidade: '',
          telefone: '',
          email: ''
          // Removido o status
        });
      }
      setError('');
      setSuccess(false);
    }
  }, [isOpen, mode, medico]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.crm || !formData.especialidade || !formData.telefone || !formData.email) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('crm', formData.crm);
      formDataToSend.append('especialidade', formData.especialidade);
      formDataToSend.append('telefone', formData.telefone);
      formDataToSend.append('email', formData.email);
      // Removido o campo status

      let result;
      if (mode === 'edit' && medico) {
        formDataToSend.append('id', medico.id);
        result = await handleUpdateDoctor(formDataToSend);
      } else {
        result = await handleCreateDoctor(formDataToSend);
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
      console.error('Erro ao salvar médico:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {mode === 'create' ? 'Novo Médico' : 'Editar Médico'}
          </h3>

          <motion.form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CRM
              </label>
              <input
                type="text"
                name="crm"
                value={formData.crm}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CRM/SP 12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Especialidade
              </label>
              <input
                type="text"
                name="especialidade"
                value={formData.especialidade}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cardiologia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="medico@clinica.com"
              />
            </div>

            {/* Removido o seletor de status */}

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
                    Médico {mode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso!
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
                    : 'bg-blue-600 text-white hover:bg-blue-700'
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
                    <span>{mode === 'create' ? 'Cadastrar' : 'Salvar'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}

// Componente principal Medicos atualizado
interface MedicosProps {
  medicos: Medico[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedEspecialidade: string;
  setSelectedEspecialidade: (especialidade: string) => void;
  loading: boolean;
  stats: MedicosStats;
  handleAdd: () => void;
  handleEdit: (medico: Medico) => void;
  handleDelete: (id: string) => void;
}

const Medicos: React.FC<MedicosProps> = ({ 
  medicos, 
  searchTerm,
  setSearchTerm,
  selectedEspecialidade,
  setSelectedEspecialidade,
  loading,
  stats,
  handleAdd, 
  handleEdit, 
  handleDelete 
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

  // Filtros
  const medicosFiltrados = medicos.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.crm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEspecialidade = !selectedEspecialidade || m.specialty === selectedEspecialidade;
    
    return matchesSearch && matchesEspecialidade;
  });

  const especialidades = [...new Set(medicos.map(m => m.specialty))];

  return (
    <motion.div
      key="medicos"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Médicos</h2>
          <p className="text-slate-500 mt-1">Gerencie o corpo médico da clínica</p>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando...</span>
              </span>
            ) : (
              `${medicos.length} médicos cadastrados`
            )}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Filtro por especialidade */}
          <select
            value={selectedEspecialidade}
            onChange={(e) => setSelectedEspecialidade(e.target.value)}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas especialidades</option>
            {especialidades.map(esp => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Médico</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total de Médicos</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.totalMedicos || medicos.length
                )}
              </p>
            </div>
            <UserCheck className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Especialidades</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.especialidades || especialidades.length
                )}
              </p>
            </div>
            <Award className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Hoje</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.consultasHoje || 0
                )}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Grid de cards dos médicos */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Corpo Médico</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar médico, especialidade ou CRM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-slate-500">Carregando médicos...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicosFiltrados.map((medico, index) => (
              <motion.div
                key={medico.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Header do card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                      <Stethoscope className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{medico.name}</h4>
                      <p className="text-sm text-slate-500">CRM: {medico.crm}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(medico)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar médico"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(medico.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Excluir médico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Especialidade */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    <Award className="w-3 h-3 mr-1" />
                    {medico.specialty}
                  </span>
                </div>

                {/* Informações de contato */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <span>{medico.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="truncate">{medico.email}</span>
                  </div>
                </div>

                {/* Status e ações */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      {/* Informação adicional relevante - data de cadastro */}
                      {medico.created_at && (
                        <span className="text-xs text-slate-500">
                          Cadastrado em: {new Date(medico.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        Ver Agenda
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 transition-colors"
                      >
                        Agendar
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && medicosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhum médico encontrado</p>
            <p className="text-slate-400 text-sm">
              {searchTerm || selectedEspecialidade ? 'Tente ajustar os filtros de busca' : 'Comece cadastrando um novo médico'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Especialidades em destaque */}
      {!loading && especialidades.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Especialidades Disponíveis</h3>
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
                      ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300' 
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isSelected ? 'bg-blue-600' : 'bg-blue-500'
                  }`}>
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-slate-800 text-sm mb-1">{especialidade}</h4>
                  <p className="text-xs text-slate-500">
                    {medicosEspecialidade.length} médico{medicosEspecialidade.length !== 1 ? 's' : ''}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};