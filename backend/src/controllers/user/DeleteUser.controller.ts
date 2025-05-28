import { Request, Response } from "express";
import { DeleteUserService } from '../../services/user/DeleteUser.service';


// Este arquivo é responsável por receber as requisições HTTP para deletar um usuário
class DeleteUserController {

    // Método para lidar com a requisição de deleção de usuário
    async handle(req: Request, res: Response) {
        try {
            // Extrai o ID do usuário a ser deletado dos parâmetros da requisição
            const { id } = req.params;

            // Verifica se o ID foi fornecido
            const deleteUserService = new DeleteUserService();

            // Se o ID não for fornecido, lança um erro
            const result = await deleteUserService.execute({
                id
            });

            // Retorna uma mensagem de sucesso e os dados do usuário deletado
            return res.json(result);
        } catch (error) {

            // Se o erro for uma instância de Error, retorna a mensagem de erro
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            // Caso contrário, retorna um erro genérico de servidor
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export { DeleteUserController };