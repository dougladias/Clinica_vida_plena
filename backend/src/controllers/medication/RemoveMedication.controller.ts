import { Request, Response } from "express";
import { RemoveMedicationService } from '../../services/medication/RemoveMedication.service';

class RemoveMedicationController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'ID do medicamento é obrigatório' });
      }

      const removeMedicationService = new RemoveMedicationService();
      
      const result = await removeMedicationService.execute(id);

      return response.json({
        message: "Medicamento removido com sucesso",
        ...result
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { RemoveMedicationController };