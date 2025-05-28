import { Request, Response } from "express";
import { DeletePatientService } from '../../services/patient/DeletePatient.service';

class DeletePatientController {
    async handle(req: Request, res: Response) {
        try {
            // Extrai o id dos parâmetros da requisição
            const { id } = req.params;

            // Cria uma instância do serviço
            const deletePatientService = new DeletePatientService();

            // Executa a lógica de negócio
            const result = await deletePatientService.execute({ id });

            // Retorna a resposta com status 200
            return res.status(200).json(result);
        } catch (error: any) {
            // Trata os erros de forma apropriada
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            
            return res.status(500).json({ 
                error: 'Erro interno do servidor', 
                details: error.toString() 
            });
        }
    }
}

export { DeletePatientController };