import { Request, Response } from 'express';
import { CreateDoctorService } from '../../services/doctor/CreateDoctor.service';

// É responsável por criar um novo médico
export class CreateDoctorController {
  async handle(request: Request, response: Response) {

    // Tenta criar um novo médico com os dados fornecidos na requisição
    try {
      const { name, crm, specialty, phone, email } = request.body;

      // Validações básicas
      if (!name || !crm || !specialty || !phone || !email) {
        return response.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Verifica se o CRM é válido (exemplo: deve conter apenas números)
      const createDoctorService = new CreateDoctorService();
      
      // Cria o médico usando o serviço de criação
      const doctor = await createDoctorService.execute({
        name,
        crm,
        specialty,
        phone,
        email
      });

      // Se o médico for criado com sucesso, retorna o objeto do médico
      return response.status(201).json(doctor);
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