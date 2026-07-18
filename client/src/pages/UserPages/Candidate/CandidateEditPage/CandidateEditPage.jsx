import { ButtonJJ } from '../../../../components/Button/Button';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router';
import { fetchAxios } from '../../../../helpers/axiosHelper';
import { editCandidateSchema } from '../../../../schemas/EditCandidateSchema';
import { useEffect } from 'react';
import { FormJJ } from '../../../../components/Form/Form';
import { InputJJ } from '../../../../components/Form/Input';
import { TypeaheadJJ } from '../../../../components/Form/Typeahead';
import { TextAreaJJ } from '../../../../components/Form/TextArea';
import { CheckboxGroupJJ } from '../../../../components/Form/CheckboxGroup';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';
import uploadIcon from '../../../../assets/upload-solid-full.svg'
import { FileInputJJ } from '../../../../components/Form/FileInput';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup';

  const modalityOptions = [
    { id: '1', label: 'Remoto' },
    { id: '2', label: 'Presencial' },
    { id: '3', label: 'Híbrido' }
  ]

const CandidateEditPage = () => {
  const { user, setUser, token } = useContext(AuthContext);
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("")
  const [editCandidate, setEditCandidate] = useState(user);
  const [image, setImage] = useState();
  const [cv, setCv] = useState();
 

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [provinceSearchText, setProvinceSearchText] = useState("");
  const [citySearchText, setCitySearchText] = useState("");

  const navigate = useNavigate();

  // Función auxiliar para cargar ciudades (la usaremos en el useEffect y en el handle)
  const loadCities = async (provId) => {
    try {
      let res = await fetchAxios(`/city/cities-by-province/${provId}`, 'GET');
      const cities = res.data?.result || [];
      setCityOptions(cities);

      // SI EL USUARIO YA TIENE CIUDAD, LA BUSCAMOS Y SETEAMOS
      if (editCandidate?.city_id) {
        const currentCity = cities.find(c => c.city_id === editCandidate.city_id);
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

        // SI EL USUARIO YA TIENE PROVINCIA, LA BUSCAMOS EN LA LISTA Y LA SETEAMOS
        if (editCandidate?.province_id) {
          const currentProv = provinces.find(p => p.province_id === editCandidate.province_id);
          if (currentProv) {
            setSelectedProvince([currentProv]);
            // Realizamos la carga de ciudades para esa provincia
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

    const handleProvinceChange = async (items) => {

    // 1. Limpiamos errores en cuanto hay interacción
    setErrorsVal((prev) => ({ ...prev, province_id: undefined, city_id: undefined }));
    setSelectedProvince(items);

    setSelectedCity([]); // LIMPIAMOS EL COMPONENTE CIUDAD VISUALMENTE

    if (items.length > 0) {
      const choosenProvince = items[0];
      setEditCandidate({
        ...editCandidate,
        province_id: choosenProvince.province_id,
        city_id: null // RESETEAMOS EL ID DE CIUDAD EN EL OBJETO
      });
      loadCities(choosenProvince.province_id);
    } else {
      // SI NO HAY ÍTEMS (USUARIO BORRÓ O ESCRIBIÓ BASURA), ENVIAMOS "" PARA QUE EL PREPROCESS LO CONVIERTA EN NULL
      setEditCandidate({ ...editCandidate, province_id: undefined, city_id: null });
      setCityOptions([]);
    }
  };

  const handleCityChange = (items) => {
    // 1. Limpiamos errores en cuanto hay interacción
    setErrorsVal({});
    setSelectedCity(items);

    if(items.length > 0){
    const choosenCity = items[0];

     setEditCandidate({...editCandidate, city_id: choosenCity.city_id});
    }
    else{
      setEditCandidate({...editCandidate, city_id: null});
    }
  }



  const handleChange = (e) => {
    let { name, value, type, checked, files } = e.target;
    
    // Evitamos espacios en blanco en tiempo real para DNI y Código Postal
    if (name === 'zip_code' || name === 'dni_cif') {
      value = value.replace(/\s/g, ''); 
    }

       // 1. Lógica para archivos
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Validamos los tipos directamente aquí
        const allowedTypes = [
          'image/jpeg', 
          'image/png', 
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        // --- COMIENZO DE COMENTARIO SI QUISIERAMOS TESTEAR LA VALIDACIÓN DEL BACKEND ---
        
        if (!allowedTypes.includes(file.type)) {
          // Usamos el estado previo (...prev) para NO borrar el error del otro archivo si ya existía
          setErrorsVal(prev => ({ ...prev, [name]: "Formato de archivo no permitido. Revisa las extensiones válidas." }));
          e.target.value = null; // Limpiamos el input visualmente
          
          // Nos aseguramos de no guardar el archivo malo en el estado
          if (name === 'avatar') setImage(null);
          if (name === 'cv') setCv(null);
          
          return; // Cortamos la función aquí
        }
        
        // --- FIN DE COMENTARIO ---

        // Si el archivo ES VÁLIDO, limpiamos SOLO el error de ese campo en concreto
        setErrorsVal(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });

        // Si el archivo es válido, lo guardamos
        if (name === 'avatar') {
          setImage(file);
        } else if (name === 'cv') {
          setCv(file);
        }
      }
    }
  
    // 2. Lógica para checkboxes
    else if (type === 'checkbox' && name === 'modality') {
      const currentValues = editCandidate.modality ? editCandidate.modality.split(',') : [];
      let newValues;
      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter(val => val !== value);
      }
      setEditCandidate({ ...editCandidate, [name]: newValues.join(',') });
    } 
    // 3. Resto de inputs
    else {
      setEditCandidate({ ...editCandidate, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    if (e) e.preventDefault();

    // Limpiamos los errores visuales al iniciar un nuevo intento de envío
    setErrorsVal({});

    // Verificamos si el usuario dejó texto a medio escribir sin seleccionar nada válido
    const newErrors = {};

    if (provinceSearchText && provinceSearchText.trim() !== "" && selectedProvince.length === 0) {
      newErrors.province_id = "Debes seleccionar una provincia de la lista o dejar el campo vacío";
    }

    if (citySearchText && citySearchText.trim() !== "" && selectedCity.length === 0) {
      newErrors.city_id = "Debes seleccionar una ciudad de la lista";
    }

    // Si tenemos texto inválido, mostramos los errores y CORTAMOS EL SUBMIT
    if (newErrors.province_id || newErrors.city_id) {
      setErrorsVal(newErrors);
      console.error("Bloqueo manual: Texto basura detectado sin selección");
      return; 
    }
    // ---------------------------------------------------

    // --- MODIFICACIÓN: Creamos el objeto de validación limpio ---
    // Si llegamos aquí, o seleccionaron bien, o dejaron todo 100% vacío
    const stateToValidate = {
      ...editCandidate,
      province_id: selectedProvince.length > 0 ? editCandidate.province_id : null,
      city_id: selectedCity.length > 0 ? editCandidate.city_id : null,
    };

    // Ejecutamos la validación de Zod
    const result = editCandidateSchema.safeParse(stateToValidate);

    if (!result.success) {
      // Mapeamos los errores de Zod para la UI:
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrorsVal(formattedErrors);
      return; // IMPORTANTE: Aquí cortamos la ejecución si hay error
    }

    try {
      const newFormData = new FormData();
      let currentFileType = cv ? 'cv' : 'avatar';

      //Creamos la versión limpia combinando lógica de provincias con el trim de Zod
      const cleanUser = {
        ...stateToValidate,
        ...result.data
      };

      const dataToSend = {
        ...cleanUser,
        fileType: currentFileType
      };

      newFormData.append('data', JSON.stringify(dataToSend));
      if (image) newFormData.append('avatar', image);
      if (cv) newFormData.append('cv', cv);

      const res = await fetchAxios('/candidate/editUser', 'PUT', newFormData, token);

      // Lógica de éxito...
      if (res.data.avatar || res.data.cv) {
        setUser({ 
          ...cleanUser, 
          avatar: res.data.avatar || editCandidate.avatar,
          cv: res.data.cv || editCandidate.cv
        });
      } else {
        setUser(cleanUser);
      }

      navigate('/candidateProfile');

    } catch (error) {
      console.error("Error capturado en el catch:", error);

      // 1. Si el servidor nos devuelve errores de validación
      if (error.errType === 'validator') {
        setErrorsVal(error);
      } 
      // 2. Si es un error de duplicado en BD (errno 1062)
      else if (error.response?.data?.errno === 1062) {
        // Usamos setErrorsVal para que salga al lado del DNI
        setErrorsVal({
          ...errorsVal,
          dni_cif: "Este DNI ya está registrado en el sistema"
        });
      } 
      // 3. Cualquier otro error inesperado
      else {
        
        console.log("Error inesperado:", error);
        setOtherError("Ups, ha habido un error al guardar. Por favor, intenta de nuevo.");
      }
    }
  };
  
  return (
    <PageSection variant='candidate'>
      <PageContainer>
        <div className="d-flex justify-content-center">
            <FormJJ title="Edición de candidato" variant="glass" columns={2}>
              <InputJJ
                  label="Nombre*"
                  name="name"
                  type="text"
                  placeholder="Introduce nombre"
                  value={editCandidate?.name}
                  onChange={handleChange}
                  error={errorsVal?.name}
                />

              <InputJJ
                label="Apellido(s)*"
                name="lastname"
                type="text"
                placeholder="Introduce apellido(s)"
                value={editCandidate?.lastname}
                onChange={handleChange}
                error={errorsVal?.lastname}
              />             

              <InputJJ
                label="Teléfono*"
                name="phone_number"
                type="text"
                placeholder="Introduce teléfono"
                value={editCandidate?.phone_number}
                onChange={handleChange}
                error={errorsVal?.phone_number}
              />

              <InputJJ
                label="DNI"
                name="dni_cif"
                type="text"
                placeholder="Introduce DNI"
                value={editCandidate?.dni_cif || ""} 
                onChange={handleChange}
                error={errorsVal?.dni_cif}
              />

              <InputJJ
                label="Dirección"
                name="address"
                type="text"
                placeholder="Introduce dirección"
                value={editCandidate?.address || ""} 
                onChange={handleChange}
                error={errorsVal?.address}
              />

              <TypeaheadJJ
                label="Provincia"
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
                label="Ciudad"
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
                label="Código Postal"
                name="zip_code"
                type="text"
                placeholder="Introduce dirección"
                value={editCandidate?.zip_code || ""}
                onChange={handleChange}
                error={errorsVal?.zip_code}
              />

              <InputJJ
                label="LinkedIn"
                name="linkedin"
                type="text"
                placeholder="Introduce Linkedin"
                value={editCandidate?.linkedin || ""}
                onChange={handleChange}
                error={errorsVal?.linkedin}
              />

            <div className='full'>
              <TextAreaJJ
                label="Acerca de mí"
                name="about_me"
                rows="5"
                placeholder="Cuéntanos un poco sobre ti..."
                value={editCandidate?.about_me || ""}
                onChange={handleChange}
                error={errorsVal?.about_me}
              />
            </div>

            <InputJJ
              label="¿En que ciudad te gustaria trabajar?"
              name="location_pref"
              type="text"
              placeholder="¿Dónde te gustaría trabajar? (Ej: Madrid, Málaga...)"
              value={editCandidate?.location_pref || ""}
              onChange={handleChange}
              error={errorsVal?.location_pref}
            />

            <CheckboxGroupJJ
            label="Modalidades preferidas (puedes elegir varias)"
            name="modality"
            options={modalityOptions}
            value={editCandidate?.modality}
            onChange={handleChange}
            error={errorsVal?.modality}
            />

            <FileInputJJ
              label="Sube tu foto de perfil"
              name="avatar"
              hint="Formatos: JPG, PNG. Máx: 10MB."
              onChange={handleChange}
              error={errorsVal?.avatar}
              icon={<img src={uploadIcon} alt="" width="16" height="16" />}
              selectedFile={image}
            />

            <FileInputJJ
              label="Sube tu CV"
              name="cv"
              hint="Formatos: PDF, Word (DOC/DOCX), JPG, PNG. Máx: 10MB."
              onChange={handleChange}
              error={errorsVal?.cv}
              icon={<img src={uploadIcon} alt="" width="16" height="16" />}
              selectedFile={cv}
            />

              { otherError &&<p className="errMsg">{otherError}</p>}
              <div className="full">
                <ButtonGroupJJ>
                  <ButtonJJ onClick={onSubmit}>Confirmar</ButtonJJ>
                  <ButtonJJ variant="black" onClick={() => navigate(-1)}>Cancelar</ButtonJJ>
                </ButtonGroupJJ>
              </div>
         </FormJJ>
        </div>      
      </PageContainer>
    </PageSection>
  )




};

export default CandidateEditPage;
