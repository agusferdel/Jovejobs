import { dbPool, executeQuery } from '../../config/db.js';

class CityDal {
      citySearch = async(province_id) => {
    try {
      const sql = 'SELECT city_id, name FROM city WHERE province_id = ? ORDER BY name ASC';
      return await executeQuery(sql, [province_id]);
    } catch (error) {
      throw error;
    }
  }

  cityById = async (id) => {
  try {
    const sql = `
      SELECT city.city_id, city.name AS label
      FROM city
      WHERE city.city_id = ?
    `;
    return await executeQuery(sql, [id]);
  } catch (error) {
    throw error;
  }
}

  checkCityExists = async (city_id, province_id) => {
    const sql = `SELECT COUNT(*) AS total FROM city WHERE city_id = ? AND province_id = ?`;
    const result = await executeQuery(sql, [city_id, province_id]);
    return result?.[0]?.total > 0;
  };
}

export default new CityDal();
