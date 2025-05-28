import { Request, Response } from "express";
import { DeletePrescriptionService } from '../../services/prescription/DeletePrescription.service';

class DeletePrescriptionController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'ID da receita é obrigatório' });
      }

      const deletePrescriptionService = new DeletePrescriptionService();
      
      const prescription = await deletePrescriptionService.execute(id);

      return response.json({
        message: "Receita médica excluída com sucesso",
        prescription
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { DeletePrescriptionController };