import { executeQuery } from "../../../config/db.js";

class LanguageDal {

  newLanguage = async(id,values) => {
    try {
      let sql = 'INSERT INTO language (user_id, name, level, description) values (?,?,?,?)'

      await executeQuery(sql,values);
    } catch (error) {
      throw error
    }
  }

  getLanguages = async(id) => {
    try {
      let sql = 'SELECT * FROM language WHERE user_id = ?';

      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  }

  editLanguage = async (userId, langId, data) => {
    try {
      let sql = `
        UPDATE language
        SET name = ?,
            level = ?,
            description = ?
        WHERE language_id = ? AND user_id = ?
      `;
      let values = [
        data.name,
        data.level,
        data.description || null,
        langId,
        userId,
      ];
      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  }

  deleteLanguage = async(userId,langId) => {
    try {
      let sql = 'DELETE FROM language WHERE user_id = ? AND language_id = ?';
      let values = [userId, langId];
      return await executeQuery(sql,values);
    } catch (error) {
      throw error
    }
  }
}


export default new LanguageDal();