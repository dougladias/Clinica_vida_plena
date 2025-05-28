import { Request, Response } from "express";
import { AddMedicationService } from '../../services/medication/AddMedication.service';

// É responsável por adicionar uma medicação a uma receita médica
class AddMedicationController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID da receita e os dados da medicação do corpo da requisição
      const { prescription_id } = request.params;
      const { name, dosage, instructions } = request.body;

      // Validações básicas
      if (!prescription_id) {
        return response.status(400).json({ error: 'ID da receita é obrigatório' });
      }

      // Verifica se os campos obrigatórios da medicação foram fornecidos
      if (!name || !dosage || !instructions) {
        return response.status(400).json({ error: 'Nome, dosagem e instruções são obrigatórios' });
      }

      // Cria uma instância do serviço de adição de medicação
      const addMedicationService = new AddMedicationService();

      // Tenta adicionar a medicação à receita com os dados fornecidos
      const result = await addMedicationService.execute({
        prescription_id,
        name,
        dosage,
        instructions
      });

      // Se a medicação for adicionada com sucesso, retorna o objeto da medicação
      return response.status(201).json(result);
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

export { AddMedicationController };