import { Request, Response } from "express";
import { DeleteConsultationService } from '../../services/consultation/DeleteConsultation.service';

class DeleteConsultationController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'ID da consulta é obrigatório' });
      }

      const deleteConsultationService = new DeleteConsultationService();
      
      const consultation = await deleteConsultationService.execute(id);

      return response.json({
        message: "Consulta excluída com sucesso",
        consultation
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { DeleteConsultationController };