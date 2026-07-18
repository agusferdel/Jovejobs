import { executeQuery } from "../../config/db.js";

class CandidateDal {
  editCandidate = async (id, data, avatarFilename, cvFilename) => {
      try {
          // 1. Base del SQL con todos los campos de texto
          let sql = `UPDATE user SET 
              name=?, lastname=?, dni_cif=?, phone_number=?, address=?, zip_code=?, 
              about_me=?, linkedin=?, location_pref=?, modality=?, city_id=?, province_id=?`;
          
          // 2. Inicializamos los valores con el array 'data' 
          let values = [...data];

          // 3. Ajustamos SQL y valores según qué archivos llegan
          if (avatarFilename && cvFilename) {
            sql += ", avatar=?, cv=?";
            values = [...data, avatarFilename, cvFilename, id];
          } else if (avatarFilename) {
            sql += ", avatar=?";
            values = [...data, avatarFilename, id];
          } else if (cvFilename) {
            sql += ", cv=?";
            values = [...data, cvFilename, id];
          } else {
            values = [...data, id];
          }

          // 4. Cerramos la consulta con el WHERE
          sql += " WHERE user_id=?";
          
          // 5. Ejecución
          await executeQuery(sql, values);
          
      } catch (error) {
          console.log("Error en el DAL:", error);
          throw error;
      }
  };

  updateSearching = async(user_id, is_searching)=> {
    try {
      let sql = 'UPDATE user SET is_searching = ? WHERE user_id = ? AND is_deleted = 0'
      return await executeQuery(sql, [is_searching, user_id]);
    } catch (error) {
      throw error;
    }
  }

  updatePrivacy = async(user_id,public_profile) => {
    try {
      let sql = 'UPDATE user SET public_profile = ? WHERE user_id = ? AND is_deleted = 0' 
      return await executeQuery(sql, [public_profile, user_id]);
    } catch (error) {
      throw error;
    }
  }

  deleteCv = async(user_id) => {
    try {
      let sql = 'UPDATE user SET cv = NULL WHERE user_id = ? AND is_deleted = 0';
      return await executeQuery(sql, [user_id])
    } catch (error) {
      throw error;
    }
  }

  candidateById = async(id) => {
    try {
      let sql = `
    SELECT
        u.user_id,
        u.name,
        u.lastname,
        u.email,
        u.dni_cif,
        u.phone_number,
        u.address,
        u.zip_code,
        u.avatar,
        u.last_login,
        u.is_deleted,
        u.is_validated,
        u.is_disabled,
        u.type,
        u.cv,
        u.about_me,
        u.linkedin,
        u.location_pref,
        u.modality,
        CASE u.modality
          WHEN '1' THEN 'Remoto'
          WHEN '2' THEN 'Presencial'
          WHEN '3' THEN 'Híbrido'
          ELSE NULL
        END AS modality_label,
        u.is_searching,
        u.public_profile,
        u.city_id,
        u.province_id,
        c.name AS city_name,
        p.name AS province_name
      FROM user u
      LEFT JOIN city c
        ON u.province_id = c.province_id
       AND u.city_id = c.city_id
      LEFT JOIN province p
        ON u.province_id = p.province_id
      WHERE u.user_id = ? 
      AND type = 3
      AND is_deleted = 0
      AND public_profile = 1
      AND is_disabled = 0
    ` ;
      const result = await executeQuery(sql, [id]);
      return result[0] || null;
    } catch (error) {
      throw error;
    }
    
  }

  getAllCandidates = async() => {
    try {
      const sql = `
      SELECT 
        u.user_id,
        u.name,
        u.lastname,
        u.phone_number,
        u.email,
        c.name AS city,
        u.modality,
         CASE u.modality
          WHEN '1' THEN 'Remoto'
          WHEN '2' THEN 'Presencial'
          WHEN '3' THEN 'Híbrido'
          ELSE NULL
        END AS modality_label,
        u.is_disabled,
        u.is_deleted,
        COUNT(uo.offer_id) AS applications_count
      FROM user u
      LEFT JOIN city c
        ON u.province_id = c.province_id
      AND u.city_id = c.city_id
      LEFT JOIN user_offer uo
        ON u.user_id = uo.user_id
      WHERE u.type = 3
      GROUP BY
        u.user_id,
        u.name,
        u.lastname,
        u.phone_number,
        u.email,
        c.name,
        u.modality,
        u.is_disabled,
        u.is_deleted
      ORDER BY u.name ASC, u.lastname ASC;
      `;
      return await executeQuery(sql);
    } catch (error) {
      throw error;
    }
  }

}
 

export default new CandidateDal();