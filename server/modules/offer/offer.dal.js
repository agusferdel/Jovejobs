import { executeQuery } from '../../config/db.js';

class OfferDal {
  //  Mostrar todas las ofertas
  getAllOffers = async () => {
    try {
      let sql = `
      SELECT 
        o.*, 
        j.name AS job_name, 
        u.company_title,
        u.avatar AS company_icon,
        c.name AS city_name, 
        p.name AS province_name,
        ot.name AS offer_type_name
       FROM offer o
       INNER JOIN job j ON o.job_id = j.job_id
       INNER JOIN user u ON o.created_by_user_id = u.user_id
       LEFT JOIN city c ON o.province_id = c.province_id AND o.city_id = c.city_id
       LEFT JOIN province p ON o.province_id = p.province_id
       LEFT JOIN offer_type ot ON o.offer_type_id = ot.offer_type_id
       WHERE o.is_active = 1 
       ORDER BY o.date DESC`;
      const result = await executeQuery(sql);
      return result;
    } catch (error) {
      throw error;
    }
  };

    getAllOffersTop3 = async () => {
    try {
      let sql = `
      SELECT 
        o.*, 
        j.name AS job_name, 
        u.company_title,
        u.avatar AS company_icon,
        c.name AS city_name, 
        p.name AS province_name,
        ot.name AS offer_type_name
       FROM offer o
       INNER JOIN job j ON o.job_id = j.job_id
       INNER JOIN user u ON o.created_by_user_id = u.user_id
       LEFT JOIN city c ON o.province_id = c.province_id AND o.city_id = c.city_id
       LEFT JOIN province p ON o.province_id = p.province_id
       LEFT JOIN offer_type ot ON o.offer_type_id = ot.offer_type_id
       WHERE o.is_active = 1 
       ORDER BY o.date DESC
       LIMIT 3`;
      const result = await executeQuery(sql);
      return result;
    } catch (error) {
      throw error;
    }
  };

