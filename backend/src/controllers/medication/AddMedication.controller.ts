import { Request, Response } from "express";
import { AddMedicationService } from '../../services/medication/AddMedication.service';

class AddMedicationController {
  async handle(request: Request, response: Response) {
    try {
      const { prescription_id } = request.params;
      const { name, dosage, instructions } = request.body;

      // Validações básicas
      if (!prescription_id) {
        return response.status(400).json({ error: 'ID da receita é obrigatório' });
      }

      if (!name || !dosage || !instructions) {
        return response.status(400).json({ error: 'Nome, dosagem e instruções são obrigatórios' });
      }

      const addMedicationService = new AddMedicationService();

      const result = await addMedicationService.execute({
        prescription_id,
        name,
        dosage,
        instructions
      });

      return response.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { AddMedicationController };