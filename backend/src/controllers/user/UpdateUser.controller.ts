import { Request, Response } from "express";
import { UpdateUserService } from '../../services/user/UpdateUser.service';

class UpdateUserController {

    // Método para lidar com a requisição de atualização de usuário
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, password, role } = req.body;

            // Verifica se o ID foi fornecido
            const updateUserService = new UpdateUserService();

            // Se o ID não for fornecido, lança um erro
            const updatedUser = await updateUserService.execute({
                id,
                name,
                email,
                password,
                role
            });

            // Retorna o usuário atualizado
            return res.json(updatedUser);
        } catch (error) {

            // Se o erro for uma instância de Error, retorna a mensagem de erro
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }

            // Se ocorrer um erro inesperado, retorna um erro genérico
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export { UpdateUserController };