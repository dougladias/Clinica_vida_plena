import { Router } from 'express';
import { CreateUserController } from '../../controllers/user/CreateUser.controller';
import { UpdateUserController } from '../../controllers/user/UpdateUser.controller';
import { DeleteUserController } from '../../controllers/user/DeleteUser.controller';


const userRoutes = Router();

// Rotas de Usuário
userRoutes.post('/', new CreateUserController().handle);
userRoutes.put('/:id', new UpdateUserController().handle);
userRoutes.delete('/:id', new DeleteUserController().handle);

export { userRoutes };