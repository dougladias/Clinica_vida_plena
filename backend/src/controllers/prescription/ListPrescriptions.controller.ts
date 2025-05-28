import { Request, Response } from "express";
import { ListPrescriptionsService } from '../../services/prescription/ListPrescriptions.service';

// É responsável por listar as receitas médicas
class ListPrescriptionsController {
  // Extrai o ID da consulta dos parâmetros da requisição
  async handle(request: Request, response: Response) {
    try {
      // Verifica se o ID da consulta é um número válido
      const { consultation_id } = request.query;

      // Cria uma instância do serviço de listagem de receitas médicas
      const listPrescriptionsService = new ListPrescriptionsService();

      // Lista as receitas médicas associadas à consulta
      const prescriptions = await listPrescriptionsService.execute({
        consultation_id: consultation_id as string | undefined
      });

      // Se as receitas forem encontradas, retorna a lista de receitas
      return response.json(prescriptions);
    } catch (error) {

      // Trata erros específicos e retorna mensagens apropriadas
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }

      // Se ocorrer um erro inesperado, retorna um erro genérico
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para buscar uma receita médica por ID
  async handleById(request: Request, response: Response) {
    try {
      // Extrai o ID da receita médica dos parâmetros da requisição
      const { id } = request.params;

      // Verifica se o ID da receita médica foi fornecido
      if (!id) {
        return response.status(400).json({ error: 'ID da receita é obrigatório' });
      }

      // Verifica se o ID da receita médica é um número válido
      const listPrescriptionsService = new ListPrescriptionsService();
      
      // Tenta buscar a receita médica com o ID fornecido
      const prescription = await listPrescriptionsService.findById(id);

      // Se a receita médica for encontrada, retorna a receita
      return response.json(prescription);
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

export { ListPrescriptionsController };