import { Router } from 'express';
import { CreateConsultationController } from '../../controllers/consultation/CreateConsultation.controller';
import { UpdateConsultationController } from '../../controllers/consultation/UpdateConsultation.controller';
import { DeleteConsultationController } from '../../controllers/consultation/DeleteConsultation.controller';
import { ListConsultationsController } from '../../controllers/consultation/ListConsultation.controller';

const consultationRoutes = Router();

// Rotas de Consultas
consultationRoutes.get('/', new ListConsultationsController().handle);
consultationRoutes.post('/', new CreateConsultationController().handle);
consultationRoutes.put('/:id', new UpdateConsultationController().handle);
consultationRoutes.delete('/:id', new DeleteConsultationController().handle);


export { consultationRoutes };