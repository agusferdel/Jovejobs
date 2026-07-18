import jobDal from '../admin/Job/job.dal.js';
import usersDal from '../users/users.dal.js';
import authDal from '../auth/auth.dal.js';
import offerDal from './offer.dal.js';

class OfferController {
  //obtener todas las ofertas
  getAllOffers = async (req, res) => {
    try {
        const result = await offerDal.getAllOffers();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getAllOffersTop3 = async (req, res) => {
    try {
        const result = await offerDal.getAllOffersTop3();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getAllOffersAdmin = async (req, res) => {
    try {
        const result = await offerDal.getAllOffersAdmin();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  // obtener oferta segun user id
  getOffersByUserId = async (req, res) => {
    try {
      // Captura el id de la empresa se
      const user_id = req.params.id;
      if (!user_id) {
        return res.status(400).json({ message: 'ID del usuario no válido' });
      }

      const result = await offerDal.getOffersByUserId(user_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  //obtener los datos de una oferta específica
  getOfferById = async (req, res) => {
    try {
      const { id } = req.params; // Sacamos el ID de la oferta de la URL
      const result = await offerDal.getOfferById(id);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Oferta no encontrada' });
      }

      // Devolvemos el primer (y único) resultado del array
      res.status(200).json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  // Editar los datos de una oferta específica
  editOffer = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.params.userId || req.user_id; // Viene del verifyToken
      const offerData = req.body; // Los datos del formulario

      const result = await offerDal.editOffer(id, userId, offerData);

      // Si affectedRows es 0, significa que la oferta no existe o no le pertenece a este usuario
      if (result.affectedRows === 0) {
        return res.status(403).json({ message: 'No tienes permiso para editar esta oferta o no existe.' });
      }

      res.status(200).json({ message: 'Oferta actualizada correctamente' });
    } catch (error) {
      console.error("Error al editar la oferta:", error);
      res.status(500).json(error);
    }
  };

  //obtener las ofertas de un solo candidato
  getCandidateApplications = async (req, res) => {
    try {
      const user_id = req.params.candidate_id || req.user_id;
      const result = await offerDal.getCandidateApplications(user_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  //obtener las ofertas de una oferta
  getOfferApplications = async (req, res) => {
    try {
      const { offer_id, company_id } = req.params;
      const user_id = company_id || req.user_id;
      const result = await offerDal.getOfferApplications(user_id, offer_id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  updateContactedStatus = async (req, res) => {
    try {
      const { offer_id, candidate_id } = req.params;
      const { is_contacted } = req.body;
      await offerDal.updateContactedStatus(
        offer_id,
        candidate_id,
        is_contacted
      );
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  deleteApplication = async (req, res) => {
    try {
      const { user_id } = req;
      const { offer_id } = req.params;
      await offerDal.deleteApplication(user_id, offer_id);
      res.status(200).json({ message: 'Candidatura borrada' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  newOffer = async (req, res) => {
    try {
      const { user_id } = req;
      
      // 1. Verificar en base de datos si tiene ofertas disponibles
      const userData = await authDal.userById(user_id);
      if (!userData.length || userData[0].offers_left <= 0) {
        return res.status(403).json({ message: 'No tienes ofertas disponibles en tu cuenta.' });
      }

      const data = req.body;
      
      const result = await offerDal.newOffer(user_id, data);

      const updateUser = await usersDal.substracOffer(user_id);

      res.status(200).json({ result, user: updateUser });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getJobs = async (req, res) => {
    try {
      const result = await jobDal.getAllJobs();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  searchOffers = async (req, res) => {
    try {
      const data = req.query;
      const result = await offerDal.searchOffers(data);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  applyToOffer = async (req, res) => {
    try {
      const { id } = req.params; // ID de la oferta
      const { user_id } = req; // ID del usuario (viene del token)
      await offerDal.applyToOffer(user_id, id);
      res.status(200).json({ message: 'Inscripción realizada con éxito' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deactivateOffer = async (req, res) => {
    try {
      const { offer_id, company_id } = req.params;
      const user_id = company_id || req.user_id;
      await offerDal.deactivateOffer(offer_id, user_id);
      res.status(200).json({ message: "Oferta eliminada correctamente" });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  activateOffer = async (req,res) => {
    try {
      const { offer_id, company_id } = req.params;
      await offerDal.activateOffer(offer_id, company_id);
      res.status(200).json({ message: "Oferta activada correctamente" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
    
  checkApplication = async (req, res) => {
    try {
      const { id } = req.params; // ID de la oferta

      // El verifyToken deja el id del usuario aquí
      const userId = req.user_id;

      // Llamamos al DAL para que haga la consulta
      const isApplied = await offerDal.checkApplication(userId, id);

      // Devolvemos el resultado al frontend ({ isApplied: true } o { isApplied: false })
      res.status(200).json({ isApplied });
    } catch (error) {
      console.error('Error en checkApplication controller:', error);
      res.status(500).json({
        message: 'Error al verificar el estado de la inscripción',
        error,
      });
    }
  };

  changeStatus = async (req,res) => {
    try {
      const {offer_id, candidate_id} = req.params;
      const {status} = req.body;
      
      await offerDal.changeStatus(offer_id, candidate_id, status);
      res.status(200).json({message: "Estado cambiado correctamente"});
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

export default new OfferController();
