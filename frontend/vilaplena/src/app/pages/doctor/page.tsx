"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck,
  Plus,
  Edit,
  Trash2,  
  Phone,
  Mail,
  Stethoscope,
  Search,
  Filter,
  Award,
  Calendar
} from 'lucide-react';

interface Medico {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}

export default function DoctorPage() {
  // Estados para gerenciar os dados
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [searchTerm] = useState('');

  // Carregar dados de exemplo
  useEffect(() => {
    // Dados mock para teste
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

    setMedicos(mockMedicos);
  }, []);

  // Funções de manipulação
  const handleAdd = (type: string) => {
    console.log(`Adicionar novo ${type}`);
    // Implementar lógica para adicionar
  };

  const handleEdit = (type: string, item: Medico) => {
    console.log(`Editar ${type}:`, item);
    // Implementar lógica para editar
  };

  const handleDelete = (type: string, id: number) => {
    console.log(`Excluir ${type} com ID:`, id);
    setMedicos(medicos.filter(m => m.id !== id));
  };

  // Renderizar o componente Medicos com as props necessárias
  return (
    <Medicos
      medicos={medicos}
      searchTerm={searchTerm}
      handleAdd={handleAdd}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}

// Manter o componente Medicos existente
interface MedicosProps {
  medicos: Medico[];
  searchTerm: string;
  handleAdd: (type: string) => void;
  handleEdit: (type: string, item: Medico) => void;
  handleDelete: (type: string, id: number) => void;
}

const Medicos: React.FC<MedicosProps> = ({ 
  medicos, 
  searchTerm, 
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

  const medicosFiltrados = medicos.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.crm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const especialidades = [...new Set(medicos.map(m => m.especialidade))];

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
          <p className="text-sm text-slate-400 mt-1">{medicos.length} médicos cadastrados</p>
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
            onClick={() => handleAdd('medico')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Médico</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total de Médicos</p>
              <p className="text-2xl font-bold">{medicos.length}</p>
            </div>
            <UserCheck className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Especialidades</p>
              <p className="text-2xl font-bold">{especialidades.length}</p>
            </div>
            <Award className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Disponíveis Hoje</p>
              <p className="text-2xl font-bold">{medicos.length}</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Hoje</p>
              <p className="text-2xl font-bold">24</p>
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
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
          </div>
        </div>

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
                    <h4 className="font-bold text-slate-800 text-lg">{medico.nome}</h4>
                    <p className="text-sm text-slate-500">CRM: {medico.crm}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit('medico', medico)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar médico"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete('medico', medico.id)}
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
                  {medico.especialidade}
                </span>
              </div>

              {/* Informações de contato */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-slate-500" />
                  </div>
                  <span>{medico.telefone}</span>
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
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">Disponível</span>
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

        {medicosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhum médico encontrado</p>
            <p className="text-slate-400 text-sm">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece cadastrando um novo médico'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Especialidades em destaque */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Especialidades Disponíveis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {especialidades.map((especialidade, index) => {
            const medicosEspecialidade = medicos.filter(m => m.especialidade === especialidade);
            return (
              <motion.div
                key={especialidade}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-slate-800 text-sm mb-1">{especialidade}</h4>
                <p className="text-xs text-slate-500">{medicosEspecialidade.length} médico{medicosEspecialidade.length !== 1 ? 's' : ''}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};