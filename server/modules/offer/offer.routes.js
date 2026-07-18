import express from 'express';
import offerController from './offer.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// Ruta pública
router.get('/', offerController.getAllOffers);
router.get('/top3', offerController.getAllOffersTop3);
router.get('/getOfferByUserId/:id', offerController.getOffersByUserId);
router.get('/jobs', offerController.getJobs);

//ruta Admin
router.get('/allOffers', verifyToken, offerController.getAllOffersAdmin);
router.put(
  '/:offer_id/:company_id/activate',
  verifyToken,
  offerController.activateOffer
);

// Ruta privada de candidaturas
router.get(
  '/candidateApplications',
  verifyToken,
  offerController.getCandidateApplications
);

router.get(
  '/adminCandidateApplications/:candidate_id',
  verifyToken,
  offerController.getCandidateApplications
);

//traer candidaturas de oferta (empresa)
router.get(
  '/offerApplications/:offer_id',
  verifyToken,
  offerController.getOfferApplications
);

//cambiar estado de candidatura
router.put(
  '/offerApplications/status/:offer_id/:candidate_id',
  verifyToken,
  offerController.changeStatus
);

//traer candidaturas de oferta (admin)
router.get(
  '/offerApplications/:company_id/:offer_id',
  verifyToken,
  offerController.getOfferApplications
);

router.put(
  '/offerApplications/contact/:offer_id/:candidate_id',
  verifyToken,
  offerController.updateContactedStatus
);

router.delete(
  '/delApplication/:offer_id',
  verifyToken,
  offerController.deleteApplication
);

//ruta nueva oferta
router.post('/newOffer', verifyToken, offerController.newOffer);
router.get('/searchOffers', offerController.searchOffers);

// Editar una oferta existente por ID
router.put('/edit/:id', verifyToken, offerController.editOffer);

//Editar una oferta (admin)
router.put('/edit/:id/:userId', verifyToken,offerController.editOffer);

//obtener una oferta por user_id
router.get('/offersCompany/:id', offerController.getOffersByUserId);

// Obtener una oferta por ID
router.get('/:id', offerController.getOfferById);
// Aplicar a una oferta
router.post('/:id/apply', verifyToken, offerController.applyToOffer);

// Desactivar oferta
router.put(
  '/:offer_id/deactivate',
  verifyToken,
  offerController.deactivateOffer
);
// Desactivar oferta admin
router.put(
  '/:offer_id/:company_id/deactivate',
  verifyToken,
  offerController.deactivateOffer
);

//Activar oferta admin
router.put(
  '/:offer_id/:company_id/activate',
  verifyToken,
  offerController.activateOffer
);

// Ver si ha aplicado a una oferta (/:id/is-applied)
router.get('/:id/is-applied', verifyToken, offerController.checkApplication);

export default router;
