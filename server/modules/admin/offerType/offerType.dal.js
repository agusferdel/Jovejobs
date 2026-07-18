import { executeQuery } from '../../../config/db.js';

class OfferTypeDal {
  createOfferType = async (data) => {
    try {
      let sql = 'INSERT INTO offer_type (name) VALUES (?)';

      return await executeQuery(sql, [data.name]);
    } catch (error) {
      throw error;
    }
  };

  getAllOfferTypes = async () => {
    try {
      let sql = 'SELECT * FROM offer_type WHERE is_deleted= 0';
      return await executeQuery(sql);
    } catch (error) {
      throw error;
    }
  };

  updateOfferType = async (name, id) => {
    try {
      let sql = 'UPDATE offer_type SET name = ? WHERE offer_type_id = ?';
      return await executeQuery(sql, [id, name]);
    } catch (error) {
      throw error;
    }
  };

  deleteOfferType = async (id) => {
    try {
      let sql = 'UPDATE offer_type SET is_deleted = 1 WHERE offer_type_id = ?';
      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  };
}

export default new OfferTypeDal();
