"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  ClipboardList,
  Activity
} from 'lucide-react';

interface Medico {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  nascimento: string;
  endereco: string;
  telefone: string;
}

interface Consulta {
  id: number;
  data: string;
  hora: string;
  medicoId: number;
  pacienteId: number;
  status: string;
}

interface Prontuario {
  id: number;
  consultaId: number;
  anotacoes: string;
  diagnostico: string;
  data: string;
}

export default function PrescriptionPage() {
  // Estados para gerenciar os dados
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  // Carregar dados de exemplo
  useEffect(() => {
    // Dados mock para teste
    const mockConsultas: Consulta[] = [
      {
        id: 1,
        data: new Date().toISOString().split('T')[0], // Hoje
        hora: "14:30",
        medicoId: 1,
        pacienteId: 1,
        status: "Concluída"
      },
      {
        id: 2,
        data: new Date().toISOString().split('T')[0], // Hoje
        hora: "16:00",
        medicoId: 2,
        pacienteId: 2,
        status: "Concluída"
      },
      {
        id: 3,
        data: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
        hora: "10:15",
        medicoId: 3,
        pacienteId: 3,
        status: "Concluída"
      }
    ];

    const mockMedicos: Medico[] = [
      {
        id: 1,
        nome: "Dr. Carlos Oliveira",
        crm: "CRM/SP 12345",
        especialidade: "Cardiologia",
        telefone: "(11) 99876-5432",
        email: "dr.carlos@clinica.com"
      },
      {
        id: 2,
        nome: "Dra. Ana Sousa",
        crm: "CRM/SP 54321",
        especialidade: "Dermatologia",
        telefone: "(11) 98765-4321",
        email: "dra.ana@clinica.com"
      },
      {
        id: 3,
        nome: "Dr. Ricardo Santos",
        crm: "CRM/SP 67890",
        especialidade: "Ortopedia",
        telefone: "(11) 97654-3210",
        email: "dr.ricardo@clinica.com"
      }
    ];

    const mockPacientes: Paciente[] = [
      {
        id: 1,
        nome: "Maria Silva",
        cpf: "123.456.789-00",
        nascimento: "1985-05-15",
        endereco: "Rua das Flores, 123",
        telefone: "(11) 98765-4321"
      },
      {
        id: 2,
        nome: "João Santos",
        cpf: "987.654.321-00",
        nascimento: "1990-10-20",
        endereco: "Av. Principal, 456",
        telefone: "(11) 91234-5678"
      },
      {
        id: 3,
        nome: "Ana Oliveira",
        cpf: "456.789.123-00",
        nascimento: "1978-03-25",
        endereco: "Rua dos Pinheiros, 789",
        telefone: "(11) 97654-3210"
      }
    ];

    const mockProntuarios: Prontuario[] = [
      {
        id: 1,
        consultaId: 1,
        anotacoes: "Paciente apresentou sintomas de gripe, incluindo febre e dor de garganta.",
        diagnostico: "Gripe comum",
        data: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        consultaId: 2,
        anotacoes: "Paciente com manchas na pele e coceira intensa.",
        diagnostico: "Dermatite alérgica",
        data: new Date().toISOString().split('T')[0]
      },
      {
        id: 3,
        consultaId: 3,
        anotacoes: "Paciente com dores no joelho após atividade física.",
        diagnostico: "Tendinite patelar",
        data: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0]
      }
    ];

    setConsultas(mockConsultas);
    setMedicos(mockMedicos);
    setPacientes(mockPacientes);
    setProntuarios(mockProntuarios);
  }, []);

  // Funções de utilidade
  const getConsultaById = (id: number) => {
    return consultas.find(consulta => consulta.id === id);
  };

  const getMedicoById = (id: number) => {
    return medicos.find(medico => medico.id === id);
  };

  const getPacienteById = (id: number) => {
    return pacientes.find(paciente => paciente.id === id);
  };

  // Funções de manipulação
  const handleAdd = (type: string) => {
    console.log(`Adicionar novo ${type}`);
    // Implementar lógica para adicionar
  };

  const handleEdit = (type: string, item: Prontuario) => {
    console.log(`Editar ${type}:`, item);
    // Implementar lógica para editar
  };

  const handleDelete = (type: string, id: number) => {
    console.log(`Excluir ${type} com ID:`, id);
    setProntuarios(prontuarios.filter(p => p.id !== id));
  };

  // Renderizar o componente Prontuarios com as props necessárias
  return (
    <Prontuarios 
      prontuarios={prontuarios}
      consultas={consultas}
      handleAdd={handleAdd}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      getConsultaById={getConsultaById}
      getMedicoById={getMedicoById}
      getPacienteById={getPacienteById}
    />
  );
}

