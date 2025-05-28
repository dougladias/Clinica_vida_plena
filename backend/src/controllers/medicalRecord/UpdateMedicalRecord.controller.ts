import { Request, Response } from "express";
import { UpdateMedicalRecordService } from '../../services/medicalRecord/UpdateMedicalRecord.service';

// É responsável por atualizar um prontuário médico
class UpdateMedicalRecordController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID do prontuário dos parâmetros da requisição
      const { id } = request.params;
      const { notes, diagnosis } = request.body;

      // Verificar se pelo menos um campo foi fornecido para atualização
      if (!notes && !diagnosis) {
        return response.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      // Verifica se o ID do prontuário foi fornecido
      const updateMedicalRecordService = new UpdateMedicalRecordService();

      // Tenta atualizar o prontuário com os dados fornecidos
      const medicalRecord = await updateMedicalRecordService.execute({
        id,
        notes,
        diagnosis
      });

      // Se o prontuário for atualizado com sucesso, retorna o objeto do prontuário atualizado
      return response.json(medicalRecord);
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

export { UpdateMedicalRecordController };