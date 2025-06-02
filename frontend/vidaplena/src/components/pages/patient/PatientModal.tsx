import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Edit, Save, CheckCircle, AlertCircle, User, Shield, 
         Calendar, Phone, MapPin, Activity } from 'lucide-react';
import { handleCreatePatient, handleUpdatePatient } from '@/server/patient/usePatient';
import { PatientModalProps, PatientFormData, CreatePatientData } from '@/types/patient.type'; 

export function PatientModal({ isOpen, onClose, patient, mode, onSuccess }: PatientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [particleElements, setParticleElements] = useState<Array<{left: string, top: string}>>([]);

  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    cpf: '',
    date_birth: '',
    address: '',
    phone: '',
  });

  // Gerar elementos decorativos
  useEffect(() => {
    if (isOpen) {
      const particles = Array.from({ length: 5 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }));
      setParticleElements(particles);
    }
  }, [isOpen]);

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && patient) {
        setFormData({
          name: patient.name,
          cpf: patient.cpf,
          date_birth: patient.date_birth.split('T')[0],
          address: patient.address,
          phone: patient.phone,
        });
      } else {
        setFormData({
          name: '',
          cpf: '',
          date_birth: '',
          address: '',
          phone: '',
        });
      }
      setError('');
      setSuccess(false);
    }
  }, [isOpen, mode, patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // FUNÇÃO DE SUBMIT ATUALIZADA PARA NOVOS TYPES
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpf || !formData.date_birth || !formData.address || !formData.phone) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'edit' && patient) {
        // Modo edição - usar UpdatePatientData
        const updateData = {
          id: patient.id,
          name: formData.name,
          cpf: formData.cpf,
          date_birth: formData.date_birth,
          address: formData.address,
          phone: formData.phone,
        };
        result = await handleUpdatePatient(updateData);
      } else {
        // Modo criação - usar CreatePatientData
        const createData: CreatePatientData = {
          name: formData.name,
          cpf: formData.cpf,
          date_birth: formData.date_birth,
          address: formData.address,
          phone: formData.phone,
        };
        result = await handleCreatePatient(createData);
      }

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particleElements.map((el, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8, 1], 
                opacity: [0, 0.8, 0.5, 0],
                y: [0, -50, -100]
              }}
              transition={{ 
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="absolute w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-600"
              style={{
                left: el.left,
                top: el.top,
              }}
            />
          ))}
        </div>

        <DialogHeader>
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 10 }}
              whileInView={{ rotate: 0 }}
              transition={{ 
                scale: { type: "spring", damping: 10, delay: 0.2 },
                rotate: { type: "spring", damping: 10, delay: 0.4 }
              }}
              className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 rounded-lg flex items-center justify-center shadow-md"
            >
              {mode === 'create' ? (
                <UserPlus className="w-5 h-5 text-white" />
              ) : (
                <Edit className="w-5 h-5 text-white" />
              )}
            </motion.div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {mode === 'create' ? 'Novo Paciente' : 'Editar Paciente'}
              </DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                {mode === 'create' 
                  ? 'Preencha os dados para cadastrar um novo paciente' 
                  : 'Atualize as informações do paciente'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Mensagens de feedback */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.6, 1] 
                  }}
                >
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                </motion.div>
                <AlertDescription className="text-emerald-800 dark:text-emerald-400 font-medium pl-5">
                  Paciente {mode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Alert variant="destructive">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <AlertCircle className="h-4 w-4" />
                </motion.div>
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2"
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <User className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Nome Completo *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Shield className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                CPF *
              </label>
              <Input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Data de Nascimento *
              </label>
              <Input
                type="date"
                name="date_birth"
                value={formData.date_birth}
                onChange={handleInputChange}
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Phone className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Telefone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="md:col-span-2"
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <MapPin className="inline w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                Endereço Completo *
              </label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                placeholder="Rua, número, bairro, cidade, CEP"
                required
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </motion.div>
          </div>

          <Separator className="dark:bg-slate-700" />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-end gap-3 pt-2"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-800"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Salvando...
                </>
              ) : success ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                  </motion.div>
                  Salvo com sucesso!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Cadastrar' : 'Salvar'}
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Elementos de segurança no rodapé */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-500 dark:text-slate-400 border-t dark:border-slate-700"
        >
          <Activity className="w-3 h-3" />
          <span>Dados protegidos e criptografados</span>
          <Shield className="w-3 h-3" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}