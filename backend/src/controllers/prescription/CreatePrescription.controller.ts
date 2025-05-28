import { Request, Response } from "express";
import { CreatePrescriptionService } from '../../services/prescription/CreatePrescription.service';

class CreatePrescriptionController {
  async handle(request: Request, response: Response) {
    try {
      const { consultation_id, medications } = request.body;

      // Validações básicas
      if (!consultation_id) {
        return response.status(400).json({ error: 'ID da consulta é obrigatório' });
      }

      // Verificar se medicamentos é um array e não está vazio
      if (!medications || !Array.isArray(medications) || medications.length === 0) {
        return response.status(400).json({ error: 'Pelo menos um medicamento deve ser informado' });
      }

      // Validar cada medicamento
      for (const med of medications) {
        if (!med.name || !med.dosage || !med.instructions) {
          return response.status(400).json({ 
            error: 'Cada medicamento deve ter nome, dosagem e instruções' 
          });
        }
      }

      const createPrescriptionService = new CreatePrescriptionService();

      const prescription = await createPrescriptionService.execute({
        consultation_id,
        medications
      });

      return response.status(201).json(prescription);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { CreatePrescriptionController };