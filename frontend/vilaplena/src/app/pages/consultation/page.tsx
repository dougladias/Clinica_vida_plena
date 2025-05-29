"use client";

import React, { useState, useEffect } from 'react';
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
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
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

export default function ConsultationPage() {
  // Estados para gerenciar os dados
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

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
        status: "Agendada"
      },
      {
        id: 2,
        data: new Date().toISOString().split('T')[0], // Hoje
        hora: "16:00",
        medicoId: 2,
        pacienteId: 2,
        status: "Em Andamento"
      },
      {
        id: 3,
        data: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], // Amanhã
        hora: "10:15",
        medicoId: 3,
        pacienteId: 3,
        status: "Agendada"
      },
      {
        id: 4,
        data: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Ontem
        hora: "09:00",
        medicoId: 1,
        pacienteId: 2,
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

    setConsultas(mockConsultas);
    setMedicos(mockMedicos);
    setPacientes(mockPacientes);
  }, []);

  // Funções de utilidade
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

  const handleEdit = (type: string, item: Consulta) => {
    console.log(`Editar ${type}:`, item);
    // Implementar lógica para editar
  };

  const handleDelete = (type: string, id: number) => {
    console.log(`Excluir ${type} com ID:`, id);
    setConsultas(consultas.filter(c => c.id !== id));
  };

  // Renderizar o componente Consultas com as props necessárias
  return (
    <Consultas 
      consultas={consultas}
      medicos={medicos}
      pacientes={pacientes}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      handleAdd={handleAdd}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      getMedicoById={getMedicoById}
      getPacienteById={getPacienteById}
    />
  );
}

// O componente Consultas existente permanece o mesmo
interface ConsultasProps {
  consultas: Consulta[];
  medicos: Medico[];
  pacientes: Paciente[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  handleAdd: (type: string) => void;
  handleEdit: (type: string, item: Consulta) => void;
  handleDelete: (type: string, id: number) => void;
  getMedicoById: (id: number) => Medico | undefined;
  getPacienteById: (id: number) => Paciente | undefined;
}

const Consultas: React.FC<ConsultasProps> = ({ 
  consultas, 
  medicos,  
  selectedDate,
  setSelectedDate,
  handleAdd, 
  handleEdit, 
  handleDelete,
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

  const consultasDoDia = consultas.filter(c => c.data === selectedDate);
  const consultasAgendadas = consultas.filter(c => c.status === 'Agendada');
  const consultasEmAndamento = consultas.filter(c => c.status === 'Em Andamento');
  const consultasConcluidas = consultas.filter(c => c.status === 'Concluída');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendada':
        return 'bg-blue-100 text-blue-800';
      case 'Em Andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Concluída':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const proximoDia = () => {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() + 1);
    setSelectedDate(data.toISOString().split('T')[0]);
  };

  const diaAnterior = () => {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() - 1);
    setSelectedDate(data.toISOString().split('T')[0]);
  };

  return (
    <motion.div
      key="consultas"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Consultas</h2>
          <p className="text-slate-500 mt-1">Gerencie os agendamentos da clínica</p>
          <p className="text-sm text-slate-400 mt-1">{consultas.length} consultas no sistema</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={diaAnterior}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={proximoDia}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          
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
            onClick={() => handleAdd('consulta')}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Consulta</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Hoje</p>
              <p className="text-2xl font-bold">{consultasDoDia.length}</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Agendadas</p>
              <p className="text-2xl font-bold">{consultasAgendadas.length}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Em Andamento</p>
              <p className="text-2xl font-bold">{consultasEmAndamento.length}</p>
            </div>
            <Stethoscope className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Concluídas</p>
              <p className="text-2xl font-bold">{consultasConcluidas.length}</p>
            </div>
            <CalendarDays className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Agenda do dia */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Agenda do Dia - {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className="text-sm text-slate-500">{consultasDoDia.length} consultas agendadas</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por paciente ou médico..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {consultasDoDia.length > 0 ? (
          <div className="space-y-4">
            {consultasDoDia
              .sort((a, b) => a.hora.localeCompare(b.hora))
              .map((consulta, index) => {
                const medico = getMedicoById(consulta.medicoId);
                const paciente = getPacienteById(consulta.pacienteId);
                
                return (
                  <motion.div
                    key={consulta.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: '#f8fafc' }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Horário */}
                      <div className="text-center min-w-[80px]">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{consulta.hora}</p>
                      </div>
                      
                      {/* Paciente */}
                      <div className="min-w-[200px]">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="font-semibold text-slate-800">{paciente?.nome}</p>
                        </div>
                        <p className="text-sm text-slate-500">{paciente?.telefone}</p>
                      </div>
                      
                      {/* Médico */}
                      <div className="min-w-[200px]">
                        <div className="flex items-center space-x-2 mb-1">
                          <Stethoscope className="w-4 h-4 text-slate-400" />
                          <p className="font-medium text-slate-800">{medico?.nome}</p>
                        </div>
                        <p className="text-sm text-slate-500">{medico?.especialidade}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                        {consulta.status}
                      </span>
                      
                      {/* Ações */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit('consulta', consulta)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar consulta"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Iniciar consulta"
                        >
                          <Stethoscope className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete('consulta', consulta.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Cancelar consulta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhuma consulta agendada para este dia</p>
            <p className="text-slate-400 text-sm mb-4">
              Que tal agendar uma nova consulta?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd('consulta')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Agendar Consulta
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Vista semanal */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Visão Semanal</h3>
        
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }, (_, i) => {
            const data = new Date(selectedDate);
            data.setDate(data.getDate() - data.getDay() + i);
            const dataStr = data.toISOString().split('T')[0];
            const consultasDia = consultas.filter(c => c.data === dataStr);
            const isToday = dataStr === new Date().toISOString().split('T')[0];
            const isSelected = dataStr === selectedDate;
            
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDate(dataStr)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                    : isToday 
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="text-center">
                  <p className={`text-xs font-medium mb-1 ${
                    isSelected ? 'text-purple-100' : 'text-slate-500'
                  }`}>
                    {data.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold mb-2 ${
                    isSelected ? 'text-white' : isToday ? 'text-blue-800' : 'text-slate-800'
                  }`}>
                    {data.getDate()}
                  </p>
                  <div className={`text-xs ${
                    isSelected ? 'text-purple-100' : 'text-slate-500'
                  }`}>
                    {consultasDia.length} consulta{consultasDia.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Resumo por médico */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Consultas por Médico</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicos.map((medico, index) => {
            const consultasMedico = consultasDoDia.filter(c => c.medicoId === medico.id);
            
            return (
              <motion.div
                key={medico.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{medico.nome}</p>
                    <p className="text-xs text-slate-500">{medico.especialidade}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Consultas hoje:</span>
                    <span className="font-semibold text-slate-800">{consultasMedico.length}</span>
                  </div>
                  
                  {consultasMedico.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Próximas:</p>
                      <div className="space-y-1">
                        {consultasMedico.slice(0, 2).map(consulta => {
                          const paciente = getPacienteById(consulta.pacienteId);
                          return (
                            <div key={consulta.id} className="text-xs text-slate-600 bg-white rounded px-2 py-1">
                              {consulta.hora} - {paciente?.nome}
                            </div>
                          );
                        })}
                        {consultasMedico.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{consultasMedico.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};