'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Activity, Shield, Users } from 'lucide-react';
import FeatureItem from './FeatureItem/FeatureItem';
import StatItem from './StatItem/StatItem';


// Variantes de animação para os itens dentro do container
const LeftPanel: React.FC = () => {  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Variantes de animação para o efeito de pulso
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

  // Lista de recursos e estatísticas
  const features = [
    { icon: Users, text: "Gestão completa de pacientes e médicos" },
    { icon: Activity, text: "Prontuários eletrônicos seguros" },
    { icon: Shield, text: "Dados protegidos e criptografados" }
  ];

  // Estatísticas para exibir no painel
  const stats = [
    { number: "500+", label: "Clínicas" },
    { number: "50k+", label: "Pacientes" },
    { number: "99.9%", label: "Uptime" }
  ];

  // Renderiza o painel esquerdo com animações e informações
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 p-12 flex-col justify-center relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10">
        {/* Logo e Branding */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <Stethoscope className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white">Vida Plena</h1>
              <p className="text-white/80">Sistema de Gestão Médica</p>
            </div>
          </div>

          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="w-20 h-1 bg-gradient-to-r from-white to-emerald-300 rounded-full"
          />
        </motion.div>

        {/* Título Principal */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Cuide da Saúde
            <br />
            <span className="text-emerald-300">com Excelência</span>
          </h2>
          <p className="text-xl text-white/80 leading-relaxed">
            Gerencie sua clínica de forma moderna, eficiente e segura.
            Transforme o atendimento aos seus pacientes.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          {features.map((feature, index) => (
            <FeatureItem key={index} icon={feature.icon} text={feature.text} />
          ))}
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <StatItem key={index} number={stat.number} label={stat.label} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeftPanel;