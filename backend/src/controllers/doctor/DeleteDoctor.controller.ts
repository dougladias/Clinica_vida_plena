import { Request, Response } from 'express';
import { DeleteDoctorService } from '../../services/doctor/DeleteDoctor.service';


// É responsável por excluir um médico
export class DeleteDoctorController {
  async handle(request: Request, response: Response) {
    try {

      // Extrai o ID do médico dos parâmetros da requisição
      const { id } = request.params;

      // Verifica se o ID do médico foi fornecido
      if (!id) {
        return response.status(400).json({ error: 'ID do médico é obrigatório' });
      }

      // Verifica se o ID do médico é um número válido
      const deleteDoctorService = new DeleteDoctorService();
      
      // Tenta excluir o médico com o ID fornecido
      const doctor = await deleteDoctorService.execute(id);

      // Se o médico for excluído com sucesso, retorna uma mensagem de sucesso
      return response.json({
        message: "Médico excluído com sucesso",
        doctor
      });      
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