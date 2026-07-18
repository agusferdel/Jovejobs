import studyDal from "./study.dal.js";

class StudyController {

  newStudy = async(req,res)=>{
    try {
      const {user_id} = req;
      const data = JSON.parse(req.body.data);
      const filename = req.files?.length > 0 ? req.files[0].filename : null;
      

      await studyDal.newStudy(user_id,data,filename);
      res.status(200).json({message:"Certificado añadido", filename});

    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  getStudies = async(req,res) => {
    try {
      const {user_id} = req;
      const result = await studyDal.getStudies(user_id);
      res.status(200).json({result});
      
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  editStudy = async(req,res) => {
    try {
      const {user_id} =req;
      const {study_id} = req.params;
      const data = req.body.data ? JSON.parse(req.body.data) : req.body;
      const filename = req.files?.length > 0 ? req.files[0].filename : null;
      
      await studyDal.editStudy(user_id, study_id, data, filename);

      res.status(200).json({message:"Estudio actualizado"})
    } catch (error) {
      res.status(500).json(error);
    }
  }

  deleteStudy = async(req,res) => {
    try {
      const {user_id} = req;
      const { study_id } = req.params;
      await studyDal.deleteStudy(user_id, study_id);
      res.status(200).json({message: "experiencia borrada"})
    } catch (error) {
      res.status(500).json(error);
    }
  }

}


export default new StudyController();