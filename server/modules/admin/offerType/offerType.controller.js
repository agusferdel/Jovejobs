import offerTypeDal from './offerType.dal.js';

class OfferTypeController {
  createOfferType = async (req, res) => {
    try {
      const { name } = req.body;
      await offerTypeDal.createOfferType({ name });

      res.status(200).json({ message: 'Tipo de oferta añadido' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getAllOfferTypes = async (req, res) => {
    try {
      const result = await offerTypeDal.getAllOfferTypes();
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  updateOfferType = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await offerTypeDal.updateOfferType(id, name.trim());
      res.status(200).json({ message: 'Tipo de contrato actualizado' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  deleteOfferType = async (req, res) => {
    try {
      const { id } = req.params;
      await offerTypeDal.deleteOfferType(id);
      res.status(200).json({ message: 'Tipo de contrato borrado' });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new OfferTypeController();
