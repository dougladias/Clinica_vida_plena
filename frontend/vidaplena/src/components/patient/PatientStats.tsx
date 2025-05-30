import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { PatientStats as PatientStatsType } from '@/types/patient.type';

interface PatientStatsProps {
  stats: PatientStatsType;
}

export function PatientStats({ stats }: PatientStatsProps) {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div variants={cardVariants}>
        <Card className="border-l-4 border-l-emerald-500 dark:border-l-emerald-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total de Pacientes
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {stats.total}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={cardVariants}>
        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Novos (Mês Atual)
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {stats.newThisMonth}
            </motion.div>                
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={cardVariants}>
        <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Consultas Ativas
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {stats.activeConsultations}
            </motion.div>                
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={cardVariants}>
        <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-600 hover:shadow-lg transition-all duration-300 dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pacientes Ativos
            </CardTitle>
            <motion.div whileHover={{ rotate: 15 }}>
              <Activity className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {stats.activePatients}
            </motion.div>                
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}