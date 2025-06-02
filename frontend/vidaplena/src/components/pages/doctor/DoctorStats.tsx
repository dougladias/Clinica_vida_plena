import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Award, Stethoscope, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoctorStats as DoctorStatsType } from '@/types/doctor.type'; // ← TYPE ATUALIZADO

interface DoctorStatsProps {
  loading: boolean;
  stats: DoctorStatsType; // ← TYPE ATUALIZADO
  especialidades: string[];
}

export const DoctorStats: React.FC<DoctorStatsProps> = ({
  loading,
  stats,
  especialidades
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div variants={itemVariants}>
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total de Médicos
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                stats.totalMedicos
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Especialidades
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <Award className="h-4 w-4 text-purple-600 dark:text-purple-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                stats.especialidades || especialidades.length
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Consultas Hoje
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                stats.consultasHoje || 0
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Disponíveis Hoje
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <Award className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                stats.totalMedicos || 0
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};