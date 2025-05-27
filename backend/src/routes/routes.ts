import { Router, Request, Response } from 'express';
import { UserController} from '../controllers/user/user.controller';
import { PatientController } from '../controllers/patient/patient.controller';

// Importando o Router, Request e Response do Express
const router = Router();

// Rota de Usuário
router.post('/user', new UserController().handle);



// Rota de Paciente
router.post('/patient', new PatientController().handle);


export  {router};
