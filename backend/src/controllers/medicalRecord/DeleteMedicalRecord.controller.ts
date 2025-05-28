import { Request, Response } from "express";
import { DeleteMedicalRecordService } from '../../services/medicalRecord/DeleteMedicalRecord.service';


// É responsável por excluir um prontuário médico
class DeleteMedicalRecordController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID do prontuário dos parâmetros da requisição
      const { id } = request.params;

      // Verifica se o ID do prontuário foi fornecido
      if (!id) {
        return response.status(400).json({ error: 'ID do prontuário é obrigatório' });
      }

      // Verifica se o ID do prontuário é um número válido
      const deleteMedicalRecordService = new DeleteMedicalRecordService();
      
      // Tenta excluir o prontuário com o ID fornecido
      const medicalRecord = await deleteMedicalRecordService.execute(id);

      // Se o prontuário for excluído com sucesso, retorna uma mensagem de sucesso
      return response.json({
        message: "Prontuário excluído com sucesso",
        medicalRecord
      });
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

export { DeleteMedicalRecordController };