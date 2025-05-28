import { Router } from 'express';
import { CreateDoctorController } from '../../controllers/doctor/CreateDoctor.controller';
import { UpdateDoctorController } from '../../controllers/doctor/UpdateDoctor.controller';
import { DeleteDoctorController } from '../../controllers/doctor/DeleteDoctor.controller';

const doctorRoutes = Router();

// Rotas de Médico
doctorRoutes.post('/', new CreateDoctorController().handle);
doctorRoutes.put('/:id', new UpdateDoctorController().handle);
doctorRoutes.delete('/:id', new DeleteDoctorController().handle);


export { doctorRoutes };

