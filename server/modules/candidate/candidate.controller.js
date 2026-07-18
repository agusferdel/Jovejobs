//import Mail from "nodemailer/lib/mailer";
//import sendEmail from "../../services/emailServices";
import { delFile } from "../../utils/delFile.js";
import candidateDal from "./candidate.dal.js"
import experienceDal from "./experience/experience.dal.js";
import languageDal from "./language/language.dal.js";
import studyDal from "./study/study.dal.js";

class CandidateController {

  editCandidate = async (req, res) => {
    try {
      const { user_id } = req;

      // Parseamos la data
      const parsedData = JSON.parse(req.body.data);
      
      const {  
          name, 
          lastname, 
          dni_cif,
          phone_number, 
          address,
          zip_code,
          avatar,
          cv,
          about_me,
          linkedin,
          location_pref,
          modality,
          city_id,
          province_id,
          fileType
      } = parsedData;

      let data = [
          name, 
          lastname, 
          dni_cif,
          phone_number, 
          address,
          zip_code,
          about_me,
          linkedin,
          location_pref,
          modality,
          city_id,
          province_id
        ];
      let avatarFilename = null;
      let cvFilename = null;
      
    // Buscamos archivos en req.files (si se subieron ambos) o req.file (si solo uno)
     // Lógica de detección de archivos POR NOMBRE DE CAMPO (fieldname)
      if (req.files && req.files.length > 0) {
        // Recorremos los archivos sin importar el orden en el que lleguen
        req.files.forEach((file) => {
            if (file.fieldname === 'avatar') {
                avatarFilename = file.filename;
            } else if (file.fieldname === 'cv') {
                cvFilename = file.filename;
            }
        });
        // Mantenemos este 'else if' por si en algún momento se usa req.file (un solo archivo)
      } else if (req.file) {
        if (req.file.fieldname === 'avatar') {
            avatarFilename = req.file.filename;
        } else if (req.file.fieldname === 'cv') {
            cvFilename = req.file.filename;
        }
      }

      await candidateDal.editCandidate(user_id, data, avatarFilename, cvFilename);

      res.status(200).json({ message: 'Update ok', avatar: avatarFilename, cv: cvFilename });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  updateSearching = async(req,res) => {
    try {
      const {user_id} = req;
      const {is_searching } = req.body;
      await candidateDal.updateSearching(user_id, is_searching);
      res.status(200).json({message:'Estado actualizado', is_searching});
    } catch (error) {
      res.status(500).json(error);
    }
  }

  updatePrivacy = async(req,res) => {
    try {
      const {user_id} = req;
      const {public_profile} = req.body;
      await candidateDal.updatePrivacy(user_id, public_profile);
      res.status(200).json({message:'Privacidad actualizada', public_profile});
    } catch (error) {
      res.status(500).json(error);
    }
  }

   deleteCv = async(req,res) => {
    try {
      const {user_id} = req;
      const {file} = req.body;
      
      await delFile(file, 'user');
      await candidateDal.deleteCv(user_id);
      res.status(200).json({ message: 'CV borrado correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  candidateById= async(req,res) => {
    try {
      const {candidate_id} = req.params;
      const user = await candidateDal.candidateById(candidate_id);
      if (!user) {
        return res.status(404).json({ message: 'Candidato no encontrado' });
      }
      const experience = await experienceDal.getExperience(candidate_id);
      const study = await studyDal.getStudies(candidate_id);
      const language = await languageDal.getLanguages(candidate_id);

      return res.status(200).json({user, experience, study, language });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  getAllCandidates = async(req,res) => {
    try {
      const result = await candidateDal.getAllCandidates();
      res.status(200).json({result});
    } catch (error) {
      res.status(500).json(error);
    }
  }

}

export default new CandidateController();
