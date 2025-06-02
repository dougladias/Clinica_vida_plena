import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  User,
  ClipboardList,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MedicalRecordStatsType {
  total: number;
  thisMonth: number;
  completedConsultations: number;
  uniquePatients: number;
}

interface MedicalRecordStatsProps {
  stats: MedicalRecordStatsType;
  loading: boolean;
}

export const MedicalRecordStats: React.FC<MedicalRecordStatsProps> = ({
  stats,
  loading
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
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
    >
      {/* Total de Prontuários */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.total}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">Total de Prontuários</CardTitle>
          <Separator className="mt-2 bg-indigo-200 dark:bg-indigo-800" />
        </CardContent>
      </Card>

      {/* Prontuários este mês */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.thisMonth}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">Este Mês</CardTitle>
          <Separator className="mt-2 bg-blue-200 dark:bg-blue-800" />
        </CardContent>
      </Card>

      {/* Consultas Registradas */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <ClipboardList className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.completedConsultations}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">Consultas Registradas</CardTitle>
          <Separator className="mt-2 bg-purple-200 dark:bg-purple-800" />
        </CardContent>
      </Card>

      {/* Pacientes Atendidos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <User className="w-8 h-8 text-green-500 dark:text-green-400" />
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.uniquePatients}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold">Pacientes Atendidos</CardTitle>
          <Separator className="mt-2 bg-green-200 dark:bg-green-800" />
        </CardContent>
      </Card>
    </motion.div>
  );
};