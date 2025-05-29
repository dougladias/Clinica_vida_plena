"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  Plus,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  Search,
  Filter
} from 'lucide-react';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  nascimento: string;
  endereco: string;
  telefone: string;
}

export default function PacientesPage() {
  // Estados para armazenar os dados
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm] = useState('');

  // Carregar dados de exemplo
  useEffect(() => {
    // Dados mock para teste
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

    setPacientes(mockPacientes);
  }, []);

  // Funções de manipulação
  const handleAdd = (type: string) => {
    console.log(`Adicionar novo ${type}`);
    // Implementar lógica para adicionar
  };

  const handleEdit = (type: string, item: Paciente) => {
    console.log(`Editar ${type}:`, item);
    // Implementar lógica para editar
  };

  const handleDelete = (type: string, id: number) => {
    console.log(`Excluir ${type} com ID:`, id);
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  // Configurações de animação
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

  // Filtragem de pacientes
  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  const calcularIdade = (nascimento: string): number => {
    const hoje = new Date();
    const dataNasc = new Date(nascimento);
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  };

  // Renderização do componente
  return (
    <motion.div
      key="pacientes"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Pacientes</h2>
          <p className="text-slate-500 mt-1">Gerencie os pacientes da clínica</p>
          <p className="text-sm text-slate-400 mt-1">{pacientes.length} pacientes cadastrados</p>
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
            onClick={() => handleAdd('paciente')}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Paciente</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total de Pacientes</p>
              <p className="text-2xl font-bold">{pacientes.length}</p>
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Novos este Mês</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Consultas Agendadas</p>
              <p className="text-2xl font-bold">34</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ativos</p>
              <p className="text-2xl font-bold">{pacientes.length}</p>
            </div>
            <User className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </motion.div>

      {/* Tabela de pacientes */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Lista de Pacientes</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou CPF..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">Paciente</th>
                <th className="text-left p-4 font-semibold text-slate-700">CPF</th>
                <th className="text-left p-4 font-semibold text-slate-700">Idade</th>
                <th className="text-left p-4 font-semibold text-slate-700">Contato</th>
                <th className="text-left p-4 font-semibold text-slate-700">Endereço</th>
                <th className="text-left p-4 font-semibold text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pacientesFiltrados.map((paciente, index) => (
                <motion.tr
                  key={paciente.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{paciente.nome}</p>
                        <p className="text-sm text-slate-500">Paciente</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-mono text-sm text-slate-600">{paciente.cpf}</span>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <span className="font-medium text-slate-800">{calcularIdade(paciente.nascimento)} anos</span>
                      <p className="text-xs text-slate-500">
                        {new Date(paciente.nascimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-1 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{paciente.telefone}</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-start space-x-1 text-sm text-slate-600 max-w-xs">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{paciente.endereco}</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit('paciente', paciente)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar paciente"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Ver histórico"
                      >
                        <Calendar className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete('paciente', paciente.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
        </div>
        
        {pacientesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhum paciente encontrado</p>
            <p className="text-slate-400 text-sm">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece cadastrando um novo paciente'}
            </p>
          </div>
        )}
        
        {/* Paginação */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Mostrando {pacientesFiltrados.length} de {pacientes.length} pacientes
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 rounded transition-colors">
                Anterior
              </button>
              <button className="px-3 py-1 text-sm bg-green-500 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 rounded transition-colors">
                2
              </button>
              <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 rounded transition-colors">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};