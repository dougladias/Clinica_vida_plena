import { Request, Response } from 'express';
import { DeleteDoctorService } from '../../services/doctor/DeleteDoctor.service';

export class DeleteDoctorController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'ID do médico é obrigatório' });
      }

      const deleteDoctorService = new DeleteDoctorService();
      
      const doctor = await deleteDoctorService.execute(id);

      return response.json({
        message: "Médico excluído com sucesso",
        doctor
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}