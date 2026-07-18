import { executeQuery } from "../../../config/db.js";

class StudyDal {

 newStudy = async(id,data,filename) => {
    try {
      

        
        let sql = `
          INSERT INTO study
          (user_id, studies_center, studies, start_month_year, end_month_year, description, certificate_doc)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
          let values =  [
          id,
          data.studies_center,
          data.studies,
          data.start_month_year,
          data.end_month_year || null,
          data.description,
          filename
        ];
        
        return await executeQuery(sql,values);
      } catch (error) {
        throw error;
      }
  }

  getStudies = async(id) => {
    try {
      let sql = 'SELECT * FROM study WHERE user_id = ?';

      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  }

  editStudy = async(userId, studyId,data) => {
    try {
      let sql = `
      UPDATE study
      SET
        studies        = ?,
        studies_center = ?,
        start_month_year = ?,
        end_month_year   = ?,
        description      = ?
      WHERE study_id = ? AND user_id = ?;
      `;

      let values = [
        data.studies,
        data.studies_center,
        data.start_month_year || null,
        data.end_month_year || null,
        data.description || null,
        studyId,
        userId,
      ];

      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  }

  deleteStudy = async(userId,studyId) => {
    try {
      let sql = 'DELETE FROM study WHERE user_id = ? AND study_id = ?';
      let values = [userId, studyId];

      return await executeQuery(sql,values);
    } catch (error) {
      throw error;
    }
  }
}


export default new StudyDal();