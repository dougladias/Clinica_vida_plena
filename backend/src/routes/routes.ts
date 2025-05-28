import { Router } from 'express';
import { userRoutes } from './user/user.routes';
import { authRoutes } from './authenticated/authenticated.routes';
import { patientRoutes } from './patient/patient.routes';
import { doctorRoutes } from './doctor/doctor.routes';
import { consultationRoutes } from './consultation/consultation.routes';
import { medicalRecordRoutes } from './medicalRecord/medicalRecord.routes';
import { prescriptionRoutes } from './prescription/prescription.routes';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = Router();

// Rotas Públicas
router.use('/session', authRoutes); 
router.use('/user', userRoutes);    

// Rotas Protegidas (com autenticação)
router.use('/me', isAuthenticated, authRoutes);          
router.use('/user-admin', isAuthenticated, userRoutes);  
router.use('/patient', isAuthenticated, patientRoutes);
router.use('/doctor', isAuthenticated, doctorRoutes);
router.use('/consultation', isAuthenticated, consultationRoutes);
router.use('/medicalRecord', isAuthenticated, medicalRecordRoutes);
router.use('/prescription', isAuthenticated, prescriptionRoutes);

export { router };