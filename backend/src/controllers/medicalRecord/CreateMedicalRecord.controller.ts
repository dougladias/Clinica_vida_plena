import { Request, Response } from "express";
import { CreateMedicalRecordService } from '../../services/medicalRecord/CreateMedicalRecord.service';

// É responsável por criar um registro médico
class CreateMedicalRecordController {
  async handle(request: Request, response: Response) {

    // Tenta criar um novo registro médico com os dados fornecidos na requisição
    try {
      const { consultation_id, notes, diagnosis } = request.body;

      // Validações básicas
      if (!consultation_id || !notes || !diagnosis) {
        return response.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Verifica se o ID da consulta é válido
      const createMedicalRecordService = new CreateMedicalRecordService();

      // Cria o registro médico usando o serviço de criação
      const medicalRecord = await createMedicalRecordService.execute({
        consultation_id,
        notes,
        diagnosis
      });

      // Se o registro médico for criado com sucesso, retorna o objeto do registro
      return response.status(201).json(medicalRecord);
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

export { CreateMedicalRecordController };