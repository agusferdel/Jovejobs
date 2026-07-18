import { dbPool, executeQuery } from '../../config/db.js';

class ProvinceDal {
    provinceSearch = async(search) => {
    try {
      const dataInput = `%${search}%`;
      const sql = `
                  SELECT *
                  FROM province
                  WHERE province.name LIKE ?
                  `;
      return await executeQuery(sql, [dataInput]);
    } catch (error) {
      throw error;
    }
  }

    checkProvinceExists = async (province_id) => {
    const sql = `SELECT COUNT(*) AS total FROM province WHERE province_id = ?`;
    const result = await executeQuery(sql, [province_id]);
    return result?.[0]?.total > 0;;
  };
}

export default new ProvinceDal();
