import { Request, Response } from "express";
import { DeleteConsultationService } from '../../services/consultation/DeleteConsultation.service';


// É responsável por excluir uma consulta
class DeleteConsultationController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID da consulta dos parâmetros da requisição
      const { id } = request.params;

      // Verifica se o ID da consulta foi fornecido
      if (!id) {
        return response.status(400).json({ error: 'ID da consulta é obrigatório' });
      }

      // Verifica se o ID da consulta é um número válido
      const deleteConsultationService = new DeleteConsultationService();
      
      // Tenta excluir a consulta com o ID fornecido
      const consultation = await deleteConsultationService.execute(id);

      // Se a consulta for excluída com sucesso, retorna uma mensagem de sucesso
      return response.json({
        message: "Consulta excluída com sucesso",
        consultation
      });
      // Se a consulta não for encontrada, retorna um erro
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      // Se ocorrer um erro inesperado, retorna um erro genérico
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { DeleteConsultationController };