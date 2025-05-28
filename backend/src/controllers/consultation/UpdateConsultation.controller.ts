import { Request, Response } from "express";
import { UpdateConsultationService } from '../../services/consultation/UpdateConsultation.service';

class UpdateConsultationController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { 
        date, 
        time, 
        doctor_id, 
        patient_id 
      } = request.body;

      // Verificar se pelo menos um campo foi fornecido para atualização
      if (!date && !time && !doctor_id && !patient_id) {
        return response.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      // Converter a data se fornecida
      let parsedDate: Date | undefined;
      if (date) {
        parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return response.status(400).json({ error: 'Data inválida' });
        }
      }

      const updateConsultationService = new UpdateConsultationService();

      const consultation = await updateConsultationService.execute({
        id,
        date: parsedDate,
        time,
        doctor_id,
        patient_id
      });

      return response.json(consultation);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { UpdateConsultationController };