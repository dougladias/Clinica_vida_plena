import {Request, Response } from 'express';
import { DetailUserService } from '../../services/user/DetailUser.service';

class DetailUserController {
    async handle(request: Request, response: Response) {
        
        // O middleware isAuthenticated já garantiu que o usuário está autenticado
        const user_id = request.user_id;

        // Cria uma instância do serviço de detalhes do usuário
        const detailUserService = new DetailUserService();

        // Chama o serviço para obter os detalhes do usuário
        const user = await detailUserService.execute(user_id);

        return response.json(user);
    }
}

export { DetailUserController };