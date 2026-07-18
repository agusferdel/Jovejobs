import { useContext, useEffect, useState } from 'react';
import { fetchAxios } from '../../../helpers/axiosHelper';
import { Cardjj } from '../../../components/Card/Card';
import { InputJJ } from '../../../components/Form/Input';
import { ButtonJJ } from '../../../components/Button/Button';
import { SelectJJ } from '../../../components/Form/Select';
import userDefault from '../../../assets/userDefault.jpg';
import { useNavigate } from 'react-router';
import { getModality } from '../../../helpers/getModality';
import { Containerjj } from '../../../components/Container/Container';
import { PageContainer } from '../../../components/PageContainer/PageContainer';
import { PageSection } from '../../../components/PageSection/PageSection';
import location from '../../../assets/location-dot-solid-full.svg';
import briefcase from '../../../assets/briefcase-solid-full.svg'
import building from '../../../assets/building-solid-full.svg'
import { AuthContext } from '../../../context/AuthContext';
import './offerPage.css';

// Generamos las opciones de modalidad dinámicamente usando el helper. 
const modalityOptions = [1, 2, 3].map(id => ({ id, name: getModality(id) }));

const initialValue = {
    offersType: '',
    modality: '',
    job: '',
    company: '',
    city: '',
}

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const [jobAreas, setJobAreas] = useState([]);
  const {token} = useContext(AuthContext);
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState();
  const [searchFilters, setSearchFilters] = useState(initialValue);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [offersRes, typesRes, jobsRes] = await Promise.all([
          fetchAxios('/offers', 'GET', null, token),
          fetchAxios('/offerType/offerTypes', 'GET', null, token),
          fetchAxios('/offers/jobs', 'GET', null, token)
        ]);
        
        setOffers(offersRes.data?.result || offersRes.data || []);
        setOfferTypes(typesRes.data?.result || typesRes.data || []);
        setJobAreas(jobsRes.data?.result || jobsRes.data || []);
      } catch (error) {
        console.log('Error cargando datos iniciales', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const onSubmit = async () => {
    setErrorsVal({});
    setOtherError();

    try {
      let url = `/offers/searchOffers?`;

      if (searchFilters.offersType.trim() !== '')
        url += `offersType=${searchFilters.offersType}&`;
      if (searchFilters.modality.trim() !== '')
        url += `modality=${searchFilters.modality}&`;
      if (searchFilters.job.trim() !== '') url += `job=${searchFilters.job}&`;
      if (searchFilters.company.trim() !== '')
        url += `company=${searchFilters.company}&`;
      if (searchFilters.city.trim() !== '')
        url += `city=${searchFilters.city}&`;

      if (url.endsWith('&') || url.endsWith('?')) {
        url = url.slice(0, -1);
      }

      if (url === '/offers/searchOffers') {
        url = '/offers';
      }

      const result = await fetchAxios(url, 'GET', null);
      setOffers(result.data?.result || result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    setSearchFilters(initialValue);
  }

  
  return (
    <PageSection variant='offers'>
      <PageContainer>
      <div className="offer-title">
        <h1 className='offer-title-words'>Ofertas de prácticas y primer empleo en empresas</h1>
      </div>
        <div className='offer-mobile-nav'>
          <Containerjj className="offer-sidebar-container">
            <section className="offer-sidebar-content">
              <div className="offer-flex gap-3 justify-content-center">
                <div className="offer-sidebar-nav">
                  <h3>Filtros</h3>
                  <SelectJJ
                    label="Tipo"
                    name="offersType"
                    value={searchFilters.offersType}
                    onChange={handleChange}
                    error={errorsVal?.offersType}
                    dbTable={offerTypes}
                    dbTableId="name" 
                    dbTableName="name"
                  />
                  <SelectJJ
                    label="Modalidad"
                    name="modality"
                    value={searchFilters.modality}
                    onChange={handleChange}
                    error={errorsVal?.modality}
                    dbTable={modalityOptions}
                    dbTableId="name" 
                    dbTableName="name"
                  />
                  <SelectJJ
                    label="Área"
                    name="job"
                    value={searchFilters.job}
                    onChange={handleChange}
                    error={errorsVal?.job}
                    dbTable={jobAreas}
                    dbTableId="name" 
                    dbTableName="name"
                  />
                  <InputJJ
                    label="Empresa"
                    name="company"
                    type="text"
                    placeholder="cualquiera"
                    value={searchFilters.company}
                    onChange={handleChange}
                    error={errorsVal?.company}
                    />
                  <InputJJ
                    label="Ciudad"
                    name="city"
                    type="text"
                    placeholder="Ciudad"
                    value={searchFilters.city}
                    onChange={handleChange}
                    error={errorsVal?.city}
                    />
                  <ButtonJJ onClick={onSubmit}>Buscar</ButtonJJ>
                  <ButtonJJ onClick={onSubmit}>Reset</ButtonJJ>
                </div>
              </div>
            </section>
          </Containerjj>
        </div>
      

      <div className="offer-layout-page">
        <aside className="offer-sidebar">
          <Containerjj className="offer-sidebar-container">
            <section className="offer-sidebar-content">
              <div className="offer-flex gap-3 justify-content-center">
                <div className="offer-sidebar-nav">
                  <h3>filtros</h3>
                  <SelectJJ
                    label="Tipo"
                    name="offersType"
                    value={searchFilters.offersType}
                    onChange={handleChange}
                    error={errorsVal?.offersType}
                    dbTable={offerTypes}
                    dbTableId="name" 
                    dbTableName="name"
                  />
                  <SelectJJ
                    label="Modalidad"
                    name="modality"
                    value={searchFilters.modality}
                    onChange={handleChange}
                    error={errorsVal?.modality}
                    dbTable={modalityOptions}
                    dbTableId="name" 
                    dbTableName="name"
                  />
                  <SelectJJ
                    label="Área"
                    name="job"
                    value={searchFilters.job}
                    onChange={handleChange}
                    error={errorsVal?.job}
                    dbTable={jobAreas}
                    dbTableId="name" 
                    dbTableName="name"
                  />
                  <InputJJ
                    label="Empresa"
                    name="company"
                    type="text"
                    placeholder="cualquiera"
                    value={searchFilters.company}
                    onChange={handleChange}
                    error={errorsVal?.company}
                    />
                  <InputJJ
                    label="Ciudad"
                    name="city"
                    type="text"
                    placeholder="Ciudad"
                    value={searchFilters.city}
                    onChange={handleChange}
                    error={errorsVal?.city}
                    />
                  <ButtonJJ onClick={reset}>Borrar filtros</ButtonJJ>
                  <ButtonJJ onClick={onSubmit}>Buscar</ButtonJJ>
                </div>
              </div>
            </section>
          </Containerjj>
        </aside>
        <div className="offer-data-grid">
          {offers &&
            offers.map((offer) => (
              <Cardjj key={offer.offer_id} className='offer-card-main'>
                <div className="offer-card">
                  <img
                    className="company-logo-profile"
                    src={
                      offer?.company_icon
                      ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${offer.company_icon}`
                      : userDefault
                    }
                    alt="Logo de empresa"
                    />
                  <h3 className="offer-card-title">{offer.title}</h3>
                  <p className="iconos-offer"> <img src={building} alt="" /> {offer.company_title}</p>
                 <p className="iconos-offer" ><img src={location} alt="localización" /> {offer.city_name}</p>
                  <p className="iconos-offer" > <img src={briefcase} alt="" /> {getModality(offer.modality)}</p>

                  <ButtonJJ variant='black' onClick={() => navigate(`/offer/${offer.offer_id}`)}>
                    Ver Oferta
                  </ButtonJJ>
                </div>
              </Cardjj>
            ))}
        </div>
      </div>

      </PageContainer>
    </PageSection>
  );
};

export default OffersPage;
