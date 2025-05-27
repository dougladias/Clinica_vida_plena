import { Request, Response } from "express";
import { userService } from '../../services/user/user.service';

class UserController {
    async handle(req: Request, res: Response){
       const { name, email, password } = req.body;

       const userServiceInstance = new userService();

       const user = await userServiceInstance.execute({
        name,
        email,
        password
       });

       return res.json(user);
    }
}

export { UserController };