  getAllOffersAdmin = async () => {
    try {
      let sql = `
        SELECT 
          o.*, 
          j.name AS job_name, 
          u.company_title,
          u.avatar AS company_icon,
          c.name AS city_name, 
          p.name AS province_name,
          ot.name AS offer_type_name
         FROM offer o
         INNER JOIN job j ON o.job_id = j.job_id
         INNER JOIN user u ON o.created_by_user_id = u.user_id
         LEFT JOIN city c ON o.province_id = c.province_id AND o.city_id = c.city_id
         LEFT JOIN province p ON o.province_id = p.province_id
         LEFT JOIN offer_type ot ON o.offer_type_id = ot.offer_type_id 
         ORDER BY o.date DESC`;
      const result = await executeQuery(sql);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Mostrar una oferta específica
  // ... dentro de la clase OfferDal

  getOfferById = async (id) => {
    try {
      let sql = `
        SELECT
          o.offer_id,
          o.job_id,
          o.title,
          o.description,
          o.date,
          o.created_by_user_id,
          o.province_id,
          o.city_id,
          o.modality,
          o.is_active,
          o.workday_type_id,
          o.province_id,
          o.city_id,
          wt.name AS workday_type_name,
          o.offer_type_id,
          ot.name AS offer_type_name,
          j.name AS job_name,
          c.name AS city_name,
          p.name AS province_name,
          u.company_title,
          u.avatar AS company_icon
        FROM offer o
        INNER JOIN workday_type wt
          ON o.workday_type_id = wt.workday_type_id
        INNER JOIN offer_type ot
          ON o.offer_type_id = ot.offer_type_id
        INNER JOIN job j
          ON o.job_id = j.job_id
        INNER JOIN user u
          ON o.created_by_user_id = u.user_id
        LEFT JOIN city c
          ON o.province_id = c.province_id
        AND o.city_id = c.city_id
        LEFT JOIN province p
          ON o.province_id = p.province_id
        WHERE o.offer_id = ?
      `;

      const result = await executeQuery(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Editar oferta
  editOffer = async (id, userId, data) => {
    try {
      const sql = `
        UPDATE offer 
        SET 
          title = ?, 
          job_id = ?, 
          modality = ?, 
          offer_type_id = ?, 
          workday_type_id = ?, 
          description = ?, 
          province_id = ?, 
          city_id = ?,
          is_active = ?
        WHERE offer_id = ? AND created_by_user_id = ?
      `;

      const values = [
        data.title,
        data.job_id,
        data.modality,
        data.offer_type_id,
        data.workday_type_id,
        data.description,
        data.province_id,
        data.city_id,
        data.is_active,
        id,
        userId,
      ];

      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  };

  // Mostrar candidaturas de un usuario
  getCandidateApplications = async (user_id) => {
    try {
      let sql = `SELECT 
        o.offer_id, 
        o.title, 
        o.description, 
        o.modality,
        o.is_active,
        j.name AS job_name,
        u.company_title,
        c.name AS city_name,
        p.name AS province_name,
        uo.status AS application_status, 
        uo.date AS application_date,
        uo.is_contacted 
       FROM user_offer uo
       INNER JOIN offer o ON uo.offer_id = o.offer_id
       INNER JOIN job j ON o.job_id = j.job_id
       INNER JOIN user u ON o.created_by_user_id = u.user_id
       LEFT JOIN city c ON o.province_id = c.province_id AND o.city_id = c.city_id
       LEFT JOIN province p ON o.province_id = p.province_id
       WHERE uo.user_id = ?
       ORDER BY uo.date DESC`;
      const result = await executeQuery(sql, [user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  deleteApplication = async (user_id, offer_id) => {
    try {
      let sql = `DELETE FROM user_offer WHERE user_id = ? AND offer_id = ?`;
      let values = [user_id, offer_id];
      const result = await executeQuery(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  };

  newOffer = async (user_id, data) => {
    try {
      const {
        created_by_user_id,
        offer_type_id,
        workday_type_id,
        title,
        job_id,
        modality,
        description,
        date,
        is_active,
        province_id,
        city_id,
      } = data;

      let sql = `INSERT INTO offer 
                 (created_by_user_id, offer_type_id, workday_type_id, title, job_id, modality, description, date, is_active, province_id, city_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      let values = [
        user_id,
        offer_type_id,
        workday_type_id,
        title,
        job_id,
        modality,
        description,
        new Date(),
        is_active,
        province_id,
        city_id,
      ];
      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  };

  searchOffers = async (data) => {
    try {
      let sql = `
      SELECT 
        o.*, 
        j.name AS job_name, 
        u.company_title,
        u.avatar AS company_icon,
        c.name AS city_name, 
        p.name AS province_name,
        ot.name AS offer_type_name
      FROM offer o
      INNER JOIN job j ON o.job_id = j.job_id
      INNER JOIN user u ON o.created_by_user_id = u.user_id
      LEFT JOIN city c ON o.province_id = c.province_id AND o.city_id = c.city_id
      LEFT JOIN province p ON o.province_id = p.province_id
      LEFT JOIN offer_type ot ON o.offer_type_id = ot.offer_type_id
      WHERE o.is_active = 1
    `;

      const values = [];
      if (data.city) {
        sql += ` AND LOWER(c.name) LIKE ?`;
        values.push(`%${data.city.toLowerCase().trim()}%`);
      }

      if (data.job) {
        sql += ` AND LOWER(j.name) LIKE ?`;
        values.push(`%${data.job.toLowerCase().trim()}%`);
      }
      if (data.company) {
        sql += ` AND LOWER(u.company_title) LIKE ?`;
        values.push(`%${data.company.toLowerCase().trim()}%`);
      }
      if (data.offersType) {
        sql += ` AND LOWER(ot.name) LIKE ?`;
        values.push(`${data.offersType.toLowerCase().trim()}%`);
      }
      if (data.modality) {
        sql += ` AND o.modality = ?`;
        const cleanModality = data.modality.toLowerCase().trim();

        // Comprobamos por qué letra empieza el texto que ha escrito el usuario
        if (cleanModality.startsWith('r')) {
          values.push(1); // 1 = Remoto
        } else if (cleanModality.startsWith('p')) {
          values.push(2); // 2 = Presencial
        } else if (cleanModality.startsWith('h')) {
          values.push(3); // 3 = Híbrido
        } else {
          values.push(-1); // Si escribe algo que no empieza por R, P o H, no traerá nada
        }
      }

      return await executeQuery(sql, values);
    } catch (error) {
      throw error;
    }
  };

  applyToOffer = async (user_id, offer_id) => {
    try {
      // Insertamos solo los IDs, el resto usa los DEFAULT de la tabla
      const sql = `INSERT INTO user_offer (user_id, offer_id) VALUES (?, ?)`;
      return await executeQuery(sql, [user_id, offer_id]);
    } catch (error) {
      throw error;
    }
  };

  //Desactivar oferta
  deactivateOffer = async (offer_id, user_id) => {
    // Añadimos la condición AND created_by_user_id = ?
    try {
      const sql = `UPDATE offer SET is_active = 0 WHERE offer_id = ? AND created_by_user_id = ?`;
      return await executeQuery(sql, [offer_id, user_id]);
    } catch (error) {
      throw error;
    }
  };

  activateOffer = async (offer_id, user_id) => {
    try {
      const sql = `UPDATE offer SET is_active = 1 WHERE offer_id = ? AND created_by_user_id = ?`;
      return await executeQuery(sql, [offer_id, user_id]);
    } catch (error) {
      throw error;
    }
  };

  //Comprobar inscripción a oferta
  checkApplication = async (userId, offerId) => {
    try {
      const sql = 'SELECT * FROM user_offer WHERE user_id = ? AND offer_id = ?';

      const result = await executeQuery(sql, [userId, offerId]);

      // LOG DE CONTROL: Mira qué imprime esto en la consola del servidor
      console.log('Resultado de la DB en el DAL:', result);

      // Como es un array ([]), comprobamos si tiene elementos (length > 0)
      return result.length > 0;
    } catch (error) {
      throw error;
    }
  };

  getOfferApplications = async (company_user_id, offer_id) => {
    try {
      const sql = `
        SELECT
          u.user_id,
          u.name,
          u.lastname,
          u.avatar,
          uo.status,
          uo.date,
          uo.is_contacted,
          o.offer_id,
          o.title ,
          o.created_by_user_id
        FROM user_offer uo
        INNER JOIN user u
          ON uo.user_id = u.user_id
        INNER JOIN offer o
          ON uo.offer_id = o.offer_id
        WHERE o.offer_id = ?
          AND o.created_by_user_id = ?
          AND u.type = 3
        ORDER BY uo.date DESC
      `;

      return await executeQuery(sql, [offer_id, company_user_id]);
    } catch (error) {
      throw error;
    }
  };

  updateContactedStatus = async (offer_id, candidate_id, is_contacted) => {
    try {
      let sql = `
        UPDATE user_offer
        SET is_contacted = ?
        WHERE offer_id = ?
          AND user_id = ?
      `;

      return await executeQuery(sql, [is_contacted, offer_id, candidate_id]);
    } catch (error) {
      throw error;
    }
  };

  getOffersByUserId = async (userId) => {
    try {
      let sql = `
    SELECT
       o.*,
       j.name AS job_name,
       u.company_title,
       u.avatar AS company_icon,
       c.name AS city_name,
       p.name AS province_name,
       ot.name AS offer_type_name
    FROM offer o
    LEFT JOIN job j ON o.job_id = j.job_id
    LEFT JOIN user u ON o.created_by_user_id = u.user_id
    LEFT JOIN city c ON o.province_id = c.province_id AND o.city_id = c.city_id
    LEFT JOIN province p ON o.province_id = p.province_id
    LEFT JOIN offer_type ot ON o.offer_type_id = ot.offer_type_id
    WHERE o.created_by_user_id = ?
    ORDER BY o.date DESC`;

      const result = await executeQuery(sql, [userId]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  changeStatus = async (offer_id, candidate_id, status) => {
    try {
      let sql = `
      UPDATE user_offer 
      SET status = ?
      WHERE user_id = ? AND offer_id = ?
      `;
      return await executeQuery(sql, [status, candidate_id, offer_id]);
    } catch (error) {
      throw error;
    }
  };

  
}

export default new OfferDal();
