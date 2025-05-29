"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  UserCheck, 
  Receipt,
  Plus,
  Clock,
  ChevronRight,
  FileText  
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

interface DashboardProps {
  consultas: Consulta[];
  pacientes: Paciente[];
  medicos: Medico[];
  receitas: Receita[];
  selectedDate: string;
  handleAdd: (type: string) => void;
  getMedicoById: (id: number) => Medico | undefined;
  getPacienteById: (id: number) => Paciente | undefined;
}

export default function DashboardPage() {
  // Dados mock ou estado inicial
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [selectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Simular carregamento de dados ou conectar à API real posteriormente
  useEffect(() => {
    // Dados de exemplo
    const mockConsultas: Consulta[] = [
      {
        id: 1,
        data: new Date().toISOString().split('T')[0], // Hoje
        hora: "14:30",
        medicoId: 1,
        pacienteId: 1,
        status: "Agendada"
      },
      // Adicione mais consultas se desejar
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
      // Adicione mais pacientes se desejar
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
      // Adicione mais médicos se desejar
    ];

    const mockReceitas: Receita[] = [
      {
        id: 1,
        consultaId: 1,
        medicamentos: "Paracetamol 500mg",
        instrucoes: "Tomar 1 comprimido a cada 8 horas",
        data: new Date().toISOString().split('T')[0]
      },
      // Adicione mais receitas se desejar
    ];

    setConsultas(mockConsultas);
    setPacientes(mockPacientes);
    setMedicos(mockMedicos);
    setReceitas(mockReceitas);
  }, []);

  // Funções de utilidade
  const getMedicoById = (id: number) => {
    return medicos.find(medico => medico.id === id);
  };

  const getPacienteById = (id: number) => {
    return pacientes.find(paciente => paciente.id === id);
  };

  const handleAdd = (type: string) => {
    console.log(`Adicionar novo ${type}`);
    // Implementar lógica para adicionar novo item
  };

  // Renderizar o componente Dashboard com as props necessárias
  return (
    <Dashboard 
      consultas={consultas}
      pacientes={pacientes}
      medicos={medicos}
      receitas={receitas}
      selectedDate={selectedDate}
      handleAdd={handleAdd}
      getMedicoById={getMedicoById}
      getPacienteById={getPacienteById}
    />
  );
}

// O componente Dashboard existente permanece o mesmo
const Dashboard: React.FC<DashboardProps> = ({ 
  consultas, 
  pacientes, 
  medicos, 
  receitas, 
  selectedDate, 
  handleAdd, 
  getMedicoById, 
  getPacienteById 
}) => {
  const consultasHoje = consultas.filter(c => c.data === selectedDate);
  const consultasAmanha = consultas.filter(c => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return c.data === amanha.toISOString().split('T')[0];
  });

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

  return (
    <motion.div
      key="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 mt-1">Bem-vindo ao sistema de gestão da Clínica Vida Plena</p>
          <p className="text-sm text-slate-400 mt-1">
            Hoje, {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAdd('consulta')}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nova Consulta</span>
        </motion.button>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-75 bg-white bg-opacity-20 px-2 py-1 rounded-full">Hoje</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Consultas Agendadas</p>
            <p className="text-3xl font-bold">{consultasHoje.length}</p>
            <p className="text-xs opacity-75 mt-2">
              {consultasAmanha.length} amanhã
            </p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-75 bg-white bg-opacity-20 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Pacientes Ativos</p>
            <p className="text-3xl font-bold">{pacientes.length}</p>
            <p className="text-xs opacity-75 mt-2">Cadastrados</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <UserCheck className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-75 bg-white bg-opacity-20 px-2 py-1 rounded-full">Ativo</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Médicos Disponíveis</p>
            <p className="text-3xl font-bold">{medicos.length}</p>
            <p className="text-xs opacity-75 mt-2">Especialidades</p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Receipt className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-75 bg-white bg-opacity-20 px-2 py-1 rounded-full">Mês</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Receitas Emitidas</p>
            <p className="text-3xl font-bold">{receitas.length}</p>
            <p className="text-xs opacity-75 mt-2">Este mês</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Área principal com consultas e atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consultas de hoje */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Consultas de Hoje</h3>
              <p className="text-sm text-slate-500">{consultasHoje.length} consultas agendadas</p>
            </div>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver todas
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
          
          {consultasHoje.length > 0 ? (
            <div className="space-y-4">
              {consultasHoje.map((consulta, index) => {
                const medico = getMedicoById(consulta.medicoId);
                const paciente = getPacienteById(consulta.pacienteId);
                return (
                  <motion.div
                    key={consulta.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: '#f8fafc' }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{paciente?.nome}</p>
                        <p className="text-sm text-slate-500">{medico?.nome} • {medico?.especialidade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{consulta.hora}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        consulta.status === 'Agendada' ? 'bg-blue-100 text-blue-800' :
                        consulta.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {consulta.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhuma consulta agendada para hoje</p>
            </div>
          )}
        </motion.div>

        {/* Atividades recentes */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Atividades Recentes</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Novo paciente cadastrado</p>
                  <p className="text-xs text-slate-500">Roberto Fernandes - há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Prontuário atualizado</p>
                  <p className="text-xs text-slate-500">Maria Silva - há 3 horas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Receita emitida</p>
                  <p className="text-xs text-slate-500">Carlos Oliveira - há 4 horas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="font-semibold text-slate-800 mb-4">Resumo Rápido</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Consultas Concluídas</span>
                <span className="font-semibold text-slate-800">{consultas.filter(c => c.status === 'Concluída').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Em Andamento</span>
                <span className="font-semibold text-slate-800">{consultas.filter(c => c.status === 'Em Andamento').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Prontuários</span>
                <span className="font-semibold text-slate-800">12</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};