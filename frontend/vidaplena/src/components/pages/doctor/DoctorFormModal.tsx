import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Medico } from '@/types/doctor.type';

interface FormData {
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}

interface DoctorFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  selectedMedico: Medico | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData, mode: 'create' | 'edit', id?: string) => Promise<{ error?: string }>;
}

export const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
  open,
  mode,
  selectedMedico,
  onOpenChange,
  onSubmit
}) => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Efeito para preencher o formulário quando estiver editando
  useEffect(() => {
    if (selectedMedico && mode === 'edit') {
      setFormData({
        nome: selectedMedico.name,
        crm: selectedMedico.crm,
        especialidade: selectedMedico.specialty,
        telefone: selectedMedico.phone,
        email: selectedMedico.email
      });
    } else {
      // Resetar formulário quando for criação
      setFormData({
        nome: '',
        crm: '',
        especialidade: '',
        telefone: '',
        email: ''
      });
    }
  }, [selectedMedico, mode]);

  // Handler para atualização dos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await onSubmit(formData, mode, selectedMedico?.id);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      setSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar médico:', error);
      setError('Ocorreu um erro ao salvar os dados. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    onOpenChange(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Médico' : 'Editar Médico'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Preencha os dados para cadastrar um novo médico' 
              : 'Atualize as informações do médico'}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-6"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nome Completo
            </label>
            <Input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              placeholder="Dr. João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              CRM
            </label>
            <Input
              type="text"
              name="crm"
              value={formData.crm}
              onChange={handleInputChange}
              required
              placeholder="CRM/SP 12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Especialidade
            </label>
            <Input
              type="text"
              name="especialidade"
              value={formData.especialidade}
              onChange={handleInputChange}
              required
              placeholder="Cardiologia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Telefone
            </label>
            <Input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              required
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="medico@clinica.com"
            />
          </div>

          {/* Mensagem de erro */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensagem de sucesso */}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  Médico {mode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${success ? 'bg-green-500 hover:bg-green-600' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvo com sucesso!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Cadastrar' : 'Salvar'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};