import { executeQuery } from '../../config/db.js';

class usersDal {
  //cambiar contraseña
  updatePassword = async (values) => {
    try {
      let sql = 'UPDATE user SET password = ? WHERE user_id = ?';
      return await executeQuery(sql, values);
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  //contraseña actual
  getPasswordById = async (id) => {
    try {
      let sql = 'SELECT password FROM user WHERE user_id = ?';

      return await executeQuery(sql, [id]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  // eliminar usuarios  (is_deleted = 1)
  autoDelete = async (user_id) => {
    try {
      let sql = 'UPDATE user SET is_deleted = 1 WHERE user_id = ?';
      return await executeQuery(sql, [user_id]);
    } catch (error) {
      throw error;
    }
  };

  // restaurar usuarios eliminados desde admin (is_deleted = 0)
  restoreUser = async (user_id) => {
    try {
      let sql = 'UPDATE user SET is_deleted = 0 WHERE user_id = ?';
      return await executeQuery(sql, [user_id]);
    } catch (error) {
      throw error;
    }
  };

  //deshabilitar usuarios desde admin (is_disable = 1)
  disabledUser = async (user_id) => {
    try {
      let sql = 'UPDATE user SET is_disabled = 1 WHERE user_id = ?';
      return await executeQuery(sql, [user_id]);
    } catch (error) {
      throw error;
    }
  };

  //habilitar usuarios desde admin (is_disable = 0)
  enabledUser = async (user_id) => {
    try {
      let sql = 'UPDATE user SET is_disabled = 0 WHERE user_id = ?';
      return await executeQuery(sql, [user_id]);
    } catch (error) {
      throw error;
    }
  };

  //Restar Oferta
  substracOffer = async(userId) => {
    try {
      let sqlUpdate = 'UPDATE user SET offers_left = offers_left - 1 WHERE user_id = ? AND offers_left > 0';
      await executeQuery(sqlUpdate, [userId]);

      let sqlSelect = 'SELECT user_id, email, offers_left FROM user WHERE user_id = ?';
      const result = await executeQuery(sqlSelect, [userId]);
      return result[0];
    } catch (error) {
      
    }
  }
}

export default new usersDal();
