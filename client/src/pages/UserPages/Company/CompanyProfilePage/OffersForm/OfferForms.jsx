import {  useState ,useContext, useEffect } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { fetchAxios } from '../../../../../helpers/axiosHelper';
import { FormJJ } from '../../../../../components/Form/Form';
import { InputJJ } from '../../../../../components/Form/Input';
import { SelectJJ } from '../../../../../components/Form/Select';
import { TypeaheadJJ } from '../../../../../components/Form/Typeahead';
import { validateForm } from '../../../../../helpers/ValidateForms';
import { NewOfferSchema } from '../../../../../schemas/NewOfferSchema';
import { TextAreaJJ } from '../../../../../components/Form/TextArea';
import { useNavigate } from 'react-router';
import './offerForm.css';
import { PageSection } from '../../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../../components/PageContainer/PageContainer';
import { ButtonGroupJJ } from '../../../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../../../components/Button/Button';
import Swal from 'sweetalert2';

const initialOfferValue = {
  title:'',
  job_id:'',
  modality:'',
  offer_type_id:'',
  workday_type_id:'',
  description:'',
  province_id: '',
  city_id: '',
  company_title:'',
}

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

const OfferForms = () => {
  const {user, jobs, token, setUser} = useContext(AuthContext);
  const [dataJobs, setDataJobs] = useState(initialOfferValue);
  const [errorsVal, setErrorsVal] = useState();
  const [otroErr, setOtroErr] = useState('');
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [workDayOptions, setWorkDayOptions] = useState([]);
  const [offerOptions, setOfferOptions] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        // 1. Si no es una empresa (tipo 2), fuera de aquí
        if (Number(user.type) !== 2) {
          navigate('/');
        } 
        // 2. Si es empresa pero no tiene ofertas
        else if (user.offers_left <= 0) {
          Swal.fire({
            title: 'Sin ofertas disponibles',
            text: 'Has agotado tu cupo de publicaciones. Adquiere un nuevo pack para continuar.',
            icon: 'warning',
            confirmButtonText: 'Ver tarifas',
            confirmButtonColor: '#5f206b',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/rates');
            } else {
              navigate('/companyProfile');
            }
          });
        }
      }

      const loadAllProvinces = async() => {
        try {
          let res = await fetchAxios('/province/province', 'GET');
          setProvinceOptions(res.data?.result || []);
          let resWorkDay = await fetchAxios('/workdayType/workdayTypes', 'GET');
          setWorkDayOptions(resWorkDay.data?.result || []);
          let resOffer = await fetchAxios('/offerType/offerTypes', 'GET');
          setOfferOptions(resOffer.data?.result || []);
        } catch (error) {
          console.log(error);
        }
      }
      loadAllProvinces();
    }, [user, navigate]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setDataJobs({...dataJobs, [name]: value})
  };

    const handleProvinceChange = async(items) => {
    setSelectedProvince(items);

    if(items.length > 0){
      const choosenProvince = items[0];

      setDataJobs({
        ...dataJobs, 
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
    setDataJobs({...dataJobs, province_id: '', city_id: ''});
    setCityOptions([]);
    setSelectedCity([]);
  };
};

  const handleCityChange = (items) => {
    setSelectedCity(items);

    if(items.length > 0){
    const choosenCity = items[0];

     setDataJobs({...dataJobs, city_id: choosenCity.city_id});
    }
    else{
      setDataJobs({...dataJobs, city_id: ''});
    }
  }

  const onSubmit = async() => {
    setErrorsVal({});
    setOtroErr('');

    const companyName = user?.company_title ? user.company_title.trim() : '';
    const dataToValidate = {
      ...dataJobs,
      company_title: companyName
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
      
      let res = await fetchAxios('/offers/newOffer', 'POST', payload, token);

      if (res?.data?.user) {
        setUser({
          ...user,
          offers_left: res.data.user.offers_left
        });
      }
      
      setDataJobs(initialOfferValue);
      navigate('/offers');
    } catch (error) {
      console.error("Error completo:", error);
      
      if (error.errType === 'validator' || error.company_title) {
        setErrorsVal(error); 
      }
    }
};

  // Evitar renderizado breve si no tiene ofertas
  if (!user || Number(user.type) !== 2 || user.offers_left <= 0) return null;

  return (
    <PageSection variant='offers'>
      <PageContainer>
        <FormJJ title="Añadir oferta de empleo" variant='glass' columns={2}>

          <InputJJ
          label="Cargo*"
          name="title"
          type='text'
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
              placeholder={selectedProvince.length > 0 ? 'Escribe para buscar tu ciudad' : 'Primero debe seleccionar una provincia'}
              emptyLabel="No se encontraron ciudades"
              error={errorsVal?.city_id}
            />

          <div className='full'>
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

          { otroErr &&<p className="errMsg">{otroErr}</p>}
          <div className="full">
            <ButtonGroupJJ>
              <ButtonJJ onClick={onSubmit}>Guardar Cambios</ButtonJJ>
              <ButtonJJ variant="black" onClick={() => navigate(-1)}>Cancelar</ButtonJJ>
            </ButtonGroupJJ>
          </div>
        </FormJJ>
      </PageContainer>
    </PageSection>
  );
};

export default OfferForms;
