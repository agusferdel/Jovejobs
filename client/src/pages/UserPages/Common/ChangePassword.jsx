import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChangePasswordSchema } from '../../../schemas/ChangePasswordSchema.js';
import { changePasswordApi } from '../../../helpers/usersHelper.js';

import { FormJJ } from '../../../components/Form/Form';
import { ButtonGroupJJ } from '../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../components/Button/Button';
import { InputJJ } from '../../../components/Form/Input';

import ojoAbierto from '../../../assets/iconos/ojo-abierto.png';
import ojoCerrado from '../../../assets/iconos/ojo-cerrado.png';

import './changePassword.css';

const initialValue = {
  currentPassword: '',
  newPassword: '',
  repPassword: '',
};

const ChangePassword = () => {
  const [formData, setFormData] = useState(initialValue);
  const [otherError, setOtherError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    repPassword: false,
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
    setOtherError('');

    const result = ChangePasswordSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      setOtherError(firstError || 'Error de validación');
      return;
    }

    try {
      await changePasswordApi(formData, token);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setOtherError(
        error.response?.data?.message || 'Error al actualizar la contraseña'
      );
    }
  };

  if (success) {
    return (
        <FormJJ title="Cambiar Contraseña" variant="clean">
          <div className='action-message'>
            <h4>Contraseña actualizada</h4>
            <p>Tu contraseña se ha cambiado correctamente.</p>
            <ButtonJJ variant="primary" onClick={() => navigate(-1)}>
              Volver
            </ButtonJJ>
          </div>
        </FormJJ>
    );
  }

   const changePasswordVisibility = (inputName) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };

  return (
    <FormJJ title="Cambiar Contraseña" variant="clean">
      
      {/* Campo 1: Contraseña Actual */}
      <div className="input-password-wrapper">
        <InputJJ
          label="Contraseña actual"
          name="currentPassword"
          type={showPassword.currentPassword ? 'text' : 'password'}
          placeholder="Introduce tu contraseña actual"
          value={formData.currentPassword}
          onChange={handleChange}
        />
        
          <img 
            src={showPassword.currentPassword ? ojoCerrado : ojoAbierto} 
            alt="Mostrar/Ocultar contraseña"
            className="eye-icon-img" 
            onClick={() => changePasswordVisibility('currentPassword')}
          />
        
      </div>

      {/* Campo 2: Nueva Contraseña */}
      <div className="input-password-wrapper">
        <InputJJ
        className="input-group"
          label="Nueva contraseña"
          name="newPassword"
          type={showPassword.newPassword ? 'text' : 'password'}
          placeholder="Introduce nuevo password"
          value={formData.newPassword}
          onChange={handleChange}
        />
        
          <img 
            src={showPassword.newPassword ? ojoCerrado : ojoAbierto} 
            alt="Mostrar/Ocultar contraseña"
            className="eye-icon-img"
             onClick={() => changePasswordVisibility('newPassword')}
          />
        
      </div>

      {/* Campo 3: Repetir Contraseña */}
      <div className="input-password-wrapper">
        <InputJJ
          label="Repite nueva contraseña"
          name="repPassword"
          type={showPassword.repPassword ? 'text' : 'password'}
          placeholder="Repite nuevo password"
          value={formData.repPassword}
          onChange={handleChange}
        />
        
          <img 
            src={showPassword.repPassword ? ojoCerrado : ojoAbierto} 
            alt="Mostrar/Ocultar contraseña"
            className="eye-icon-img"
            onClick={() => changePasswordVisibility('repPassword')}
          />
      
      </div>

      {otherError && <p className="errMsg">{otherError}</p>}

      <ButtonGroupJJ>
        <ButtonJJ variant="black" onClick={onSubmit}>
          Actualizar contraseña
        </ButtonJJ>
        <ButtonJJ variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </ButtonJJ>
      </ButtonGroupJJ>
    </FormJJ>
  );
};

export default ChangePassword;
