import { Request, Response } from "express";
import { ListMedicalRecordsService } from '../../services/medicalRecord/ListMedicalRecords.service';


// É responsável por listar os prontuários médicos
class ListMedicalRecordsController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID da consulta dos parâmetros da requisição
      const { consultation_id } = request.query;

      // Verifica se o ID da consulta é um número válido
      const listMedicalRecordsService = new ListMedicalRecordsService();

      // Lista os prontuários médicos associados à consulta
      const medicalRecords = await listMedicalRecordsService.execute({
        consultation_id: consultation_id as string | undefined
      });

      // Se os prontuários forem encontrados, retorna a lista de prontuários
      return response.json(medicalRecords);
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

export { ListMedicalRecordsController };