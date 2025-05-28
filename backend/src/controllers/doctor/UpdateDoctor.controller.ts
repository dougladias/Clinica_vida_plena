import { Request, Response } from 'express';
import { UpdateDoctorService } from '../../services/doctor/UpdateDoctor.service';


// É responsável por atualizar os dados de um médico
export class UpdateDoctorController {

  // Método handle é responsável por processar a requisição de atualização de médico
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID do médico dos parâmetros da requisição e os dados a serem atualizados do corpo da requisição
      const { id } = request.params;
      const { name, crm, specialty, phone, email } = request.body;

      // Verificar se pelo menos um campo foi fornecido para atualização
      if (!name && !crm && !specialty && !phone && !email) {
        return response.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      // Verifica se o ID do médico foi fornecido
      const updateDoctorService = new UpdateDoctorService();
      
      // Tenta atualizar o médico com os dados fornecidos
      const doctor = await updateDoctorService.execute({
        id,
        name,
        crm,
        specialty,
        phone,
        email
      });

      // Se o médico for atualizado com sucesso, retorna o objeto do médico atualizado
      return response.json(doctor);
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