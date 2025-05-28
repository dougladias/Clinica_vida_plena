import { Request, Response } from "express";
import { ListMedicalRecordsService } from '../../services/medicalRecord/ListMedicalRecords.service';

class ListMedicalRecordsController {
  async handle(request: Request, response: Response) {
    try {
      const { consultation_id } = request.query;

      const listMedicalRecordsService = new ListMedicalRecordsService();

      const medicalRecords = await listMedicalRecordsService.execute({
        consultation_id: consultation_id as string | undefined
      });

      return response.json(medicalRecords);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { ListMedicalRecordsController };