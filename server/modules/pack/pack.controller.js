import packDal from './pack.dal.js';

class PackController {
 
  purchasePack = async (req, res) => {
    try {
      const userId = req.user_id;
      const { pack } = req.body;
      
      if (!pack || !pack.pack_id) {
        return res.status(400).json({ message: 'Datos del pack incompletos' });
      }

      // Llamamos a la transacción 
      await packDal.purchasePackTransaction(userId, pack);

      return res.status(200).json({
        message: '¡Excelente! Pack adquirido, compra registrada y ofertas actualizadas correctamente.',
      });

    } catch (error) {
      console.error('Error en PackController.purchasePack:', error);
      return res.status(500).json({ 
        message: 'No se pudo procesar la compra.',
        error: error.message 
      });
    }
  };

  createPack = async (req, res) => {
    try {
      const { user_id } = req.user_id;

      await packDal.createPack(user_id, req.body);
      res.status(200).json({ message: 'Paquete creado correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getPacks = async (req, res) => {
    try {
      const result = await packDal.getAllPacks();

      res.status(200).json({
        message: 'Paquetes obtenidos correctamente',
        result,
      });
    } catch (error) {
      console.error('Error en PackController.getPacks:', error);
      res.status(500).json(error);
    }
  };

  deletePack = async (req, res) => {
    try {
      const { pack_id } = req.params;
      await packDal.softDeletePack(pack_id);
      res.status(200).json({ message: 'Paquete eliminado correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getPackById = async (req, res) => {
    try {
      const { pack_id } = req.params;
      const result = await packDal.getPackById(pack_id);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Paquete no encontrado' });
      }

      res.status(200).json({ result: result[0] });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  editPack = async (req, res) => {
    try {
      const { pack_id } = req.params;
      await packDal.updatePack(pack_id, req.body);
      res.status(200).json({ message: 'Paquete modificado correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new PackController();
