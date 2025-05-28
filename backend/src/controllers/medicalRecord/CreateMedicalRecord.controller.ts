import { Request, Response } from "express";
import { CreateMedicalRecordService } from '../../services/medicalRecord/CreateMedicalRecord.service';

class CreateMedicalRecordController {
  async handle(request: Request, response: Response) {
    try {
      const { consultation_id, notes, diagnosis } = request.body;

      // Validações básicas
      if (!consultation_id || !notes || !diagnosis) {
        return response.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const createMedicalRecordService = new CreateMedicalRecordService();

      const medicalRecord = await createMedicalRecordService.execute({
        consultation_id,
        notes,
        diagnosis
      });

      return response.status(201).json(medicalRecord);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { CreateMedicalRecordController };