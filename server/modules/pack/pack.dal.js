import { executeQuery } from '../../config/db.js';
import { dbPool } from '../../config/db.js';

class PackDal {
  // async incrementCompanyOffers(userId, offersToAdd) {
  //   const query = `
  //     UPDATE user 
  //     SET offers_left = offers_left + ? 
  //     WHERE user_id = ?
  //   `;

  //   const result = await executeQuery(query, [offersToAdd, userId]);
  //   return result;
  // }


  // Aplico la lógica de transacción
  purchasePackTransaction = async (userId, pack) => {
    // 1. Abro una nueva conexión de la pool
    const connection = await dbPool.getConnection();

    try {
      // 2. Iniciamos la transacción en la conexión
      await connection.beginTransaction();

      // --- PASO A: REGISTRAR LA COMPRA ---
      let sqlPurchase = `INSERT INTO purchase 
                        (user_id, pack_id, price_paid, purchased_offers) 
                        VALUES (?, ?, ?, ?)`;
      
      let valuesPurchase = [userId, pack.pack_id, pack.price, pack.included_offers];
      
      await connection.query(sqlPurchase, valuesPurchase);

      // --- PASO B: INCREMENTAR OFERTAS ---
      let sqlUser = `UPDATE user 
                     SET offers_left = offers_left + ? 
                     WHERE user_id = ?`;
      
      let valuesUser = [pack.included_offers, userId];

      const [resultUser] = await connection.query(sqlUser, valuesUser);

      // Verificamos si la empresa existía para ser actualizada
      if (resultUser.affectedRows === 0) {
        throw new Error('Usuario/Empresa no encontrado al intentar actualizar ofertas.');
      }

      // 3. Si todo ha ido bien, confirmamos la transacción
      await connection.commit();
      return true;

    } catch (error) {
      // 4. Si algo falla, deshacemos cualquier cambio en la DB
      await connection.rollback();
      throw error;

    } finally {
      // 5. Cerramos/liberamos la conexión no importa lo que pase
      connection.release();
    }
  };

  createPack = async (userDataId, data) => {
    try {
      const { name, price, description, included_offers } = data;

      let sql = `INSERT INTO pack 
               (name, price, description, included_offers) 
               VALUES (?, ?, ?, ?)`;

      let values = [name, price, description || null, included_offers];

      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  };

  getAllPacks = async () => {
    try {
      // Seleccionamos solo los packs que no han sido eliminados de forma lógica
      const sql = `SELECT pack_id, name, price, description, included_offers 
                   FROM pack 
                   WHERE is_deleted = 0 
                   ORDER BY price ASC`;

      return await executeQuery(sql, []);
    } catch (error) {
      throw error;
    }
  };

  softDeletePack = async (packId) => {
    try {
      let sql = `UPDATE pack 
                 SET is_deleted = 1 
                 WHERE pack_id = ?`;

      return await executeQuery(sql, [packId]);
    } catch (error) {
      throw error;
    }
  };

  getPackById = async (packId) => {
    try {
      let sql = `SELECT pack_id, name, price, description, included_offers 
                 FROM pack 
                 WHERE pack_id = ? AND is_deleted = 0`;
      return await executeQuery(sql, [packId]);
    } catch (error) {
      throw error;
    }
  };

  updatePack = async (packId, data) => {
    try {
      const { name, price, description, included_offers } = data;

      let sql = `UPDATE pack 
                 SET name = ?, price = ?, description = ?, included_offers = ? 
                 WHERE pack_id = ?`;
      let values = [name, price, description || null, included_offers, packId];

      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  };
}

export default new PackDal();
