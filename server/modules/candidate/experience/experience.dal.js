import { executeQuery } from "../../../config/db.js";

class ExperienceDal {

  newExperience = async(id, data) => {
    try {
      let sql = `INSERT INTO experience
        (user_id, title, experience_company, start_month_year, end_month_year, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
        let values = [
        id,
        data.title,
        data.experience_company,
        data.start_month_year,
        data.end_month_year || null,
        data.description || null
      ];
      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  }

  getExperience = async(id) => {
    try {
      let sql = 'SELECT * FROM experience WHERE user_id = ?';

      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  }

  editExperience = async(userId, expId, data) => {
    try {
    let sql = `
        UPDATE experience
        SET title = ?,
            experience_company = ?,
            start_month_year = ?,
            end_month_year = ?,
            description = ?
        WHERE experience_id = ? AND user_id = ?
      `;
    let values = [
      data.title,
      data.experience_company,
      data.start_month_year || null,
      data.end_month_year || null,
      data.description || null,
      expId,
      userId,
    ];
     return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  }

  deleteExperience = async(userId,expId) => {
    try {
      let sql = 'DELETE FROM experience WHERE user_id = ? AND experience_id = ?';
      let values = [userId, expId];
      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  }
}

export default new ExperienceDal();