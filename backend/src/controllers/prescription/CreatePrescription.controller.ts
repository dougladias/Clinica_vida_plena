import { Request, Response } from "express";
import { CreatePrescriptionService } from '../../services/prescription/CreatePrescription.service';

class CreatePrescriptionController {
  async handle(request: Request, response: Response) {

    // Método responsável por criar uma prescrição médica
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

      // Cria uma instância do serviço de criação de prescrição
      const createPrescriptionService = new CreatePrescriptionService();

      // Tenta criar a prescrição com os dados fornecidos
      const prescription = await createPrescriptionService.execute({
        consultation_id,
        medications
      });
      
      // Se a prescrição for criada com sucesso, retorna o objeto da prescrição
      return response.status(201).json(prescription);
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

export { CreatePrescriptionController };