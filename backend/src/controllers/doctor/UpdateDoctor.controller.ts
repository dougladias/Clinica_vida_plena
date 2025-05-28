import { Request, Response } from 'express';
import { UpdateDoctorService } from '../../services/doctor/UpdateDoctor.service';

export class UpdateDoctorController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name, crm, specialty, phone, email } = request.body;

      // Verificar se pelo menos um campo foi fornecido para atualização
      if (!name && !crm && !specialty && !phone && !email) {
        return response.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      const updateDoctorService = new UpdateDoctorService();
      
      const doctor = await updateDoctorService.execute({
        id,
        name,
        crm,
        specialty,
        phone,
        email
      });

      return response.json(doctor);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}