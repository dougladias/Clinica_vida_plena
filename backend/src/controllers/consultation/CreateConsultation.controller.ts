import { Request, Response } from "express";
import { CreateConsultationService } from '../../services/consultation/CreateConsultation.service';

class CreateConsultationController {
  async handle(request: Request, response: Response) {
    try {
      const { 
        date, 
        time, 
        doctor_id, 
        patient_id 
      } = request.body;

      // Converte a string de data para um objeto Date
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return response.status(400).json({ error: 'Data inválida' });
      }

      const createConsultationService = new CreateConsultationService();

      const consultation = await createConsultationService.execute({
        date: parsedDate,
        time,
        doctor_id,
        patient_id
      });

      return response.status(201).json(consultation);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { CreateConsultationController };