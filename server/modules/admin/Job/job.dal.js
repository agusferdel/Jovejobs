import { executeQuery } from '../../../config/db.js';

class JobDal {
  createJob = async (data) => {
    try {
      let sql = 'INSERT INTO job (name) VALUES (?)';

      return await executeQuery(sql, [data.name]);
    } catch (error) {
      throw error;
    }
  };

  getAllJobs = async () => {
    try {
      let sql = 'SELECT * FROM job WHERE is_deleted = 0';
      return await executeQuery(sql);
    } catch (error) {
      throw error;
    }
  };

  updateJob = async (name, id) => {
    try {
      let sql = 'UPDATE job SET name = ? WHERE job_id = ?';
      return await executeQuery(sql, [name, id]);
    } catch (error) {
      throw error;
    }
  };

  deleteJob = async (id) => {
    try {
      let sql = 'UPDATE job SET is_deleted = 1 WHERE job_id = ?';
      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  };
}

export default new JobDal();
