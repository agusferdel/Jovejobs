import { useState } from 'react';
import { validateForm } from '../../../../helpers/ValidateForms';
import { fetchAxios } from '../../../../helpers/axiosHelper';
import { PasswordResetSchema } from '../../../../schemas/PasswordResetSchema';
import { FormJJ } from '../../../../components/Form/Form';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../../components/Button/Button';
import { useNavigate, useParams } from 'react-router';
import { InputJJ } from '../../../../components/Form/Input';

import ojoAbierto from '../../../../assets/iconos/ojo-abierto.png';
import ojoCerrado from '../../../../assets/iconos/ojo-cerrado.png';
import "./resetPasswordPage.css"
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';

const initialValue = {
  password: "",
  repPassword: ""
}

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState();
  const [error2, setError2] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    repPassword: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  }

  const onSubmit = async() => {
    setErrorsVal({});
    setError2("");

    try {
      validateForm(PasswordResetSchema, formData);
      let url = `/auth/resetPassword/${token}`;
      await fetchAxios(url,"POST", formData);
      setSuccess(true)

    } catch (error) {
      console.log(error);
      
      if (error.errType === "validator"){
      console.log("Errores de validación");
      setErrorsVal(error);
      }
      else {
        setError2("El enlace no es válido o ha expirado");
      }
    }
  }

   const togglePasswordVisibility = (inputName) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };

  return (
    <PageSection variant='resetPassword'>
      <PageContainer>
        <FormJJ title="Recuperación de contraseña" variant='glass'>
          {success ? (
            <div className='action-message'>
              <h5>Contraseña actualizada</h5>
              <p>Tu contraseña se ha cambiado correctamente</p>
                <ButtonGroupJJ>
                  <ButtonJJ variant="primary" onClick={() => navigate('/login')}>
                    Ir al login
                  </ButtonJJ>
                </ButtonGroupJJ>
            </div>
          ) : (
            <>
          <div className="input-password-wrapper">
          <InputJJ
              label="Nueva contraseña"
              name="password"
              type={showPassword.password ? 'text' : 'password'}
              placeholder="Introduce nuevo password"
              value={formData.password}
              onChange={handleChange}
              error={errorsVal?.password}
            />
             <img 
              src={showPassword.password ? ojoCerrado : ojoAbierto} 
              alt="Mostrar/Ocultar contraseña"
              className="eye-icon-img" 
              onClick={() => togglePasswordVisibility('password')}
              />
            </div>

            <div className="input-password-wrapper">
            <InputJJ
              label="Repite contraseña"
              name="repPassword"
              type={showPassword.repPassword ? 'text' : 'password'}
              placeholder="Repite nuevo password"
              value={formData.repPassword}
              onChange={handleChange}
              error={errorsVal?.repPassword}
            />
             <img 
            src={showPassword.repPassword ? ojoCerrado : ojoAbierto} 
            alt="Mostrar/Ocultar contraseña"
            className="eye-icon-img" 
            onClick={() => togglePasswordVisibility('repPassword')}
             />
            </div>

          {error2 && <p className="errMsg">{error2}</p>}
          <ButtonGroupJJ>
            <ButtonJJ variant="primary" onClick={onSubmit}>
              Cambiar contraseña
            </ButtonJJ>
          </ButtonGroupJJ>
          </>
          )}
        </FormJJ>
      </PageContainer>
</PageSection>
  )
}

export default ResetPasswordPage