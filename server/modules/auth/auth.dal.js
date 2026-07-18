import { dbPool, executeQuery } from '../../config/db.js';

class AuthDal {
  findUserbyEmail = async (email) => {
    try {
      let sql = 'SELECT * FROM user WHERE email = ? AND is_deleted = 0';
      const result = await executeQuery(sql, [email]);
      return result;
    } catch (error) {
      throw error;
    }
  };

 userById = async (id) => {
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
        u.company_title,
        u.company_description,
        u.offers_left,
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
      WHERE u.user_id = ? AND u.is_deleted = 0
    `;
      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  };

  register = async (values,type) => {
    try {
     let sql;
      if (type === 3) {
        
           sql =
          'INSERT INTO user (name, lastname, email, password, phone_number, type) VALUES (?,?,?,?,?,?)';
        } else if (type === 2) {
          
           sql =
          'INSERT INTO user (company_title, dni_cif, email, password, phone_number, name, lastname, address, city_id, province_id, type) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
          
        }
        return await executeQuery(sql, values);
     
    } catch (error) {
      throw error;
    }
  };

  activateUser = async (id) => {
    try {
      let sql = 'UPDATE user SET is_validated = 1 WHERE user_id = ?'; 
      return await executeQuery(sql, [id]);
    } catch (error) {
      throw error;
    }
  };

  updatePassword = async (values) => {
    try {
      let sql = 'UPDATE user SET password = ? WHERE user_id = ?';
      return await executeQuery(sql, values);
    } catch (error) {
      console.log(error);
      
      throw error;
    }
  }

}

export default new AuthDal();