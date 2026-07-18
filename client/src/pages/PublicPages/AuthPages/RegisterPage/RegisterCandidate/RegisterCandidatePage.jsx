import { useState } from 'react';
import { validateForm } from '../../../../../helpers/ValidateForms';
import { registerCandidateSchema } from '../../../../../schemas/RegisterCandidateSchema';
import { fetchAxios } from '../../../../../helpers/axiosHelper';
import { Link, useNavigate } from 'react-router';
import { FormJJ } from '../../../../../components/Form/Form';
import { InputJJ } from '../../../../../components/Form/Input';
import { ButtonGroupJJ } from '../../../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../../../components/Button/Button';
import { CheckboxJJ } from '../../../../../components/Form/Checkbox';
import { PageSection } from '../../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../../components/PageContainer/PageContainer';

import ojoAbierto from '../../../../../assets/iconos/ojo-abierto.png';
import ojoCerrado from '../../../../../assets/iconos/ojo-cerrado.png';
import "../registerPage.css"


const initialValue = {
  email: "",
  repEmail: "",
  password: "",
  repPassword: "",
  name: "",
  lastname: "",
  phone_number: "",
  type: 3,
  terms: false
};

const RegisterCandidatePage = () => {
  const [registerCandidate, setRegisterCandidate] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("");
  const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
    password: false,
    repPassword: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrorsVal({});
    setOtherError("");
    const { name, value, type, checked } = e.target;
    setRegisterCandidate({
      ...registerCandidate,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const onSubmit = async () => {
    if (loading) return;

    setErrorsVal({});
    setOtherError("");

    try {
      setLoading(true);

      validateForm(registerCandidateSchema, registerCandidate);

      const url = "/auth/registerCandidate";
      await fetchAxios(url, "POST", registerCandidate);

      navigate('/validationRegister');
    } catch (error) {
      console.log(error);

      if (error.errType === "validator") {
        setErrorsVal(error);
      } else if (error.response?.data?.errno === 1062) {
        setOtherError("Email duplicado");
      } else {
        setOtherError("Ha habido un error");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (inputName) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };

  return (
    <PageSection variant='regcandidate'>
      <PageContainer>
        <FormJJ title="Registro de candidato" variant='glass'>
          <InputJJ
            label="Correo electrónico*"
            name="email"
            type="email"
            placeholder="Introduce email"
            value={registerCandidate.email}
            onChange={handleChange}
            error={errorsVal?.email}
          />
          <InputJJ
            label="Confirmar correo electrónico*"
            name="repEmail"
            type="email"
            placeholder="Repite email"
            value={registerCandidate.repEmail}
            onChange={handleChange}
            error={errorsVal?.repEmail}
          />

          <div className="input-password-wrapper">
          <InputJJ
            label="Contraseña*"
            name="password"
            type={showPassword.password ? 'text' : 'password'}
            placeholder="Mínimo 6 caracteres"
            value={registerCandidate.password}
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
            label="Confirmar contraseña*"
            name="repPassword"
            type={showPassword.repPassword ? 'text' : 'password'}
            placeholder="Repite tu contraseña"
            value={registerCandidate.repPassword}
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

          <InputJJ
            label="Nombre*"
            name="name"
            type="text"
            placeholder="Introduce nombre"
            value={registerCandidate.name}
            onChange={handleChange}
            error={errorsVal?.name}
          />
          <InputJJ
            label="Apellido(s)*"
            name="lastname"
            type="text"
            placeholder="Introduce apellido(s)"
            value={registerCandidate.lastname}
            onChange={handleChange}
            error={errorsVal?.lastname}
          />
          <InputJJ
            label="Teléfono*"
            name="phone_number"
            type="text"
            placeholder="Introduce teléfono"
            value={registerCandidate.phone_number}
            onChange={handleChange}
            error={errorsVal?.phone_number}
          />
          <CheckboxJJ
            label="Acepto la política de Privacidad y los Términos y Condiciones"
            name="terms"
            type="checkbox"
            value={registerCandidate.terms}
            onChange={handleChange}
            error={errorsVal?.terms}
          />

          {otherError && <p className="errMsg">{otherError}</p>}

          <ButtonGroupJJ>
            <ButtonJJ
              variant={registerCandidate.terms === true ? 'tertiary' : 'disabled'}
              onClick={onSubmit}
              disabled={registerCandidate.terms === false || loading}
            >
              {loading ? 'Registrando...' : 'Crear mi cuenta'}
            </ButtonJJ>

            <ButtonJJ variant="black" onClick={() => navigate(-1)}>
              Cancelar
            </ButtonJJ>
          </ButtonGroupJJ>

          <div className='d-flex flex-column align-items-center gap-2'>
            <p>
              ¿Ya estás registrado? <Link to="/login">Login aquí</Link>
            </p>
          </div>
        </FormJJ>
      </PageContainer>
    </PageSection>
  );
};

export default RegisterCandidatePage;