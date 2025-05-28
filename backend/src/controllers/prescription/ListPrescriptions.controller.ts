import { Request, Response } from "express";
import { ListPrescriptionsService } from '../../services/prescription/ListPrescriptions.service';

class ListPrescriptionsController {
  async handle(request: Request, response: Response) {
    try {
      const { consultation_id } = request.query;

      const listPrescriptionsService = new ListPrescriptionsService();

      const prescriptions = await listPrescriptionsService.execute({
        consultation_id: consultation_id as string | undefined
      });

      return response.json(prescriptions);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async handleById(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'ID da receita é obrigatório' });
      }

      const listPrescriptionsService = new ListPrescriptionsService();
      
      const prescription = await listPrescriptionsService.findById(id);

      return response.json(prescription);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { ListPrescriptionsController };