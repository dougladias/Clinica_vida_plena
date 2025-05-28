import { Request, Response } from "express";
import { DeletePrescriptionService } from '../../services/prescription/DeletePrescription.service';

class DeletePrescriptionController {
  async handle(request: Request, response: Response) {

    // É responsável por excluir uma receita médica
    try {
      // Extrai o ID da receita médica dos parâmetros da requisição
      const { id } = request.params;

      // Verifica se o ID da receita médica foi fornecido
      if (!id) {
        return response.status(400).json({ error: 'ID da receita é obrigatório' });
      }

      // Verifica se o ID da receita médica é um número válido
      const deletePrescriptionService = new DeletePrescriptionService();
      
      // Tenta excluir a receita médica com o ID fornecido
      const prescription = await deletePrescriptionService.execute(id);

      // Se a receita médica for excluída com sucesso, retorna uma mensagem de sucesso
      return response.json({
        message: "Receita médica excluída com sucesso",
        prescription
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

export { DeletePrescriptionController };