// O componente Prontuarios existente (remover export default)
interface ProntuariosProps {
  prontuarios: Prontuario[];
  consultas: Consulta[];
  handleAdd: (type: string) => void;
  handleEdit: (type: string, item: Prontuario) => void;
  handleDelete: (type: string, id: number) => void;
  getConsultaById: (id: number) => Consulta | undefined;
  getMedicoById: (id: number) => Medico | undefined;
  getPacienteById: (id: number) => Paciente | undefined;
}

const Prontuarios: React.FC<ProntuariosProps> = ({ 
  prontuarios,
  consultas,
  handleAdd, 
  handleEdit, 
  handleDelete,
  getConsultaById,
  getMedicoById,
  getPacienteById
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

  const prontuariosRecentes = prontuarios
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 3);

  return (
    <motion.div
      key="prontuarios"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Prontuários</h2>
          <p className="text-slate-500 mt-1">Registros médicos e histórico dos pacientes</p>
          <p className="text-sm text-slate-400 mt-1">{prontuarios.length} prontuários no sistema</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAdd('prontuario')}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Prontuário</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total de Prontuários</p>
              <p className="text-2xl font-bold">{prontuarios.length}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Este Mês</p>
              <p className="text-2xl font-bold">{prontuarios.filter(p => {
                const data = new Date(p.data);
                const hoje = new Date();
                return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
              }).length}</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Registradas</p>
              <p className="text-2xl font-bold">{consultas.filter(c => c.status === 'Concluída').length}</p>
            </div>
            <ClipboardList className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pacientes Atendidos</p>
              <p className="text-2xl font-bold">{new Set(prontuarios.map(p => {
                const consulta = getConsultaById(p.consultaId);
                return consulta?.pacienteId;
              })).size}</p>
            </div>
            <User className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Busca e filtros */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Buscar Prontuários</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por paciente..."
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por médico..."
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Lista de prontuários */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Prontuários Médicos</h3>
          <p className="text-sm text-slate-500">{prontuarios.length} registros encontrados</p>
        </div>

        <div className="grid gap-6">
          {prontuarios.map((prontuario, index) => {
            const consulta = getConsultaById(prontuario.consultaId);
            const medico = consulta ? getMedicoById(consulta.medicoId) : null;
            const paciente = consulta ? getPacienteById(consulta.pacienteId) : null;
            
            return (
              <motion.div
                key={prontuario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300"
              >
                {/* Header do prontuário */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800">{paciente?.nome}</h4>
                      <p className="text-sm text-slate-500 mb-1">
                        Atendido por: {medico?.nome} • {medico?.especialidade}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span>📅 {new Date(prontuario.data).toLocaleDateString('pt-BR')}</span>
                        <span>🕐 {consulta?.hora}</span>
                        <span>📋 Prontuário #{prontuario.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Visualizar prontuário"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit('prontuario', prontuario)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                      title="Editar prontuário"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Baixar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete('prontuario', prontuario.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Excluir prontuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Conteúdo do prontuário */}
                <div className="space-y-6">
                  {/* Diagnóstico */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <h5 className="font-semibold text-slate-800">Diagnóstico</h5>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{prontuario.diagnostico}</p>
                  </div>
                  
                  {/* Anotações */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <ClipboardList className="w-5 h-5 text-slate-600" />
                      <h5 className="font-semibold text-slate-800">Anotações da Consulta</h5>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{prontuario.anotacoes}</p>
                  </div>
                  
                  {/* Informações adicionais */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                      <User className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Paciente</p>
                      <p className="font-medium text-slate-800">{paciente?.nome}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                      <Stethoscope className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Médico</p>
                      <p className="font-medium text-slate-800">{medico?.nome}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Data da Consulta</p>
                      <p className="font-medium text-slate-800">
                        {new Date(prontuario.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {prontuarios.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhum prontuário encontrado</p>
            <p className="text-slate-400 text-sm mb-6">
              Os prontuários aparecerão aqui após as consultas serem registradas
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd('prontuario')}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Criar Primeiro Prontuário
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Resumo recente */}
      {prontuariosRecentes.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Prontuários Recentes</h3>
          <div className="space-y-3">
            {prontuariosRecentes.map((prontuario, index) => {
              const consulta = getConsultaById(prontuario.consultaId);
              const paciente = consulta ? getPacienteById(consulta.pacienteId) : null;
              const medico = consulta ? getMedicoById(consulta.medicoId) : null;
              
              return (
                <motion.div
                  key={prontuario.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{paciente?.nome}</p>
                      <p className="text-sm text-slate-500">
                        {medico?.nome} • {new Date(prontuario.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};