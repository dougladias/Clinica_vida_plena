import { Request, Response } from "express";
import { UpdatePatientService } from '../../services/patient/UpdatePatient.service';

class UpdatePatientController {
    async handle(req: Request, res: Response) {
        try {
            // Extrai o ID do paciente dos parâmetros da URL
            const { id } = req.params;
            
            // Extrai os dados do corpo da requisição
            const { name, cpf, date_birth, address, phone } = req.body;

            // Converte a string de data para um objeto Date, se fornecida
            let parsedDateBirth = undefined;
            
            if (date_birth) {
                parsedDateBirth = new Date(date_birth);
                if (isNaN(parsedDateBirth.getTime())) {
                    return res.status(400).json({ error: 'Data de nascimento inválida' });
                }
            }

            // Cria uma instância do serviço
            const updatePatientService = new UpdatePatientService();

            // Chama o método execute do serviço
            const updatedPatient = await updatePatientService.execute({
                id,
                name,
                cpf,
                date_birth: parsedDateBirth,
                address,
                phone
            });

            // Retorna o paciente atualizado
            return res.json(updatedPatient);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export { UpdatePatientController };