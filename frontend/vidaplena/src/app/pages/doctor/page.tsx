"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDoctors, 
  getDoctorStats,
  handleCreateDoctor,
  handleUpdateDoctor,
  handleDeleteDoctor 
} from '@/server/doctor/useDoctor';
import { 
  Doctor,           
  DoctorStats,      
  CreateDoctorData, 
  UpdateDoctorData 
} from '@/types/doctor.type'; 

// Importando componentes
import { DoctorStats as DoctorStatsComponent } from '@/components/pages/doctor/DoctorStats';
import { SearchBar } from '@/components/pages/doctor/SearchBar';
import { DoctorList } from '@/components/pages/doctor/DoctorList';
import { SpecialtyList } from '@/components/pages/doctor/SpecialtyList';
import { DoctorFormModal } from '@/components/pages/doctor/DoctorFormModal';
import { ErrorBanner } from '@/components/pages/doctor/ErrorBanner';
import { PageHeader } from '@/components/pages/doctor/PageHeader';

// Página principal do componente de médicos
export default function DoctorPage() {  
  // Estados - TYPES ATUALIZADOS
  const [medicos, setMedicos] = useState<Doctor[]>([]);            // ← MUDOU
  const [stats, setStats] = useState<DoctorStats>({               // ← MUDOU
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
  const [selectedMedico, setSelectedMedico] = useState<Doctor | null>(null);  // ← MUDOU
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // ... (variantes de animação permanecem iguais)
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  // Função para carregar dados dos médicos e estatísticas
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
        // Campo atualizado: specialty
        const especialidades = [...new Set(medicosData.map((medico: Doctor) => medico.specialty))];
        
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

  const handleEdit = (medico: Doctor) => {   // ← TYPE ATUALIZADO
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

  // Handler atualizado para novos campos
  const handleFormSubmit = async (
    formData: { name: string; crm: string; specialty: string; phone: string; email: string }, // ← CAMPOS ATUALIZADOS
    mode: 'create' | 'edit',
    id?: string
  ) => {
    if (mode === 'create') {
      const createData: CreateDoctorData = {
        name: formData.name,           // ← NOVO CAMPO
        crm: formData.crm,
        specialty: formData.specialty, // ← NOVO CAMPO
        phone: formData.phone,         // ← NOVO CAMPO
        email: formData.email
      };
      
      const result = await handleCreateDoctor(createData);
      if (!result.error) {
        await loadData();
      }
      return result;
    } else if (mode === 'edit' && id) {
      const updateData: UpdateDoctorData = {
        id,
        name: formData.name,           // ← NOVO CAMPO
        crm: formData.crm,
        specialty: formData.specialty, // ← NOVO CAMPO
        phone: formData.phone,         // ← NOVO CAMPO
        email: formData.email
      };
      
      const result = await handleUpdateDoctor(updateData);
      if (!result.error) {
        await loadData();
      }
      return result;
    }
    
    return { error: 'Modo inválido ou ID não fornecido' };
  };

  // Campo atualizado
  const especialidades = [...new Set(medicos.map(m => m.specialty))]; // ← CAMPO ATUALIZADO

  const backgroundElements = [
    { left: '5%', top: '15%', size: 200 },
    { left: '90%', top: '10%', size: 250 },
    { left: '80%', top: '60%', size: 180 },
    { left: '20%', top: '80%', size: 220 },
    { left: '40%', top: '30%', size: 160 }
  ];

  if (!isMounted) {
    return null; 
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
        <ErrorBanner 
          error={error} 
          refreshing={refreshing} 
          onRefresh={handleRefresh} 
        />
      </AnimatePresence>

      {/* Header da página */}
      <motion.div variants={itemVariants} className="flex items-center justify-between p-2">
        <PageHeader 
          title="Médicos" 
          subtitle="Gerencie o corpo médico da clínica" 
        />
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedEspecialidade={selectedEspecialidade}
          especialidades={especialidades}
          onEspecialidadeChange={setSelectedEspecialidade}
          onAddClick={handleAdd}
          loading={loading}
        />
      </motion.div>

      {/* Cards de estatísticas */}
      <motion.div variants={itemVariants}>
        <DoctorStatsComponent 
          loading={loading} 
          stats={stats} 
          especialidades={especialidades}
        />
      </motion.div>

      {/* Lista de médicos */}
      <motion.div variants={itemVariants}>
        <DoctorList
          loading={loading}
          medicos={medicos}
          searchTerm={searchTerm}
          selectedEspecialidade={selectedEspecialidade}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Especialidades em destaque */}
      <motion.div variants={itemVariants}>
        <SpecialtyList
          medicos={medicos}
          selectedEspecialidade={selectedEspecialidade}
          onEspecialidadeChange={setSelectedEspecialidade}
        />
      </motion.div>

      {/* Modal para Criar/Editar Médico */}
      <DoctorFormModal
        open={showModal}
        mode={modalMode}
        selectedMedico={selectedMedico}
        onOpenChange={setShowModal}
        onSubmit={handleFormSubmit}
      />
    </motion.div>
  );
}