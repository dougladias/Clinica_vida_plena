import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medico } from '@/types/doctor.type';

interface SpecialtyListProps {
  medicos: Medico[];
  selectedEspecialidade: string;
  onEspecialidadeChange: (especialidade: string) => void;
}

export const SpecialtyList: React.FC<SpecialtyListProps> = ({
  medicos,
  selectedEspecialidade,
  onEspecialidadeChange
}) => {
  const especialidades = [...new Set(medicos.map(m => m.specialty))];

  if (especialidades.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Especialidades Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {especialidades.map((especialidade, index) => {
            const medicosEspecialidade = medicos.filter(m => m.specialty === especialidade);
            const isSelected = selectedEspecialidade === especialidade;
            
            return (
              <motion.div
                key={especialidade}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onEspecialidadeChange(isSelected ? '' : especialidade)}
                className={`text-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 border-2 border-blue-300 dark:border-blue-700' 
                    : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  isSelected ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-slate-800 dark:text-white text-sm mb-1">{especialidade}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {medicosEspecialidade.length} médico{medicosEspecialidade.length !== 1 ? 's' : ''}
                </p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};