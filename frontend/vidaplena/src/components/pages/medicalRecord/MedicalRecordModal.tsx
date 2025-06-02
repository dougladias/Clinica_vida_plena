import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Save 
} from 'lucide-react';
import { MedicalRecord } from '@/types/medicalRecord.type';
import { Consultation } from '@/types/consultation.type';
import { Patient } from '@/types/patient.type';
import { Doctor } from '@/types/doctor.type';

interface FormData {
  consultation_id: string;
  diagnosis: string;
  notes: string;
}

interface MedicalRecordModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalMode: 'create' | 'edit' | 'view';
  selectedRecord: MedicalRecord | null;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmitModal: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  success: boolean;
  error: string | null;
  closeModal: () => void;
  consultations: Consultation[];
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
  getConsultationById: (id: string) => Consultation | undefined;
}

export const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  showModal,
  setShowModal,
  modalMode,
  selectedRecord,
  formData,
  handleInputChange,
  handleSubmitModal,
  isLoading,
  success,
  error,
  closeModal,
  consultations,
  getDoctorById,
  getPatientById,
  getConsultationById
}) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            {modalMode === 'create' ? 'Novo Prontuário' : modalMode === 'edit' ? 'Editar Prontuário' : 'Visualizar Prontuário'}
          </DialogTitle>
          <DialogDescription>
            {modalMode === 'create'
              ? 'Preencha os dados para criar um novo prontuário'
              : modalMode === 'edit'
                ? 'Atualize os dados do prontuário selecionado'
                : 'Detalhes do prontuário'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={modalMode !== 'view' ? handleSubmitModal : undefined} className="space-y-4">
          {modalMode === 'view' ? (
            // Modo visualização
            <>
              {/* Informações do paciente e médico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Paciente</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {selectedRecord?.consultation?.patient?.name ||
                      (selectedRecord?.consultation_id &&
                        getConsultationById(selectedRecord.consultation_id)?.patient?.id &&
                        getPatientById(getConsultationById(selectedRecord.consultation_id)?.patient?.id || '')?.name) ||
                      'Não encontrado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Médico</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {selectedRecord?.consultation?.doctor?.name ||
                      (selectedRecord?.consultation_id &&
                        getConsultationById(selectedRecord.consultation_id)?.doctor_id &&
                        getDoctorById(getConsultationById(selectedRecord.consultation_id)?.doctor_id || '')?.name) ||
                      'Não encontrado'}
                  </p>
                </div>
              </div>

              {/* Data da consulta */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Data da Consulta</label>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {selectedRecord?.consultation?.date
                    ? new Date(selectedRecord.consultation.date).toLocaleDateString('pt-BR')
                    : selectedRecord?.consultation_id
                      ? getConsultationById(selectedRecord.consultation_id)?.date
                        ? new Date(getConsultationById(selectedRecord.consultation_id)!.date).toLocaleDateString('pt-BR')
                        : 'N/A'
                      : 'N/A'}
                  às {selectedRecord?.consultation?.time ||
                    (selectedRecord?.consultation_id ?
                      getConsultationById(selectedRecord?.consultation_id)?.time || 'N/A'
                      : 'N/A')}
                </p>
              </div>

              {/* Diagnóstico */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Diagnóstico</label>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedRecord?.diagnosis || 'Sem diagnóstico registrado'}</p>
                </div>
              </div>

              {/* Anotações */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Anotações da Consulta</label>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedRecord?.notes || 'Sem anotações registradas'}</p>
                </div>
              </div>

              {/* Metadados */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Criado em</label>
                  <p className="text-slate-800 dark:text-slate-200">
                    {selectedRecord && selectedRecord.created_at ?
                      new Date(selectedRecord.created_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Última atualização</label>
                  <p className="text-slate-800 dark:text-slate-200">
                    {selectedRecord && selectedRecord.updated_at ?
                      new Date(selectedRecord.updated_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Botões de ação para visualização */}
              <div className="flex items-center space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Fechar
                </Button>                
              </div>
            </>
          ) : (
            // Modo criação/edição
            <>
              {/* Seleção de consulta */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Consulta *</label>
                <select
                  name="consultation_id"
                  value={formData.consultation_id}
                  onChange={handleInputChange}
                  required
                  disabled={modalMode === 'edit'}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:bg-slate-100 dark:disabled:bg-slate-900 text-slate-900 dark:text-slate-200"
                >
                  <option value="">Selecione uma consulta</option>
                  {consultations.map(consultation => {
                    const doctorId = consultation.doctor_id || (consultation.doctor?.id || '');
                    const patientId = consultation.patient?.id || '';
                    const doctor = consultation.doctor || getDoctorById(doctorId);
                    const patient = consultation.patient || getPatientById(patientId);
                    return (
                      <option key={consultation.id} value={consultation.id}>
                        {patient?.name || 'Paciente'} - {doctor?.name || 'Médico'} ({consultation.date} - {consultation.time})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Diagnóstico */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Diagnóstico *</label>
                <Input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Ex: Gripe comum, Hipertensão arterial..."
                  required
                />
              </div>

              {/* Anotações */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Anotações da Consulta *</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Descreva os sintomas, exames realizados, tratamento recomendado..."
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-vertical text-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Mensagem de sucesso */}
              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Prontuário {modalMode === 'create' ? 'criado' : 'atualizado'} com sucesso!
                  </p>
                </div>
              )}

              {/* Botões de ação para criação/edição */}
              <div className="flex items-center space-x-3 pt-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || success}
                  className={`flex items-center space-x-2 ${success
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Salvo com sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{modalMode === 'create' ? 'Criar Prontuário' : 'Atualizar Prontuário'}</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};