import companyDal from './company.dal.js';

class CompanyController {
  getAllCompanies = async (req, res) => {
    try {
      const result = await companyDal.getAllCompanies();
      res.status(200).json({result});
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  getCompanyById = async (req, res) => {
    try {
      const { companyId } = req.params;
      const result = await companyDal.getCompanyById(companyId);
      if (!result) {
        return res.status(404).json({message: 'Empresa no encontrada'})
      }

      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error });
    }
  };
  editCompany = async (req, res) => {
      try {
        const { user_id } = req;
  
        // Parseamos la data
        const parsedData = JSON.parse(req.body.data);
        
        const {  
            name, 
            lastname,             
            phone_number, 
            address,
            zip_code,
            avatar,
            linkedin,
            company_title,
            company_description,            
            city_id,
            province_id,
            fileType
        } = parsedData;
  
        let data = [
            name, 
            lastname,
            phone_number, 
            address,
            zip_code,
            linkedin,
            company_title,
            company_description,            
            city_id,
            province_id
          ];
        let avatarFilename = null;
        
        
      
       // Lógica de detección de archivos POR NOMBRE DE CAMPO (fieldname)
        if (req.files && req.files.length > 0) {
          // Recorremos los archivos sin importar el orden en el que lleguen
          req.files.forEach((file) => {
              if (file.fieldname === 'avatar') {
                  avatarFilename = file.filename;
              }
          });
          // Mantenemos este 'else if' por si en algún momento se usa req.file (un solo archivo)
        } else if (req.file) {
          if (req.file.fieldname === 'avatar') {
              avatarFilename = req.file.filename;
          }
        }
  
        await companyDal.editCompany(user_id, data, avatarFilename);
  
        res.status(200).json({ message: 'Update ok', avatar: avatarFilename});
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    };

  getPublicCompany = async(req,res) => {
    try {
      const {company_id} = req.params;
      const result = await companyDal.getPublicCompany(company_id);
      res.status(200).json({result});
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

   searchCandidates = async (req, res) => {
    try {
      const { palabraClave = '' } = req.body;

      const result = await companyDal.searchCandidates({ palabraClave });

      res.status(200).json({ result });
    } catch (error) {
      console.error('Error al buscar candidatos', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}



export default new CompanyController();
