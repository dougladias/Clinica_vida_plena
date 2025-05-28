import { Router } from 'express';
import { CreatePatientController } from '../../controllers/patient/CreatePatient.controller';
import { UpdatePatientController } from '../../controllers/patient/UpdatePatient.controller';
import { DeletePatientController } from '../../controllers/patient/DeletePatient.controller';

const patientRoutes = Router();

// Rotas de Paciente
patientRoutes.post('/', new CreatePatientController().handle);
patientRoutes.put('/:id', new UpdatePatientController().handle);
patientRoutes.delete('/:id', new DeletePatientController().handle); 

export { patientRoutes };