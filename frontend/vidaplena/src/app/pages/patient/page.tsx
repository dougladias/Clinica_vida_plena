"use client";

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';

// Componentes
import { BackgroundElements } from '@/components/pages/patient/BackgroundElements';
import { LoadingSkeleton } from '@/components/pages/patient/LoadingSkeleton';
import { PatientHeader } from '@/components/pages/patient/PatientHeader';
import { PatientStats } from '@/components/pages/patient/PatientStats';
import { PatientTable } from '@/components/pages/patient/PatientTable';
import { PatientModal } from '@/components/pages/patient/PatientModal';

// Types e Hooks
import { Patient, PatientStats as PatientStatsType } from '@/types/patient.type';
import { 
  getPatients, 
  getActiveConsultations, 
  handleDeletePatient 
} from '@/server/patient/usePatient';

export default function PatientsPage() {
  // Estados principais
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStatsType>({
    total: 0,
    newThisMonth: 0,
    activeConsultations: 0,
    activePatients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Variantes de animação para o contêiner principal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
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

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 w-full relative overflow-hidden"
      >
        {/* Elementos de fundo dinâmicos */}
        <BackgroundElements />

        {/* Header com título e botões */}
        <PatientHeader 
          onRefresh={handleRefresh} 
          onAddPatient={handleAddPatient} 
          refreshing={refreshing} 
        />

        {/* Cards de estatísticas */}
        <PatientStats stats={stats} />

        {/* Lista de pacientes */}
        <PatientTable 
          patients={patients}
          onEditPatient={handleEditPatient}
          onDeletePatient={handleDeletePatientClick}
          calculateAge={calculateAge}
          getInitials={getInitials}
        />

        {/* Modal de paciente */}
        <PatientModal 
          isOpen={showModal}
          onClose={closeModal}
          patient={selectedPatient}
          mode={modalMode}
          onSuccess={handleModalSuccess}
        />
      </motion.div>
    </TooltipProvider>
  );
}