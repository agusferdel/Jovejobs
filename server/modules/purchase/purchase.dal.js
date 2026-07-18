import { executeQuery } from '../../config/db.js';

class PurchaseDal {
  getAllPurchases = async () => {
    const sql = `
      SELECT 
        pu.purchase_id, 
        pa.name AS pack_name, 
        u.company_title AS company_name, 
        pu.price_paid AS price, 
        pu.date AS purchase_date
      FROM purchase pu
      JOIN pack pa ON pu.pack_id = pa.pack_id
      JOIN user u ON pu.user_id = u.user_id
      ORDER BY pu.date DESC
    `;
    
    return await executeQuery(sql);
  };
}

export default new PurchaseDal();