import { Request, Response } from "express";
import { CreateConsultationService } from '../../services/consultation/CreateConsultation.service';


// É responsável por criar uma consulta
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

      // Verifica se a data é válida
      if (isNaN(parsedDate.getTime())) {
        return response.status(400).json({ error: 'Data inválida' });
      }

      // Verifica se o horário é válido
      const createConsultationService = new CreateConsultationService();

      // Verifica se o médico existe
      const consultation = await createConsultationService.execute({
        date: parsedDate,
        time,
        doctor_id,
        patient_id
      });

      // Se a consulta for criada com sucesso, retorna o objeto da consulta
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