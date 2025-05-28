import { Request, Response } from "express";
import { CreateUserService } from '../../services/user/CreateUser.service';


// Este arquivo é responsável por receber as requisições HTTP para criar um usuário
class CreateUserController {
    async handle(req: Request, res: Response){
       const { name, email, password, role } = req.body;

       // Verifica se todos os campos necessários foram preenchidos
       const userServiceInstance = new CreateUserService();

       // Se algum campo estiver faltando, lança um erro
       const user = await userServiceInstance.execute({
        name,
        email,
        password,
        role,
       });

       return res.json(user);
    }
}

export { CreateUserController };