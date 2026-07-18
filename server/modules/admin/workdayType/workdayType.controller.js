import workdayTypeDal from './workdayType.dal.js';

class WorkdayTypeController {
  createWorkdayType = async (req, res) => {
    try {
      const { name } = req.body;
      await workdayTypeDal.createWorkdayType({ name });

      res.status(200).json({ message: 'Tipo de oferta añadido' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getAllWorkdayTypes = async (req, res) => {
    try {
      const result = await workdayTypeDal.getAllWorkdayTypes();
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  updateWorkdayType = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await workdayTypeDal.updateWorkdayType(id, name.trim());
      res.status(200).json({ message: 'Tipo de contrato actualizado' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  deleteWorkdayType = async (req, res) => {
    try {
      const { id } = req.params;
      await workdayTypeDal.deleteWorkdayType(id);
      res.status(200).json({ message: 'Tipo de contrato borrado' });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new WorkdayTypeController();
