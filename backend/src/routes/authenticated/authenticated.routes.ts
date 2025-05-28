import { Router } from 'express';
import { AuthUserController } from '../../controllers/user/AuthUser.controller';
import { DetailUserController } from '../../controllers/user/DetailUser.controller';

const authRoutes = Router();

// Rota de login
authRoutes.post('/', new AuthUserController().handle);

// Rota para obter detalhes do usuário logado
authRoutes.get('/', new DetailUserController().handle);

export { authRoutes };