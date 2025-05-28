import { Request, Response } from "express";
import { ListConsultationsService } from '../../services/consultation/ListConsultation.service';

class ListConsultationsController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai os parâmetros de consulta da requisição
      const { doctor_id, patient_id, date } = request.query;

      // Converter a data se fornecida
      let parsedDate: Date | undefined;
      if (date) {

        // Tenta converter a string de data para um objeto Date
        parsedDate = new Date(date as string);
        if (isNaN(parsedDate.getTime())) {
          return response.status(400).json({ error: 'Data inválida' });
        }
      }

      // Cria uma instância do serviço de listagem de consultas
      const listConsultationsService = new ListConsultationsService();

      // Chama o serviço para listar as consultas com os parâmetros fornecidos
      const consultations = await listConsultationsService.execute({
        doctor_id: doctor_id as string | undefined,
        patient_id: patient_id as string | undefined,
        date: parsedDate
      });

      // Retorna as consultas encontradas
      return response.json(consultations);
    } catch (error) {

      // Trata erros específicos e retorna mensagens apropriadas
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      // Se ocorrer um erro inesperado, retorna um erro genérico
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { ListConsultationsController };