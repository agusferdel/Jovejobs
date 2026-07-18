import express from 'express';
import companyController from './company.Controller.js';
import { uploadImage } from '../../middlewares/multerSingle.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// Obtener todas las empresas
router.get('/allCompanies', verifyToken, companyController.getAllCompanies);

// Obtener una empresa por su id
router.get('/adminGetCompany/:companyId', companyController.getCompanyById);

// Obtener una empresa solo con los datos públicos
router.get('/publicCompany/:company_id', companyController.getPublicCompany);

//buscar candidatos
router.post('/searchCandidates',verifyToken, companyController.searchCandidates); 

//editar empresas
router.put(
  '/editUser',
  verifyToken,
  uploadImage('user'),
  companyController.editCompany
);

export default router;
