import { Request, Response } from 'express';
import { CreateDoctorService } from '../../services/doctor/CreateDoctor.service';

export class CreateDoctorController {
  async handle(request: Request, response: Response) {
    try {
      const { name, crm, specialty, phone, email } = request.body;

      // Validações básicas
      if (!name || !crm || !specialty || !phone || !email) {
        return response.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const createDoctorService = new CreateDoctorService();
      
      const doctor = await createDoctorService.execute({
        name,
        crm,
        specialty,
        phone,
        email
      });

      return response.status(201).json(doctor);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}