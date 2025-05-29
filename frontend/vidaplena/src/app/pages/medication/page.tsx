"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Receipt,
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
  Pill,
  FileText,
  Clock,
  Printer
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

interface Receita {
  id: number;
  consultaId: number;
  medicamentos: string;
  instrucoes: string;
  data: string;
}

interface ReceitasProps {
  receitas: Receita[];
  consultas: Consulta[];
  handleAdd: (type: string) => void;
  handleEdit: (type: string, item: Receita) => void;
  handleDelete: (type: string, id: number) => void;
  getConsultaById: (id: number) => Consulta | undefined;
  getMedicoById: (id: number) => Medico | undefined;
  getPacienteById: (id: number) => Paciente | undefined;
}

export default function MedicationPage() {
  // Estados para gerenciar os dados
  const [receitas, setReceitas] = useState<Receita[]>([]);
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

    const mockReceitas: Receita[] = [
      {
        id: 1,
        consultaId: 1,
        medicamentos: "Paracetamol 500mg\nDipirona 1g\nAmoxicilina 500mg",
        instrucoes: "Tomar 1 comprimido de Paracetamol a cada 8 horas em caso de dor ou febre.\nTomar 1 comprimido de Dipirona a cada 6 horas se a dor persistir.\nTomar 1 comprimido de Amoxicilina a cada 8 horas por 7 dias.",
        data: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        consultaId: 2,
        medicamentos: "Loratadina 10mg\nPrednisolona 20mg",
        instrucoes: "Tomar 1 comprimido de Loratadina pela manhã por 5 dias.\nTomar 1 comprimido de Prednisolona após o café da manhã por 3 dias.",
        data: new Date().toISOString().split('T')[0]
      },
      {
        id: 3,
        consultaId: 3,
        medicamentos: "Ibuprofeno 600mg\nOmeprazol 20mg",
        instrucoes: "Tomar 1 comprimido de Ibuprofeno a cada 8 horas por 5 dias.\nTomar 1 cápsula de Omeprazol em jejum pela manhã por 14 dias.",
        data: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0]
      }
    ];

    setConsultas(mockConsultas);
    setMedicos(mockMedicos);
    setPacientes(mockPacientes);
    setReceitas(mockReceitas);
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

  const handleEdit = (type: string, item: Receita) => {
    console.log(`Editar ${type}:`, item);
    // Implementar lógica para editar
  };

  const handleDelete = (type: string, id: number) => {
    console.log(`Excluir ${type} com ID:`, id);
    setReceitas(receitas.filter(r => r.id !== id));
  };

  // Renderizar o componente Receitas com as props necessárias
  return (
    <Receitas 
      receitas={receitas}
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

// O componente Receitas (renomeado para não conflitar com o export default)
const Receitas: React.FC<ReceitasProps> = ({ 
  receitas,  
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

  const receitasRecentes = receitas
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const contarMedicamentos = (medicamentos: string): number => {
    return medicamentos.split('\n').filter(med => med.trim()).length;
  };

  return (
    <motion.div
      key="receitas"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Receitas Médicas</h2>
          <p className="text-slate-500 mt-1">Prescrições e medicamentos dos pacientes</p>
          <p className="text-sm text-slate-400 mt-1">{receitas.length} receitas emitidas</p>
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
            onClick={() => handleAdd('receita')}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Receita</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total de Receitas</p>
              <p className="text-2xl font-bold">{receitas.length}</p>
            </div>
            <Receipt className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Este Mês</p>
              <p className="text-2xl font-bold">{receitas.filter(r => {
                const data = new Date(r.data);
                const hoje = new Date();
                return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
              }).length}</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Medicamentos Prescritos</p>
              <p className="text-2xl font-bold">{receitas.reduce((total, receita) => 
                total + contarMedicamentos(receita.medicamentos), 0
              )}</p>
            </div>
            <Pill className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pacientes Atendidos</p>
              <p className="text-2xl font-bold">{new Set(receitas.map(r => {
                const consulta = getConsultaById(r.consultaId);
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
          <h3 className="text-lg font-semibold text-slate-800">Buscar Receitas</h3>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Todas</span>
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por paciente..."
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por médico..."
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por medicamento..."
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Lista de receitas */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Receitas Médicas</h3>
          <p className="text-sm text-slate-500">{receitas.length} receitas encontradas</p>
        </div>

        <div className="grid gap-6">
          {receitas.map((receita, index) => {
            const consulta = getConsultaById(receita.consultaId);
            const medico = consulta ? getMedicoById(consulta.medicoId) : null;
            const paciente = consulta ? getPacienteById(consulta.pacienteId) : null;
            const medicamentos = receita.medicamentos.split('\n').filter(med => med.trim());
            
            return (
              <motion.div
                key={receita.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all duration-300"
              >
                {/* Header da receita */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                      <Receipt className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800">{paciente?.nome}</h4>
                      <p className="text-sm text-slate-500 mb-1">
                        Prescrito por: Dr(a). {medico?.nome} • CRM: {medico?.crm}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span>📅 {new Date(receita.data).toLocaleDateString('pt-BR')}</span>
                        <span>🕐 {consulta?.hora}</span>
                        <span>💊 {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''}</span>
                        <span>📋 Receita #{receita.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Visualizar receita"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit('receita', receita)}
                      className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Editar receita"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Imprimir receita"
                    >
                      <Printer className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                      title="Baixar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete('receita', receita.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Excluir receita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Conteúdo da receita */}
                <div className="space-y-6">
                  {/* Medicamentos prescritos */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                    <div className="flex items-center space-x-2 mb-4">
                      <Pill className="w-6 h-6 text-emerald-600" />
                      <h5 className="font-bold text-slate-800 text-lg">Medicamentos Prescritos</h5>
                    </div>
                    <div className="space-y-3">
                      {medicamentos.map((medicamento, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-emerald-100"
                        >
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{idx + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{medicamento}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Instruções de uso */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="w-6 h-6 text-slate-600" />
                      <h5 className="font-bold text-slate-800 text-lg">Instruções de Uso</h5>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-100">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{receita.instrucoes}</p>
                    </div>
                  </div>
                  
                  {/* Informações da consulta */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                      <User className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Paciente</p>
                      <p className="font-semibold text-slate-800 text-sm">{paciente?.nome}</p>
                      <p className="text-xs text-slate-400">{paciente?.cpf}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                      <Stethoscope className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Médico Responsável</p>
                      <p className="font-semibold text-slate-800 text-sm">{medico?.nome}</p>
                      <p className="text-xs text-slate-400">{medico?.especialidade}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Data da Prescrição</p>
                      <p className="font-semibold text-slate-800 text-sm">
                        {new Date(receita.data).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-slate-400">{consulta?.hora}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs text-emerald-600 mb-1">Validade</p>
                      <p className="font-semibold text-emerald-800 text-sm">30 dias</p>
                      <p className="text-xs text-emerald-500">A partir da emissão</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {receitas.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhuma receita encontrada</p>
            <p className="text-slate-400 text-sm mb-6">
              As receitas médicas aparecerão aqui após serem emitidas
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd('receita')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Emitir Primeira Receita
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Receitas recentes */}
      {receitasRecentes.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Receitas Recentes</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Ver todas
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {receitasRecentes.map((receita, index) => {
              const consulta = getConsultaById(receita.consultaId);
              const paciente = consulta ? getPacienteById(consulta.pacienteId) : null;
              const medico = consulta ? getMedicoById(consulta.medicoId) : null;
              const numMedicamentos = contarMedicamentos(receita.medicamentos);
              
              return (
                <motion.div
                  key={receita.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:from-emerald-100 hover:to-green-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{paciente?.nome}</p>
                      <p className="text-sm text-slate-500">
                        {medico?.nome} • {numMedicamentos} medicamento{numMedicamentos !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(receita.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors"
                      title="Ver receita"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Imprimir"
                    >
                      <Printer className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};