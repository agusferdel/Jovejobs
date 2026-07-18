import { useState } from 'react';
import { validateForm } from '../../../../helpers/ValidateForms';
import { fetchAxios } from '../../../../helpers/axiosHelper';
import { PasswordRecoverSchema } from '../../../../schemas/PasswordRecoverSchema';
import { FormJJ } from '../../../../components/Form/Form';
import { InputJJ } from '../../../../components/Form/Input';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router';

import "./recoverPasswordPage.css"
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';

const initialValue = {
  email: ""
}

const RecoverPasswordPage = () => {
  const [formData, setFormData] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState();
  const [error2, setError2] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  }

  const onSubmit = async() => {
    setErrorsVal({});
    setError2("");

    try {
      validateForm(PasswordRecoverSchema, formData);
      let url = "/auth/forgotPassword";
      await fetchAxios(url,"POST", formData);
      setSuccess(true)

    } catch (error) {
      if (error.errType === "validator"){
      console.log("Errores de validación");
      setErrorsVal(error);
      }
      else {
        setError2("Ha habido un error");
      }
    }
  }

  return (
    <PageSection variant='recoverPassword'>
      <PageContainer>
        <FormJJ title="Recuperación de contraseña" variant='glass'>
          {success ? (
            <div className='action-message'>
              <h5>Revisa tu correo</h5>
              <p>Te hemos enviado un enlace a {formData.email}.</p>
                <ButtonGroupJJ>
                  <ButtonJJ variant="primary" onClick={() => navigate('/login')}>
                    Volver al login
                  </ButtonJJ>
                </ButtonGroupJJ>
            </div>
          ) : (
            <>
            <InputJJ
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="Introduce tu email"
              value={formData.email}
              onChange={handleChange}
              error={errorsVal?.email}
            />
          {error2 && <p className="errMsg">{error2}</p>}
          <ButtonGroupJJ>
            <ButtonJJ type="button" variant="primary" onClick={onSubmit}>
              Enviar
            </ButtonJJ>
            <ButtonJJ type="button" variant="black" onClick={() => navigate('/login')}>
              Cancelar
            </ButtonJJ>
          </ButtonGroupJJ>
          </>
          )}
        </FormJJ>
      </PageContainer>
    </PageSection>
  )
}

export default RecoverPasswordPage