import React from 'react';
import { motion } from 'framer-motion';
import {
  Edit,
  Trash2,
  Phone,
  Mail,
  Stethoscope,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Medico } from '@/types/doctor.type';
import { useRouter } from 'next/navigation';

interface DoctorCardProps {
  medico: Medico;
  onEdit: (medico: Medico) => void;
  onDelete: (id: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  medico,
  onEdit,
  onDelete
}) => {
  const router = useRouter();
  
  // Função para visualizar a agenda do médico
  const handleViewSchedule = () => {
    // Redireciona para a página de agenda filtrada por este médico
    router.push(`/pages/consultation?doctor_id=${medico.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-md">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-lg">{medico.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">CRM: {medico.crm}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(medico)}>
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-red-600" onClick={() => onDelete(medico.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Especialidade */}
          <div className="mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              <Award className="w-3 h-3 mr-1" />
              {medico.specialty}
            </Badge>
          </div>

          {/* Informações de contato */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span>{medico.phone}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="truncate">{medico.email}</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Status e ações */}
          <div className="flex items-center justify-between">
            <div>
              {/* Informação adicional relevante - data de cadastro */}
              {medico.created_at && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Cadastrado em: {new Date(medico.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                onClick={handleViewSchedule}
              >
                Ver Agenda
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};