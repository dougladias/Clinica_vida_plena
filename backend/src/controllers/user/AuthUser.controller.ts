import {Request, Response} from 'express';
import { AuthUserService } from '../../services/user/AuthUser.service';

// É responsável por autenticar um usuário
class AuthUserController {

    // Método handle é responsável por receber a requisição e retornar a resposta
    async handle(request: Request, response: Response) {
        const {email, password} = request.body;

        // Verifica se o email e a senha foram fornecidos
        const authUserService = new AuthUserService();
        
        // Tenta autenticar o usuário com o email e a senha fornecidos
        const auth = await authUserService.execute({
            email,
            password
        })

        // Se a autenticação for bem-sucedida, retorna o objeto de autenticação
        return response.json(auth);
 }
}

export { AuthUserController };