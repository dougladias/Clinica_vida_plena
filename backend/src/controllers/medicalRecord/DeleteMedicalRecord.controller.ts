import { Request, Response } from "express";
import { DeleteMedicalRecordService } from '../../services/medicalRecord/DeleteMedicalRecord.service';

class DeleteMedicalRecordController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'ID do prontuário é obrigatório' });
      }

      const deleteMedicalRecordService = new DeleteMedicalRecordService();
      
      const medicalRecord = await deleteMedicalRecordService.execute(id);

      return response.json({
        message: "Prontuário excluído com sucesso",
        medicalRecord
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { DeleteMedicalRecordController };