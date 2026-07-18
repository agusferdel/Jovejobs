import { AuthContext } from '../../../../context/AuthContext';
import { FormJJ } from '../../../../components/Form/Form';
import { InputJJ } from '../../../../components/Form/Input';
import { TypeaheadJJ } from '../../../../components/Form/Typeahead';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router';
import { useContext , useEffect, useState } from 'react';
import { fetchAxios } from '../../../../helpers/axiosHelper';
import { TextAreaJJ } from '../../../../components/Form/TextArea';
import { FileInputJJ } from '../../../../components/Form/FileInput';
import uploadIcon from '../../../../assets/upload-solid-full.svg';
import { editCompanySchema } from '../../../../schemas/EditCompanySchema';
import { validateForm } from '../../../../helpers/ValidateForms';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';

const CompanyEditPage = () => {
  const { user, setUser, token } = useContext(AuthContext);
  const [editCompany, setEditCompany] = useState(user);
  const [image, setImage] = useState();
  const [errorsVal, setErrorsVal] = useState({});
  const [otherError, setOtherError] = useState("");
  
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  
  const [provinceSearchText, setProvinceSearchText] = useState("");
  const [citySearchText, setCitySearchText] = useState("");

  const navigate = useNavigate();

  const loadCities = async (provId) => {
    try {
      let res = await fetchAxios(`/city/cities-by-province/${provId}`, 'GET');
      const cities = res.data?.result || [];
      setCityOptions(cities);

      if (editCompany?.city_id) {
        const currentCity = cities.find(c => c.city_id === editCompany.city_id);
        if (currentCity) setSelectedCity([currentCity]);
      }
    } catch (error) {
      console.log('Error cargando ciudades', error);
    }
  };

  useEffect(() => {
    const loadAllProvinces = async () => {
      try {
        let res = await fetchAxios('/province/province', 'GET');
        const provinces = res.data?.result || [];
        setProvinceOptions(provinces);

        if (editCompany?.province_id) {
          const currentProv = provinces.find(p => p.province_id === editCompany.province_id);
          if (currentProv) {
            setSelectedProvince([currentProv]);
            loadCities(currentProv.province_id);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadAllProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    let { name, value, type, files } = e.target;

    //no permito escribir espacios vacios (anulo la barra espaciadora)
    if (name === 'zip_code') {
      value = value.replace(/\s/g, '');
    }

    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        // Comprobamos si el tipo de archivo empieza por "image/"
        if (!file.type.startsWith('image/')) {
          setErrorsVal((prev) => ({ 
            ...prev, 
            [name]: "Formato no válido. Por favor, sube un archivo de imagen." 
          }));
          
          e.target.value = null; 
          setImage(null);        
          
          return; 
        }

        // Si es una imagen válida, la guardamos
        setImage(file);
        setErrorsVal((prev) => ({ ...prev, [name]: undefined }));
      }
    } else {
      setEditCompany({ ...editCompany, [name]: value });
      setErrorsVal((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleProvinceChange = async (items) => {
    setErrorsVal((prev) => ({ ...prev, province_id: undefined, city_id: undefined }));
    setSelectedProvince(items);
    setSelectedCity([]); 

    if (items.length > 0) {
      const choosenProvince = items[0];
      setEditCompany({
        ...editCompany,
        province_id: choosenProvince.province_id,
        city_id: ""
      });
      loadCities(choosenProvince.province_id);
    } else {
      setEditCompany({ ...editCompany, province_id: "", city_id: "" });
      setCityOptions([]);
    }
  };

  const handleCityChange = (items) => {
    setErrorsVal((prev) => ({ ...prev, city_id: undefined }));
    setSelectedCity(items);

    if (items.length > 0) {
      const choosenCity = items[0];
      setEditCompany({ ...editCompany, city_id: choosenCity.city_id });
    } else {
      setEditCompany({ ...editCompany, city_id: "" });
    }
  };

  const onSubmit = async () => {
    setErrorsVal({});
    setOtherError("");

    const localErrors = {};
    if (provinceSearchText && provinceSearchText.trim() !== "" && selectedProvince.length === 0) {
      localErrors.province_id = "Debes seleccionar una provincia de la lista";
    }
    if (citySearchText && citySearchText.trim() !== "" && selectedCity.length === 0) {
      localErrors.city_id = "Debes seleccionar una ciudad de la lista";
    }

    if (localErrors.province_id || localErrors.city_id) {
      setErrorsVal(localErrors);
      return;
    }

    const stateToValidate = {
      ...editCompany,
      province_id: selectedProvince.length > 0 ? editCompany.province_id : "",
      city_id: selectedCity.length > 0 ? editCompany.city_id : "",
    };

    try {
      // Guardamos el resultado de la validación 
      validateForm(editCompanySchema, stateToValidate);
      // Una vez validado extraemos los datos limpios 
      const cleanData = editCompanySchema.parse(stateToValidate);

      const newFormData = new FormData();

      newFormData.append('data', JSON.stringify(cleanData));

      if (image) {
        newFormData.append('avatar', image);
      }

      // 1. Guardamos los cambios en el backend
      let res = await fetchAxios('/company/editUser', 'PUT', newFormData, token);
      
      // 2. Volvemos a pedir los datos completos a la base de datos usando la ruta del back
      let freshUserRes = await fetchAxios('/auth/userById', 'GET', null, token); 
      
      // 3. Verificamos que llegó bien y actualizamos el Contexto 
      // El back devuelve { user, experience, study, language }, así que leemos .user
      if (freshUserRes.data && freshUserRes.data.user) {
        setUser(freshUserRes.data.user);
      } else {
        // Fallback de seguridad por si falla el GET
        setUser({ 
          ...stateToValidate, 
          avatar: res.data.avatar ? res.data.avatar : editCompany.avatar 
        });
      }

      // 4. Navegamos al perfil
      navigate('/companyProfile');

    } catch (error) {
      console.error("Error capturado en el catch:", error);
      
      if (error.errType === 'validator') {
        setErrorsVal(error);
      } 
      else if (error.response?.data?.errno === 1062) {
        setErrorsVal({
          ...errorsVal,
          email: "Este correo electrónico ya está registrado por otra empresa"
        });
      } 
      else {
        console.log("Error inesperado:", error);
        setOtherError("Ups, ha habido un error al guardar. Por favor, intenta de nuevo.");
      }
    }
  };

  return (
    <PageSection variant='company'>
      <PageContainer>

        <FormJJ title="Edición de empresa" variant='glass' columns={2}>
          <InputJJ
            label="Nombre de la empresa (razón social)*"
            name="company_title"
            type="text"
            placeholder="Introduce nombre de la empresa"
            value={editCompany?.company_title || ""}
            onChange={handleChange}
            error={errorsVal?.company_title}
          />


          <InputJJ
            label="Web de la Empresa"
            name="linkedin"
            type="text"
            placeholder="Web de la Empresa"
            value={editCompany?.linkedin || ""}
            onChange={handleChange}
            error={errorsVal?.linkedin}
          />      

          <InputJJ
            label="Dirección fiscal*"
            name="address"
            type="text"
            placeholder="Introduce su dirección"
            value={editCompany?.address || ""}
            onChange={handleChange}
            error={errorsVal?.address}
          />


          <TypeaheadJJ
            label="Provincia*"
            id="province-select-register"
            options={provinceOptions}
            selected={selectedProvince}
            onChange={handleProvinceChange}
            onInputChange={(text) => {
              setProvinceSearchText(text);
              setErrorsVal((prev) => ({ ...prev, province_id: undefined }));
            }}
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
            onInputChange={(text) => {
              setCitySearchText(text);
              setErrorsVal((prev) => ({ ...prev, city_id: undefined }));
            }}
            disabled={selectedProvince.length === 0}
            placeholder={selectedProvince.length > 0 ? 'Escribe para buscar tu ciudad' : 'Primero debes seleccionar una provincia'}
            emptyLabel="No se encontraron ciudades"
            error={errorsVal?.city_id}
          />

          <InputJJ
            label="Código Postal*"
            name="zip_code"
            type="text"
            placeholder="Código Postal"
            value={editCompany?.zip_code || ""}
            onChange={handleChange}
            error={errorsVal?.zip_code}
          />

          <div className='full'>
            <TextAreaJJ
              label="Descripción"
              name="company_description"
              value={editCompany?.company_description || ""}
              onChange={handleChange}
              rows="5"
              placeholder="Cuéntanos un poco de tu empresa..."
              error={errorsVal?.company_description}
            />
          </div>

          <InputJJ
            label="Nombre de persona de contacto*"
            name="name"
            type="text"
            placeholder="Introduce nombre de contacto"
            value={editCompany?.name || ""}
            onChange={handleChange}
            error={errorsVal?.name}
          />

          <InputJJ
            label="Apellidos de persona de contacto*"
            name="lastname"
            type="text"
            placeholder="Introduce apellido de contacto"
            value={editCompany?.lastname || ""}
            onChange={handleChange}
            error={errorsVal?.lastname}
          />

          <InputJJ
            label="Número de teléfono*"
            name="phone_number"
            type="text"
            placeholder="Introduzca su teléfono"
            value={editCompany?.phone_number || ""}
            onChange={handleChange}
            error={errorsVal?.phone_number}
          />

          <div className='full'>
            <FileInputJJ
              label="Sube foto de perfil de Empresa"
              name="avatar"
              hint="Formatos: JPG, PNG. Máx: 10MB."
              onChange={handleChange}
              error={errorsVal?.avatar}
              icon={<img src={uploadIcon} alt="" width="16" height="16" />}
              selectedFile={image}
            />
          </div>

          {otherError && <p className="errMsg">{otherError}</p>}

          <div className="full">
            <ButtonGroupJJ>
              <ButtonJJ onClick={onSubmit}>Guardar cambios</ButtonJJ>
              <ButtonJJ variant="black" onClick={() => navigate(-1)}>Cancelar</ButtonJJ>
            </ButtonGroupJJ>
          </div>
        </FormJJ>
    
      </PageContainer>
    </PageSection>
  );
}

export default CompanyEditPage;