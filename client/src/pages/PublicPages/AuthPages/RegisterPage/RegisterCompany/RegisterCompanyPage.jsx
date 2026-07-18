import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { RegisterCompanySchema } from '../../../../../schemas/RegisterCompanySchema.js';
import { validateForm } from '../../../../../helpers/ValidateForms.js';
import { fetchAxios } from '../../../../../helpers/axiosHelper.js';
import { FormJJ } from '../../../../../components/Form/Form.jsx';
import { InputJJ } from '../../../../../components/Form/Input.jsx';
import { TypeaheadJJ } from '../../../../../components/Form/Typeahead.jsx';
import { CheckboxJJ } from '../../../../../components/Form/Checkbox.jsx';
import { ButtonGroupJJ } from '../../../../../components/Button/ButtonGroup.jsx';
import { ButtonJJ } from '../../../../../components/Button/Button.jsx';
import { PageContainer } from '../../../../../components/PageContainer/PageContainer.jsx';
import { PageSection } from '../../../../../components/PageSection/PageSection.jsx';

import ojoAbierto from '../../../../../assets/iconos/ojo-abierto.png';
import ojoCerrado from '../../../../../assets/iconos/ojo-cerrado.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "../registerPage.css"

const initialValue = {
  company_title: '',
  identification: '',
  email: '',
  repEmail: '',
  password: '',
  repPassword: '',
  name: '',
  lastname: '',
  phone_number: '',
  address: '',
  type: 2,
  terms: false,
  city_id: '',
  province_id: '',
};

