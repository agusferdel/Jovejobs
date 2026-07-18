import { executeQuery } from '../../config/db.js';
import bcrypt from 'bcrypt';
import authDal from './auth.dal.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendEmail from '../../services/emailServices.js';
import {
  welcomeTemplate,
  resetPasswordTemplate,
  resetPasswordConfirmationTemplate,
} from '../../services/templates.js';
import experienceDal from '../candidate/experience/experience.dal.js';
import studyDal from '../candidate/study/study.dal.js';
import languageDal from '../candidate/language/language.dal.js';
import cityDal from '../city/city.dal.js';
import provinceDal from '../province/province.dal.js';

dotenv.config();

class AuthController {
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      //1 Ver si el usuario con ese email existe en nuestra db
      const result = await authDal.findUserbyEmail(email);
      if (!result.length) {
        res.status(401).json({ message: 'Email no existe' });
        //2 Comprobar que la cuenta está activada
      } else if (result[0].is_disabled === 1){
        res.status(401).json({ message: 'Esta cuenta está deshabilitada'})
      } else if (result[0].is_validated === 0) {
        const { user_id, name, lastname } = result[0];
        const token = jwt.sign({ id: user_id }, process.env.SECRET_KEY, {
          expiresIn: '24h',
        });
        const activateLink = `${process.env.CLIENT_URL}/activate/${token}`;
        sendEmail(
          email,
          welcomeTemplate(email, name, lastname, activateLink)
        );

        res.status(401).json({
          message:
            'Cuenta no validada. Te acabamos de reenviar un email para activar la cuenta',
        });
      } else {
        //3 Comprobar que la password es correcta
        let match = await bcrypt.compare(password, result[0].password);
        if (!match) {
          res.status(401).json({ message: 'Password no válida' });
        } else {
          //4 Generar un token
          const token = jwt.sign(
            { id: result[0].user_id },
            process.env.SECRET_KEY,
            { expiresIn: '30d' }
          );

          res.status(200).json({ message: 'login ok', token });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  userById = async (req, res) => {
    try {
      //solo para el perfil de candidato público, el de empresa público no queremos traer todos los datos
      const user_id = req.params.candidate_id || req.user_id; 
      
      // Llamamos al DAL para buscar en la base de datos
      const result = await authDal.userById(user_id);

      if (!result.length) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const user = {
        user_id: result[0].user_id,
        name: result[0].name,
        lastname: result[0].lastname,
        email: result[0].email,
        dni_cif: result[0].dni_cif,
        phone_number: result[0].phone_number,
        address: result[0].address,
        zip_code: result[0].zip_code,
        avatar: result[0].avatar,
        last_login: result[0].last_login,
        is_deleted: result[0].is_deleted,
        is_validated: result[0].is_validated,
        is_disabled: result[0].is_disabled,
        type: result[0].type, // 1: Admin, 2: Empresa, 3: Candidato
        cv: result[0].cv,
        about_me: result[0].about_me,
        linkedin: result[0].linkedin,
        location_pref: result[0].location_pref,
        modality: result[0].modality,
        modality_label: result[0].modality_label,
        is_searching: result[0].is_searching, // Dato útil para candidatos
        public_profile: result[0].public_profile,
        company_title: result[0].company_title,
        company_description: result[0].company_description,
        offers_left: result[0].offers_left, // Dato útil para empresas
        city_id: result[0].city_id, // Datos utiles para perfiles
        province_id: result[0].province_id,
        city: result[0].city_name,
        province: result[0].province_name,
      }; // Devolvemos el objeto usuario al frontend

      const experience = await experienceDal.getExperience(user_id);
      const study = await studyDal.getStudies(user_id);
      const language = await languageDal.getLanguages(user_id);

      res.status(200).json({ user, experience, study, language });
    } catch (error) {
      console.error('Error en userById:', error);
      res.status(500).json({ message: 'Error interno del servidor', error });
    }
  };

  register = async (req, res) => {
    try {
      const {
        name,
        lastname,
        email,
        password,
        phone_number,
        company_title,
        identification,
        address,
        city_id,
        province_id,
        type,
      } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      let values;
      if (type === 3) {
        values = [name, lastname, email, hashedPassword, phone_number, type];
      } else if (type === 2) {
        const cityExist = await cityDal.checkCityExists(city_id, province_id);
        const provinceExist = await provinceDal.checkProvinceExists(province_id);
        values = [
          company_title,
          identification,
          email,
          hashedPassword,
          phone_number,
          name,
          lastname,
          address,
          city_id,
          province_id,
          type,
        ];
      }
      const result = await authDal.register(values, type);

      //Generar un token para el link de activación de la cuenta
      const token = jwt.sign({ id: result.insertId }, process.env.SECRET_KEY, {
        expiresIn: '24h',
      });
      const activateLink = `${process.env.CLIENT_URL}/activate/${token}`;

      sendEmail(
        email,
        welcomeTemplate(email, name, lastname, activateLink)
      ).catch((error) => {
        console.log('Error enviando email:', error);
      });
      res.status(200).json({ message: 'Usuario registrado corréctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  activateUser = async (req, res) => {
    try {
      const { token } = req.params;
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      const { id } = payload;

      const result = await authDal.userById(id);

      if (result[0].is_validated === 1) {
        return res.status(400).json({ message: 'La cuenta ya está validada' });
      }

      await authDal.activateUser(id);

      res.status(200).json({ message: 'Cuenta activada correctamente' });
    } catch (error) {
      console.log(error);
      
      res.status(500).json(error);
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const result = await authDal.findUserbyEmail(email);

      if (!result.length) {
        return res.status(401).json({ message: 'El email no existe' });
      }

      const { user_id, name } = result[0];

      const token = jwt.sign({ id: user_id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });

      const resetLink = `${process.env.CLIENT_URL}/resetPassword/${token}`;

      sendEmail(email, resetPasswordTemplate(name, resetLink));

      res.status(200).json({
        message: 'Email de recuperación de contraseña enviado correctamente',
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      const { id } = payload;

      const result = await authDal.userById(id);
      const { email, name } = result[0];

      const hashedPassword = await bcrypt.hash(password, 10);

      let values = [hashedPassword, id];

      await authDal.updatePassword(values);

      sendEmail(email, resetPasswordConfirmationTemplate(name));

      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  };
}

export default new AuthController();