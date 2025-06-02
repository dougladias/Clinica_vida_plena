// ====================================
// ARQUIVO: src/components/pages/consultation/ConsultationModal.tsx
// ====================================

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Save
} from 'lucide-react';

// Types para compatibilidade
type Doctor = {
  id: string;
  name: string;
  specialty: string;
}

type Patient = {
  id: string;
  name: string;
  cpf: string;
}

interface FormData {
  id: string;
  date: string;
  time: string;
  doctor_id: string;
  patient_id: string;
}

interface ConsultationModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalMode: 'create' | 'edit';
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  success: boolean;
  formError: string | null;
  doctors: Doctor[];
  patients: Patient[];
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  showModal,
  setShowModal,
  modalMode,
  formData,
  handleInputChange,
  handleSubmit,
  isLoading,
  success,
  formError,
  doctors,
  patients
}) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-500">
            {modalMode === 'create' ? 'Agendar Consulta' : 'Editar Consulta'}
          </DialogTitle>
          <DialogDescription>
            {modalMode === 'create' 
              ? 'Preencha os dados para agendar uma nova consulta'
              : 'Atualize os dados da consulta selecionada'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Data da Consulta
            </label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Horário
            </label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Médico
            </label>
            <select
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all appearance-none text-slate-800 dark:text-slate-200"
            >
              <option value="">Selecione um médico</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Paciente
            </label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all appearance-none text-slate-800 dark:text-slate-200"
            >
              <option value="">Selecione um paciente</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.cpf}
                </option>
              ))}
            </select>
          </div>

          {/* Mensagem de erro */}
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{formError}</p>
            </div>
          )}

          {/* Mensagem de sucesso */}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-300 text-sm">
                Consulta {modalMode === 'create' ? 'agendada' : 'atualizada'} com sucesso!
              </p>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || success}
              className={success ? "bg-green-600 hover:bg-green-700" : ""}
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
                  {modalMode === 'create' ? 'Agendar' : 'Atualizar'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};