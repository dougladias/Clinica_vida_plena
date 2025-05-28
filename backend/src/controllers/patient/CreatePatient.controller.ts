import { Request, Response } from "express";
import { CreatePatientService } from '../../services/patient/CreatePatient.service';

// É responsável por criar um paciente
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

            // Verifica se a data de nascimento é válida
            if (isNaN(parsedDateBirth.getTime())) {
                return res.status(400).json({ error: 'Data de nascimento inválida' });
            }

            // Verifica se todos os campos obrigatórios foram fornecidos
            const createPatientService = new CreatePatientService();

            // Cria o paciente usando o serviço de criação
            const patient = await createPatientService.execute({
                name,
                cpf,
                date_birth: parsedDateBirth,
                address,
                phone
            });

            // Se o paciente for criado com sucesso, retorna o objeto do paciente
            return res.status(201).json(patient);
        } catch (error) {

            // Trata erros específicos e retorna mensagens apropriadas
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }

            // Se ocorrer um erro inesperado, retorna um erro genérico
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export { CreatePatientController };