import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../../context/AuthContext.js';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { FormJJ } from '../../../../components/Form/Form.jsx';
import { InputJJ } from '../../../../components/Form/Input.jsx';
import { SelectJJ } from '../../../../components/Form/Select.jsx';
import { TypeaheadJJ } from '../../../../components/Form/Typeahead.jsx';
import { validateForm } from '../../../../helpers/ValidateForms.js';
import { NewOfferSchema } from '../../../../schemas/NewOfferSchema.js';
import { TextAreaJJ } from '../../../../components/Form/TextArea.jsx';
import { useNavigate, useParams } from 'react-router';
import './offerEditPage.css';
import { PageSection } from '../../../../components/PageSection/PageSection.jsx';
import { PageContainer } from '../../../../components/PageContainer/PageContainer.jsx';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup.jsx';
import { ButtonJJ } from '../../../../components/Button/Button.jsx';
import NotFoundPages from '../../../PublicPages/NotFoundPages/NotFoundPages.jsx';

const OfferEditPage = () => {
  const { id } = useParams();
  const { user, jobs, token } = useContext(AuthContext);

  const [dataJobs, setDataJobs] = useState({
    created_by_user_id: '',
    title: '',
    job_id: '',
    modality: '',
    offer_type_id: '',
    workday_type_id: '',
    description: '',
    province_name: '',
    city_name: '',
    company_title: '',
  });

  const modality = [
  {
    id:1,
    name: "Remoto"
  },
  {
    id:2,
    name: "Presencial"
  },
  {
    id:3,
    name: "Híbrido"
  },
]

  const [errorsVal, setErrorsVal] = useState({});
  const [otroErr, setOtroErr] = useState('');
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [workDayOptions, setWorkDayOptions] = useState([]);
  const [offerOptions, setOfferOptions] = useState([]);
   const [offerNotFound, setOfferNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFormDataAndOffer = async () => {
      try {
        const resProv = await fetchAxios('/province/province', 'GET', null, token);
        const provinces = resProv.data?.result || [];
        setProvinceOptions(provinces);
 
        const resWorkDay = await fetchAxios('/workdayType/workdayTypes', 'GET', null, token);
        setWorkDayOptions(resWorkDay.data?.result || []);
 
        const resOffer = await fetchAxios('/offerType/offerTypes', 'GET', null, token);
        setOfferOptions(resOffer.data?.result || []);

        const resSingleOffer = await fetchAxios(`/offers/${id}`, 'GET', null, token);
        const offer = resSingleOffer.data?.result || resSingleOffer.data;

         if (!resSingleOffer || !offer || Object.keys(offer).length === 0) {
          setOfferNotFound(true);
          return;
        }
 
        if (offer) {
          setDataJobs({
            ...dataJobs, //Mantenemos lo que tenga
            created_by_user_id: offer.created_by_user_id,
            title: offer.title || '',
            job_id: offer.job_id || '',
            modality: offer.modality || '',
            offer_type_id: offer.offer_type_id || '',
            workday_type_id: offer.workday_type_id || '',
            description: offer.description || '',
            company_title: offer.company_title || '',
          });

          const matchedProvince = provinces.find(p => Number(p.province_id) === Number(offer.province_id));
          if (matchedProvince) {
            setSelectedProvince([matchedProvince]);
            const resCities = await fetchAxios(`/city/cities-by-province/${offer.province_id}`, 'GET');
            const cities = resCities.data?.result || [];
            setCityOptions(cities);
            const matchedCity = cities.find(c => c.city_id === offer.city_id);
            if (matchedCity) setSelectedCity([matchedCity]);
          }
        }
      } catch (error) {
        console.error('Error cargando los datos de edición:', error);
         if (error.response?.status === 404 || error.status === 404) {
          setOfferNotFound(true);
        }
      }
    };
    if (id) loadFormDataAndOffer();
  }, [id, token]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataJobs({ ...dataJobs, [name]: value });
    if (errorsVal[name]) setErrorsVal({ ...errorsVal, [name]: undefined });
  };
 
  const handleProvinceChange = async (items) => {
    setSelectedProvince(items);
    if (errorsVal.province_id) setErrorsVal({ ...errorsVal, province_id: undefined });
    if (items.length > 0) {
      const choosenProvince = items[0];
      setDataJobs({ ...dataJobs, province_name: choosenProvince.province_name, city_name: '' });
      setSelectedCity([]);
      try {
        let res = await fetchAxios(
          `/city/cities-by-province/${choosenProvince.province_id}`,
          'GET'
        );
        setCityOptions(res.data?.result || []);
      } catch (error) {
        console.log('Error cargando ciudades', error);
        setCityOptions([]);
      }
    } else {
      setDataJobs({ ...dataJobs, province_name: '', city_name: '' });
      setCityOptions([]);
      setSelectedCity([]);
    }
  };
 
  const handleCityChange = (items) => {
    setSelectedCity(items);
    if (errorsVal.city_id) setErrorsVal({ ...errorsVal, city_id: undefined });
    if (items.length > 0) {
      setDataJobs({ ...dataJobs, city_name: items[0].city_name });
    } else {
      setDataJobs({ ...dataJobs, city_name: '' });
    }
  };
 
  const onSubmit = async () => {
    setErrorsVal({});
    setOtroErr('');
    const companyName = user?.company_title ? user.company_title.trim() : '';
    const dataToValidate = {
      ...dataJobs,
      province_id: selectedProvince[0]?.province_id || 0,
      city_id: selectedCity[0]?.city_id || 0,
      company_title: companyName,
    };
    try {
      validateForm(NewOfferSchema, dataToValidate);
      const payload = {
        title: dataToValidate.title,
        job_id: Number(dataToValidate.job_id),
        company_title: dataToValidate.company_title,
        modality: Number(dataToValidate.modality),
        offer_type_id: Number(dataToValidate.offer_type_id),
        workday_type_id: Number(dataToValidate.workday_type_id),
        description: dataToValidate.description,
        province_id: Number(dataToValidate.province_id),
        city_id: Number(dataToValidate.city_id),
        is_active: 1,
      };
     
 
      // Cambiamos el método a 'PUT' para efectuar la actualización en tu base de datos
      // Modifica la URL según tu enrutador del Backend (ej: `/offers/edit/${id}`)
      if (user.type === 1){
        await fetchAxios(`/offers/edit/${id}/${dataJobs?.created_by_user_id}`, 'PUT', payload, token);
      } else {

        await fetchAxios(`/offers/edit/${id}`, 'PUT', payload, token);
      }
      
      navigate(-1);
    } catch (error) {
      console.error("Error completo en la edición:", error);
      if (error.errType === 'validator' || error.company_title) setErrorsVal(error);
    }
  };

   if (offerNotFound) {
   navigate("/not-found")
  }
 
  if (!dataJobs.created_by_user_id === user.user_id){
    return <NotFoundPages/>
  }else{
  return (
  <PageSection variant="offers">
    <PageContainer>
      {dataJobs.created_by_user_id === user.user_id || user.type === 1 ? (
        <FormJJ title="Edición oferta de empleo" variant="glass" columns={2}>
          <InputJJ
            label="Cargo*"
            name="title"
            type="text"
            placeholder="Introduce el cargo a desarrollar"
            value={dataJobs.title}
            onChange={handleChange}
            error={errorsVal?.title}
          />

          <SelectJJ
            label="Área de trabajo*"
            name="job_id"
            value={dataJobs.job_id}
            onChange={handleChange}
            dbTable={jobs}
            dbTableId="job_id"
            dbTableName="name"
            error={errorsVal?.job_id}
          />

          <SelectJJ
            label="Modalidad de trabajo*"
            name="modality"
            value={dataJobs.modality}
            onChange={handleChange}
            dbTable={modality}
            dbTableId="id"
            dbTableName="name"
            error={errorsVal?.modality}
          />

          <SelectJJ
            label="Tipo de contrato*"
            name="offer_type_id"
            value={dataJobs.offer_type_id}
            onChange={handleChange}
            dbTable={offerOptions}
            dbTableId="offer_type_id"
            dbTableName="name"
            error={errorsVal?.offer_type_id}
          />

          <SelectJJ
            label="Tipo de jornada*"
            name="workday_type_id"
            value={dataJobs.workday_type_id}
            onChange={handleChange}
            dbTable={workDayOptions}
            dbTableId="workday_type_id"
            dbTableName="name"
            error={errorsVal?.workday_type_id}
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
            placeholder={
              selectedProvince.length > 0
                ? 'Escribe para buscar tu ciudad'
                : 'Primero debe seleccionar una provincia'
            }
            emptyLabel="No se encontraron ciudades"
            error={errorsVal?.city_id}
          />

          <div className="full">
            <TextAreaJJ
              label="Descripción del puesto (Máximo 10.000 caracteres)"
              name="description"
              rows="10"
              placeholder="Introduzca una descripción del puesto"
              value={dataJobs.description}
              onChange={handleChange}
              error={errorsVal?.description}
            />
          </div>

          {otroErr && <p className="errMsg">{otroErr}</p>}

          <div className="full">
            <ButtonGroupJJ>
              <ButtonJJ onClick={onSubmit}>Guardar Cambios</ButtonJJ>
              <ButtonJJ variant="black" onClick={() => navigate(-1)}>
                Cancelar
              </ButtonJJ>
            </ButtonGroupJJ>
          </div>
        </FormJJ>
      ) : (
       <h1>Cargando...</h1>
      )}
    </PageContainer>
  </PageSection>
)};
};
 
export default OfferEditPage;
 
