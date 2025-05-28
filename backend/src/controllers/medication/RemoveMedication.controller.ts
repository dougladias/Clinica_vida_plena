import { Request, Response } from "express";
import { RemoveMedicationService } from '../../services/medication/RemoveMedication.service';

// É responsável por remover um medicamento de uma receita médica
class RemoveMedicationController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID do medicamento dos parâmetros da requisição
      const { id } = request.params;

      // Verifica se o ID do medicamento foi fornecido
      if (!id) {
        return response.status(400).json({ error: 'ID do medicamento é obrigatório' });
      }

      // Verifica se o ID do medicamento é um número válido
      const removeMedicationService = new RemoveMedicationService();
      
      // Tenta remover o medicamento com o ID fornecido
      const result = await removeMedicationService.execute(id);

      // Se o medicamento for removido com sucesso, retorna uma mensagem de sucesso
      return response.json({
        message: "Medicamento removido com sucesso",
        ...result
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

export { RemoveMedicationController };