import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

interface MedicalRecordStatsType {
  total: number;
  thisMonth: number;
  completedConsultations: number;
  uniquePatients: number;
}

interface MedicalRecordSidebarProps {
  stats: MedicalRecordStatsType;
}

export const MedicalRecordSidebar: React.FC<MedicalRecordSidebarProps> = ({
  stats
}) => {
  return (
    <div className="xl:col-span-1 space-y-8">
      {/* Estatísticas detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Desempenho Mensal</CardTitle>
          <CardDescription>Evolução dos prontuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Prontuários criados</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{stats.thisMonth}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.thisMonth / (stats.total || 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Consultas registradas</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{stats.completedConsultations}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.completedConsultations / (stats.total || 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Pacientes atendidos</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{stats.uniquePatients}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.uniquePatients / (stats.total || 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};