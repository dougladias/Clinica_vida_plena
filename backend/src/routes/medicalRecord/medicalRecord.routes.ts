import { Router } from 'express';
import { CreateMedicalRecordController } from '../../controllers/medicalRecord/CreateMedicalRecord.controller';
import { UpdateMedicalRecordController } from '../../controllers/medicalRecord/UpdateMedicalRecord.controller';
import { DeleteMedicalRecordController } from '../../controllers/medicalRecord/DeleteMedicalRecord.controller';
import { ListMedicalRecordsController } from '../../controllers/medicalRecord/ListMedicalRecords.controller';

const medicalRecordRoutes = Router();

// Rotas de Prontuários
medicalRecordRoutes.get('/', new ListMedicalRecordsController().handle);
medicalRecordRoutes.post('/', new CreateMedicalRecordController().handle);
medicalRecordRoutes.put('/:id', new UpdateMedicalRecordController().handle);
medicalRecordRoutes.delete('/:id', new DeleteMedicalRecordController().handle);

export { medicalRecordRoutes };