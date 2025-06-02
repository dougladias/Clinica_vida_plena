import { Router } from 'express';
import { CreatePrescriptionController } from '../../controllers/prescription/CreatePrescription.controller';
import { ListPrescriptionsController } from '../../controllers/prescription/ListPrescriptions.controller';
import { DeletePrescriptionController } from '../../controllers/prescription/DeletePrescription.controller';
import { AddMedicationController } from '../../controllers/prescription/AddMedication.controller';
import { RemoveMedicationController } from '../../controllers/prescription/RemoveMedication.controller';

const prescriptionRoutes = Router();
const listPrescriptionsController = new ListPrescriptionsController();

// Rotas de Receitas Médicas
prescriptionRoutes.post('/', new CreatePrescriptionController().handle);
prescriptionRoutes.get('/', listPrescriptionsController.handle);
prescriptionRoutes.get('/:id', listPrescriptionsController.handleById);
prescriptionRoutes.delete('/:id', new DeletePrescriptionController().handle);

// Rotas para medicamentos
prescriptionRoutes.post('/:prescription_id/medications', new AddMedicationController().handle);
prescriptionRoutes.delete('/medications/:id', new RemoveMedicationController().handle);

export { prescriptionRoutes };