import { Request, Response } from 'express';
import { ListPatientService } from '../../services/patient/ListPatient.service';


// Controlador para listar pacientes
class ListPatientController {
  async handle(request: Request, response: Response) {
    try {
      // Pega possíveis filtros da requisição
      const { name, cpf } = request.query;
      
      // Instancia o serviço
      const listPatientService = new ListPatientService();
      
      // Executa o serviço passando os filtros opcionais
      const patients = await listPatientService.execute({ 
        name: name as string,
        cpf: cpf as string
      });
      
      // Retorna a lista de pacientes
      return response.json(patients);
    } catch (error) {
      console.error('Erro ao listar pacientes:', error);
      
      // Se for um erro conhecido, retorna a mensagem específica
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      
      // Caso contrário, retorna erro genérico
      return response.status(500).json({ error: 'Erro interno ao listar pacientes' });
    }
  }
}

export { ListPatientController };