const RegisterCompanyPage = () => {
  const [registerCompany, setRegisterCompany] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState('');
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    repPassword: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadAllProvinces = async() => {
      try {
        let res = await fetchAxios('/province/province', 'GET');
        setProvinceOptions(res.data?.result || []);
      } catch (error) {
        console.log(error);
        
      }
    }
    loadAllProvinces();
  }, []);

  const handleChange = (e) => {
    const { name, value ,type, checked} = e.target;
    setRegisterCompany({ ...registerCompany,  [name]: type === "checkbox" ? checked: value});
  };

  const handleProvinceChange = async(items) => {
    setSelectedProvince(items);

    if(items.length > 0){
      const choosenProvince = items[0];

      setRegisterCompany({
        ...registerCompany, 
        province_id: choosenProvince.province_id,
        city_id: ''
      })
      setSelectedCity([]);
      try {
        let res = await fetchAxios(`/city/cities-by-province/${choosenProvince.province_id}`, 'GET');
        setCityOptions(res.data?.result || []);
      } catch (error) {
        console.log('Error cargando ciudades', error);
        setCityOptions([]);
      }
    }else{
    setRegisterCompany({...registerCompany, province_id: '', city_id: ''});
    setCityOptions([]);
    setSelectedCity([]);
  };
};

  const handleCityChange = (items) => {
    setSelectedCity(items);

    if(items.length > 0){
    const choosenCity = items[0];

     setRegisterCompany({...registerCompany, city_id: choosenCity.city_id});
    }
    else{
      setRegisterCompany({...registerCompany, city_id: ''});
    }
  }

  const onSubmit = async () => {
    if (loading) {
      return;
    }

    setErrorsVal({});
    setOtherError('');

    try {
      setLoading(true);

      validateForm(RegisterCompanySchema, registerCompany);

      let url = '/auth/registerCompany';
      await fetchAxios(url, 'POST', registerCompany);

      navigate('/validationRegister');
    } catch (error) {
      if (error.validationErrors || !error.response) {
        console.log('Fallo de validación local o sin red');
        setErrorsVal(error.validationErrors || error);
        return;
      }

      if (error.response) {
        const datosDelError = error.response.data;

        if (datosDelError.errno === 1062) {
          const sqlError = datosDelError.sqlMessage || '';

          if (sqlError.toLowerCase().includes('email')) {
            setOtherError('El correo electrónico ya está registrado.');
          } else if (sqlError.toLowerCase().includes('identification')) {
            setOtherError('El NIF/CIF ya está registrado por otra empresa.');
          } else {
            setOtherError('Ya existe una empresa con algunos de estos datos.');
          }
        } else {
          setOtherError('Hubo un error en el servidor. Inténtalo más tarde.');
        }
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
    <PageSection variant='regcompany'>
      <PageContainer>
        <FormJJ title="Registro de empresa" variant='glass' columns={2}>
          <InputJJ
            label="Nombre de la empresa (razón social)*"
            name="company_title"
            type="text"
            placeholder="Introduce nombre de la empresa"
            value={registerCompany.company_title}
            onChange={handleChange}
            error={errorsVal?.company_title}
          />

          <InputJJ
            label="NIF/CIF*"
            name="identification"
            type="text"
            placeholder="Introduzca su identification"
            value={registerCompany.identification}
            onChange={handleChange}
            error={errorsVal?.identification}
          />

          <InputJJ
            label="Email*"
            name="email"
            type="text"
            placeholder="Introduzca su email"
            value={registerCompany.email}
            onChange={handleChange}
            error={errorsVal?.email}
          />

          <InputJJ
            label="Repetir Email*"
            name="repEmail"
            type="text"
            placeholder="Confirme su email"
            value={registerCompany.repEmail}
            onChange={handleChange}
            error={errorsVal?.repEmail}
          />
         <div className="input-password-wrapper">
          <InputJJ
            label="Contraseña*"
            name="password"
            type={showPassword.password ? 'text' : 'password'}
            placeholder="Introduce contraseña"
            value={registerCompany.password}
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
            placeholder="Confirma contraseña"
            value={registerCompany.repPassword}
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
            label="Nombre de persona de contacto*"
            name="name"
            type="text"
            placeholder="Introduce nombre de contacto"
            value={registerCompany.name}
            onChange={handleChange}
            error={errorsVal?.name}
          />

          <InputJJ
            label="Apellidos de persona de contacto"
            name="lastname"
            type="text"
            placeholder="Introduce apellido de contacto"
            value={registerCompany.lastname}
            onChange={handleChange}
            error={errorsVal?.lastname}
          />

          <InputJJ
            label="Número de teléfono*"
            name="phone_number"
            type="text"
            placeholder="Introduzca su teléfono"
            value={registerCompany.phone_number}
            onChange={handleChange}
            error={errorsVal?.phone_number}
          />

          <InputJJ
            label="Dirección fiscal*"
            name="address"
            type="text"
            placeholder="Introduce su dirección"
            value={registerCompany.address}
            onChange={handleChange}
            error={errorsVal?.address}
          />

          <TypeaheadJJ
            label="Provincia*"
            id="province-select-register"
            options={provinceOptions}
            selected={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="Selecciona una provincia"
            emptyLabel="No se encontraron provincias"
            error={errorsVal?.province_id}
          />

          <TypeaheadJJ
            label="Ciudad*"
            id="city-select-register"
            options={cityOptions}
            selected={selectedCity}
            onChange={handleCityChange}
            disabled={selectedProvince.length === 0}
            placeholder={selectedProvince.length > 0 ? 'Escribe para buscar tu ciudad' : 'Primero debes seleccionar una provincia'}
            emptyLabel="No se encontraron ciudades"
            error={errorsVal?.city_id}
          />

          <div className="full">
            <CheckboxJJ
              label="Acepto la política de Privacidad y los Términos y Condiciones"
              name="terms"
              type="checkbox"
              value={registerCompany.terms}
              onChange={handleChange}
              error={errorsVal?.terms}
            />
          </div>

          {otherError && <p className="errMsg">{otherError}</p>}

          <div className="full">
            <div className="full">
              <ButtonGroupJJ>
                <ButtonJJ
                  variant={registerCompany.terms === true ? 'yellow' : 'disabled'}
                  onClick={onSubmit}
                  disabled={registerCompany.terms === false || loading}
                >
                  {loading ? 'Registrando...' : 'Crear mi cuenta'}
                </ButtonJJ>
                <ButtonJJ variant="black" onClick={() => navigate(-1)}>Cancelar</ButtonJJ>
              </ButtonGroupJJ>
            </div>
          </div>
          <div className='full center'>
            <p>
              ¿Ya estás registrado? <Link to="/login">Login aquí</Link>
            </p>
          </div>
        </FormJJ>
    </PageContainer>
   </PageSection>
  );
};

export default RegisterCompanyPage;