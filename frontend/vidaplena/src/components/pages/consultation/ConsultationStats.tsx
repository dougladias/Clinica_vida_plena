// ====================================
// ARQUIVO: src/components/pages/consultation/ConsultationStats.tsx
// ====================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ConsultationStatsType {
  today: number;
  scheduled: number;
  inProgress: number;
  completed: number;
}

interface ConsultationStatsProps {
  stats: ConsultationStatsType;
  loading: boolean;
}

export const ConsultationStats: React.FC<ConsultationStatsProps> = ({
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
      {/* Consultas de hoje */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.today}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-semibold">Consultas Hoje</CardTitle>
          <Separator className="mt-2 bg-purple-200 dark:bg-purple-800" />
        </CardContent>
      </Card>
      
      {/* Agendadas */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.scheduled}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-semibold">Agendadas</CardTitle>
          <Separator className="mt-2 bg-blue-200 dark:bg-blue-800" />
        </CardContent>
      </Card>
      
      {/* Em andamento */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Stethoscope className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.inProgress}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-semibold">Em Andamento</CardTitle>
          <Separator className="mt-2 bg-yellow-200 dark:bg-yellow-800" />
        </CardContent>
      </Card>
      
      {/* Concluídas */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.completed}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-semibold">Concluídas</CardTitle>
          <Separator className="mt-2 bg-emerald-200 dark:bg-emerald-800" />
        </CardContent>
      </Card>
    </motion.div>
  );
};