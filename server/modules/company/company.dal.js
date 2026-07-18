import { executeQuery } from '../../config/db.js';

class CompanyDal {
  //obtener todas las empresas
  getAllCompanies = async () => {
    try {
      const sql = `
  SELECT 
    u.user_id,
    u.company_title,
    u.name,
    u.lastname,
    u.email,
    u.phone_number,
    c.name AS city,
    p.name AS province,
    u.is_disabled,
    u.is_deleted
  FROM user u
  LEFT JOIN city c
    ON u.province_id = c.province_id
   AND u.city_id = c.city_id
  LEFT JOIN province p
    ON u.province_id = p.province_id
  WHERE u.type = 2
  ORDER BY u.company_title ASC, u.name ASC;
`;
      return await executeQuery(sql);
    } catch (error) {
      throw error;
    }
  };

  getCompanyById = async (companyId) => {
    try {
      const sql = `
      SELECT 
        u.user_id,
        u.name,
        u.lastname,
        u.email,
        u.password,
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
        u.company_title,
        u.company_description,
        u.offers_left,
        u.linkedin,
        c.name AS city,
        p.name AS province
      FROM user u
      LEFT JOIN city c 
        ON u.city_id = c.city_id
      LEFT JOIN province p 
        ON u.province_id = p.province_id
      WHERE u.user_id = ? AND u.type = 2;
    `;

      return await executeQuery(sql, [companyId]);
    } catch (error) {
      throw error;
    }
  }
  // Editar Compañía
  editCompany = async (id, data, avatarFilename) => {
    try {
      // 1. Base del SQL con todos los campos de texto
      let sql = `UPDATE user SET 
              name=?, lastname=?, phone_number=?, address=?, zip_code=?, 
              linkedin=?, company_title=?, company_description=?, city_id=?, province_id=?`;

      // 2. Inicializamos los valores con el array 'data'
      let values = [...data];

      // 3. Ajustamos SQL y valores según qué archivos llegan
      if (avatarFilename) {
        sql += ', avatar=?';
        values = [...data, avatarFilename, id];
      } else {
        values = [...data, id];
      }

      // 4. Cerramos la consulta con el WHERE
      sql += ' WHERE user_id=?';

      // 5. Ejecución
      await executeQuery(sql, values);
    } catch (error) {
      console.log('Error en el DAL:', error);
      throw error;
    }
  };

  getPublicCompany = async(company_id) => {
    try {
      let sql = `
      SELECT
        u.user_id,
        u.avatar,
        u.company_title,
        u.company_description,
        COUNT(o.offer_id) AS active_offers
      FROM user u
      LEFT JOIN offer o
        ON o.created_by_user_id = u.user_id
        AND o.is_active = 1
      WHERE u.user_id = ?
        AND u.type = 2
        AND u.is_deleted = 0
        AND u.is_disabled = 0
      GROUP BY
        u.user_id,
        u.avatar,
        u.company_title,
        u.company_description;
      `
      return await executeQuery(sql, [company_id]);
    } catch (error) {
      throw error;
    }
  }

  searchCandidates = async ({ palabraClave }) => {
    try {
      let palabras = (palabraClave || '').split(' ');

      palabras = palabras.filter((palabra) => palabra.trim() !== '');

      for (let i = 0; i < palabras.length; i++) {
        palabras[i] = palabras[i].trim();
      }

      let sql = `
        SELECT DISTINCT
          u.user_id,
          u.name,
          u.lastname,
          u.modality,
          u.is_searching,
          u.location_pref,
          c.name AS city_name,
          p.name AS province_name
        FROM user u
        LEFT JOIN city c
          ON u.province_id = c.province_id
          AND u.city_id = c.city_id
        LEFT JOIN province p
          ON u.province_id = p.province_id
        LEFT JOIN experience e
          ON u.user_id = e.user_id
        LEFT JOIN study s
          ON u.user_id = s.user_id
        LEFT JOIN language l
          ON u.user_id = l.user_id
        WHERE 1 = 1
          AND u.type = 3
          AND u.is_deleted = 0
          AND u.is_disabled = 0
          AND u.public_profile = 1
      `;

      const values = [];

      if (palabras.length > 0) {
        sql += ` AND (`;

        for (let i = 0; i < palabras.length; i++) {
          if (i > 0) {
            sql += ` OR `;
          }

          sql += `
            (
              u.name LIKE ?
              OR u.lastname LIKE ?
              OR u.about_me LIKE ?
              OR u.modality LIKE ?
              OR u.location_pref LIKE ?
              OR c.name LIKE ?
              OR p.name LIKE ?
              OR e.title LIKE ?
              OR e.description LIKE ?
              OR e.experience_company LIKE ?
              OR s.studies LIKE ?
              OR s.description LIKE ?
              OR s.studies_center LIKE ?
              OR l.name LIKE ?
              OR l.level LIKE ?
              OR l.description LIKE ?
            )
          `;

          const likeValue = `%${palabras[i]}%`;

          values.push(
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue,
            likeValue
          );
        }

        sql += `)`;
      }

      sql += ` ORDER BY u.is_searching DESC, u.name ASC, u.lastname ASC `;

      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  };

  
}


export default new CompanyDal();
