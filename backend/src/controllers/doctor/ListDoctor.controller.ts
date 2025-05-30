import { Request, Response } from 'express';
import { ListDoctorService } from '../../services/doctor/ListDoctor.service';

// Controller responsável por listar médicos
export class ListDoctorController {
  async handle(request: Request, response: Response) {
    try {
      // Extrai os parâmetros de consulta da requisição
      const { name, specialty, crm } = request.query;

      // Cria uma instância do serviço de listagem de médicos
      const listDoctorService = new ListDoctorService();

      // Lista os médicos com os filtros aplicados
      const doctors = await listDoctorService.execute({
        name: name as string | undefined,
        specialty: specialty as string | undefined,
        crm: crm as string | undefined
      });

      // Retorna a lista de médicos
      return response.json(doctors);
    } catch (error) {
      // Trata erros específicos e retorna mensagens apropriadas
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }

      // Se ocorrer um erro inesperado, retorna um erro genérico
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Método para buscar estatísticas dos médicos
  async handleStats(request: Request, response: Response) {
    try {
      // Cria uma instância do serviço
      const listDoctorService = new ListDoctorService();
      
      // Busca as estatísticas
      const stats = await listDoctorService.getStats();
      
      // Retorna as estatísticas
      return response.json(stats);
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