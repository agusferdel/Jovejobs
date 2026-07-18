import bcrypt from 'bcrypt';
import usersDal from './users.dal.js';

class UsersController {
  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const id = req.user_id; //verifyToken

      const result = await usersDal.getPasswordById(id);
      const { password: currentHashedPassword } = result[0];
      //verificamos si la contraseña actual conincide con la que ha puesto el usuario
      const isMatch = await bcrypt.compare(
        currentPassword,
        currentHashedPassword
      );
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'La contraseña actual es incorrecta' });
      }

      // Encriptamos la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      let values = [hashedPassword, id];

      await usersDal.updatePassword(values);

      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  };

  //eleiminar usuarios
  autoDelete = async (req, res) => {
    try {
      const { user_id } = req.params.user_id ? req.params : req;

      await usersDal.autoDelete(user_id);
      res.status(200).json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  //resturar usuarios
  restoreUser = async (req, res) => {
    try {
      const { user_id } = req.params;

      await usersDal.restoreUser(user_id);
      res.status(200).json({ message: 'Cuenta restaurada correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  //deshabilitar usuarios
  disabledUser = async (req, res) => {
    try {
      const { user_id } = req.params;

      await usersDal.disabledUser(user_id);
      res.status(200).json({ message: 'Cuenta habilitada correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  //habilitar usuarios
  enabledUser = async (req, res) => {
    try {
      const { user_id } = req.params;

      await usersDal.enabledUser(user_id);
      res.status(200).json({ message: 'Cuenta desabilitada correctamente' });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new UsersController();
