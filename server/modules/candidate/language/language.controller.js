import languageDal from "./language.dal.js";


class LanguageController {

  newLanguage = async(req,res) => {
    try {
      const {user_id} = req;
      const {name, level,description} = req.body;
      const values = [user_id, name,level,description];
      
      await languageDal.newLanguage(user_id,values);
      res.status(200).json({message: "Idioma añadido"})
    } catch (error) {
      res.status(500).json(error);
    }
  }

  getLanguages = async(req,res) => {
    try {
      const {user_id} = req;
      const result = await languageDal.getLanguages(user_id);
      res.status(200).json({result});
    } catch (error) {
      res.status(500).json(error);
    }
  }

  editLanguage = async(req,res) => {
    try {
      const {user_id} = req;
      const {language_id} = req.params;
      const data = req.body;
      await languageDal.editLanguage(user_id,language_id,data);
      res.status(200).json({message:"Idioma actualizado"});
    } catch (error) {
      res.status(500).json(error);
    }
  }

  deleteLanguage = async(req,res) => {
    try {
      const {user_id} = req;
      const {language_id} = req.params;
      await languageDal.deleteLanguage(user_id,language_id);
      res.status(200).json({message:"Idioma borrado"});
    } catch (error) {
      res.status(500).json(error);
    }
  }

}


export default new LanguageController();