import experienceDal from "./experience.dal.js";

class ExperienceController {

  newExperience = async(req,res) => {
    try {
      const {user_id} = req;
      const data = req.body;

      await experienceDal.newExperience(user_id, data)

      res.status(200).json({message:"Experiencia añadida"})
    } catch (error) {
      res.status(500).json(error);
    }
  }

  getExperience = async(req,res) => {
    try {
      const {user_id} =req;
      const result = await experienceDal.getExperience(user_id);
      res.status(200).json({result});

    } catch (error) {
      res.status(500).json(error);
    }
  }

  editExperience = async(req,res) => {
    try {
      const {user_id} = req;
      const { experience_id } = req.params;
      const data = req.body;
      
      
      await experienceDal.editExperience(user_id, experience_id, data);

      res.status(200).json({ message: "Experiencia actualizada" })
    } catch (error) {
      res.status(500).json(error);
    }
  }

  deleteExperience = async(req,res) => {
    try {
      const {user_id} = req;
      const { experience_id } = req.params;
      await experienceDal.deleteExperience(user_id, experience_id);
      res.status(200).json({message: "experiencia borrada"})
    } catch (error) {
       res.status(500).json(error);
    }
  }
}


export default new ExperienceController();