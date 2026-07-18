import { executeQuery } from '../../../config/db.js';

class WorkdayTypeDal {
  createWorkdayType = async (data) => {
    try {
      let sql = 'INSERT INTO workday_type (name) VALUES (?)';

      return await executeQuery(sql, [data.name]);
    } catch (error) {
      throw error;
    }
  };

  getAllWorkdayTypes = async () => {
    try {
      let sql = 'SELECT * FROM workday_type WHERE is_deleted= 0';
      return await executeQuery(sql);
    } catch (error) {
      throw error;
    }
  };

  updateWorkdayType = async (name, id) => {
    try {
      let sql = 'UPDATE workday_type SET name = ? WHERE workday_type_id = ?';
      return await executeQuery(sql, [id, name]);
    } catch (error) {
      throw error;
    }
  };

  deleteWorkdayType = async (id) => {
    try {
      let sql = 'UPDATE workday_type SET is_deleted = 1 WHERE workday_type_id = ?';
      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  };
}

export default new WorkdayTypeDal();
