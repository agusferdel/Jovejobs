import purchaseDal from "./purchase.dal.js";

class PurchaseController {
 getAllPurchases = async (req, res) => {
    try {
      const purchases = await purchaseDal.getAllPurchases();
      
      return res.status(200).json({ 
        message: 'Compras obtenidas con éxito',
        result: purchases 
      });
    } catch (error) {
      console.error('Error en PurchaseController.getAllPurchases:', error);
      return res.status(500).json({ message: 'Error al obtener el listado de compras' });
    }
  };
}

export default new PurchaseController();