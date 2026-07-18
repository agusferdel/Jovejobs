import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { AuthContext } from '../../../../context/AuthContext.js';
import { validateForm } from '../../../../helpers/ValidateForms.js';
import { RegisterLoginSchema } from '../../../../schemas/RegisterLoginSchema.js';
import { FormJJ } from '../../../../components/Form/Form.jsx';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup.jsx';
import { ButtonJJ } from '../../../../components/Button/Button.jsx';
import { InputJJ } from '../../../../components/Form/Input.jsx';
import { PageSection } from '../../../../components/PageSection/PageSection.jsx';
import { PageContainer } from '../../../../components/PageContainer/PageContainer.jsx';
import ojoAbierto from '../../../../assets/iconos/ojo-abierto.png';
import ojoCerrado from '../../../../assets/iconos/ojo-cerrado.png';
import logo from '../../../../assets/logo.svg';
import './LoginPage.css'

const initialValue = {
  email: '',
  password: '',
};


const LoginPage = () => {
  const [loginData, setLoginData] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState();
  const [errLogin, setErrLogin] = useState('');
  const [showPassword, setShowPassword] = useState(false)

  const { setUser, setToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const onSubmit = async () => {
    setErrLogin('');
    setErrorsVal('');
    try {
      validateForm(RegisterLoginSchema, loginData);
      let url = '/auth/login';
      let res = await fetchAxios(url, 'POST', loginData);

      //guardo el token en el localStorage
      let tokenDelBack = res.data.token;
      localStorage.setItem('token', tokenDelBack);

      //pedir los datos del usuario
      let urlUser = '/auth/userById';
      let resUser = await fetchAxios(urlUser, 'GET', null, tokenDelBack);
      
      setUser(resUser.data.user);
      setToken(tokenDelBack);
    } catch (error) {
      console.log(error.response);
      if (error.status === 401) {
        setErrLogin(error.response.data.message);
      } else if (error.errType === 'validator') {
        console.log(error);
        setErrorsVal(error);
      } else {
        setErrLogin('Ups, ha habido algun error');
      }
    }
  };

 const togglePasswordVisibility = (inputName) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };

  return (
    
      <PageSection variant="login">
        <PageContainer>
          <FormJJ title="Bienvenido de nuevo a" variant='glass'>
            <div className="welcome">
              <img src={logo}/>
              <p>Accede a tu cuenta para continuar.</p>
            </div>
            <InputJJ
              label="Correo electrónico"
              name="email"
              type="text"
              placeholder="Introduce email"
              value={loginData.email}
              onChange={handleChange}
              error={errorsVal?.email}
            />
            <div className="input-password-wrapper">
            <InputJJ
              label="Contraseña"
              name="password"
              type={showPassword.password ? 'text' : 'password'}
              placeholder="Introduce password"
              value={loginData.password}
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


            {errLogin && <p className="errMsg">{errLogin}</p>}
            <ButtonGroupJJ>
              <ButtonJJ onClick={onSubmit}>Acceder</ButtonJJ>
              <ButtonJJ variant="black" onClick={() => navigate(-1)}>Cancelar</ButtonJJ>
            </ButtonGroupJJ>
            <div className='register'>
              <p>
                ¿Aún no tienes cuenta? <Link to="/register">Regístrate gratis</Link>
              </p>
              <p>
                <Link to="/recoverPassword">¿Has olvidado tu contraseña?</Link>
              </p>
            </div>
          </FormJJ>
          </PageContainer>
        </PageSection>
  
  );
};

export default LoginPage;
