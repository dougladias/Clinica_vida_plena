import { Button } from '@/components/ui/button';
import { Users, RefreshCw, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface PatientHeaderProps {
  onRefresh: () => void;
  onAddPatient: () => void;
  refreshing: boolean;
}

export function PatientHeader({ onRefresh, onAddPatient, refreshing }: PatientHeaderProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 text-white rounded-xl shadow-lg"
          >
            <Users className="w-6 h-6" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">
              Pacientes
            </h1>                
          </div>
        </motion.div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
          className="shadow-sm dark:border-slate-700 dark:text-slate-300"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
        
        <Button
          onClick={onAddPatient}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 shadow-md"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Novo Paciente
        </Button>
      </div>
    </motion.div>
  );
}