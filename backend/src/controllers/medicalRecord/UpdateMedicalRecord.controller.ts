import { Request, Response } from "express";
import { UpdateMedicalRecordService } from '../../services/medicalRecord/UpdateMedicalRecord.service';

class UpdateMedicalRecordController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { notes, diagnosis } = request.body;

      // Verificar se pelo menos um campo foi fornecido para atualização
      if (!notes && !diagnosis) {
        return response.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      const updateMedicalRecordService = new UpdateMedicalRecordService();

      const medicalRecord = await updateMedicalRecordService.execute({
        id,
        notes,
        diagnosis
      });

      return response.json(medicalRecord);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { UpdateMedicalRecordController };