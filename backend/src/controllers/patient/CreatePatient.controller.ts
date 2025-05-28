import { Request, Response } from "express";
import { CreatePatientService } from '../../services/patient/CreatePatient.service';

class CreatePatientController {
    async handle(req: Request, res: Response) {
        try {
            const { 
                name, 
                cpf, 
                date_birth, 
                address, 
                phone
            } = req.body;

            // Converte a string de data para um objeto Date
            const parsedDateBirth = new Date(date_birth);

            if (isNaN(parsedDateBirth.getTime())) {
                return res.status(400).json({ error: 'Data de nascimento inválida' });
            }

            const createPatientService = new CreatePatientService();

            const patient = await createPatientService.execute({
                name,
                cpf,
                date_birth: parsedDateBirth,
                address,
                phone
            });

            return res.status(201).json(patient);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export { CreatePatientController };