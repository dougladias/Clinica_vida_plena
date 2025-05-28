import { Request, Response } from "express";
import { ListConsultationsService } from '../../services/consultation/ListConsultation.service';

class ListConsultationsController {
  async handle(request: Request, response: Response) {
    try {
      const { doctor_id, patient_id, date } = request.query;

      // Converter a data se fornecida
      let parsedDate: Date | undefined;
      if (date) {
        parsedDate = new Date(date as string);
        if (isNaN(parsedDate.getTime())) {
          return response.status(400).json({ error: 'Data inválida' });
        }
      }

      const listConsultationsService = new ListConsultationsService();

      const consultations = await listConsultationsService.execute({
        doctor_id: doctor_id as string | undefined,
        patient_id: patient_id as string | undefined,
        date: parsedDate
      });

      return response.json(consultations);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { ListConsultationsController };