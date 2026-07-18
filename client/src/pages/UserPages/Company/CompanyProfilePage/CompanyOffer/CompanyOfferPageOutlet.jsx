import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { Cardjj } from '../../../../../components/Card/Card';
import { ButtonJJ } from '../../../../../components/Button/Button';
import { fetchAxios } from '../../../../../helpers/axiosHelper';
import { useNavigate } from 'react-router';
import { getModality } from '../../../../../helpers/getModality';
import './companyOfferPage.css';

const CompanyOfferPage = () => {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffersData = async () => {
      try {
        const userId = user?.user_id;
        if (!userId) return;

        let res = await fetchAxios(`/offers/getOfferByUserId/${userId}`, 'GET', null, null);
        setOffers(res.data);
      } catch (error) {
        console.log('Problema en la carga de ofertas', error);
      }
    };
    
    fetchOffersData();
  }, [user]);

  return (
    <div className="company-offers-layout">
      <Cardjj className="company-offers-card">
        <div className="company-offers">
          <div className="company-offers-text">
            <h2>Hola, {user?.company_title || user?.name}</h2>
            <p>
              Encuentra a tu candidato ideal y gestiona tus vacantes desde un
              panel claro y profesional.
            </p>
          </div>

          <div className="company-offers-side">
            <p className="offers-left-label">
              Publicaciones restantes: <span>{user?.offers_left}</span>
            </p>

            <ButtonJJ variant="black" onClick={() => navigate("/rates")} >Obtener más</ButtonJJ>
          </div>
        </div>
      </Cardjj>

      <Cardjj className="company-offers-info-card">
        <h2>Ofertas</h2>
        <p>
          Crea, revisa y publica vacantes con filtros, preguntas de preselección
          y mensajes automáticos.
        </p>
      </Cardjj>

      <div className="company-offers-list">
        {offers && 
          offers.map((offer) => (
            <Cardjj 
              className={`company-offer-item ${offer.is_active === 0 ? 'offer-inactive' : ''}`} 
              key={offer.offer_id}
            >
              <div className="company-offer-item-info">
                <h3>
                  {offer.title} 
                  {offer.is_active === 0 && <span className="badge-inactive"> (Inactiva)</span>}
                </h3>
                <p>{offer.city_name} · {getModality(offer.modality)} · {offer.offer_type_name}</p>
              </div>

              <div className="company-offer-item-actions">
                {offer.is_active === 1 ? <ButtonJJ variant="white" onClick={()=> navigate(`/offers/edit/${offer.offer_id}`)}>Editar</ButtonJJ> : ''}
                <ButtonJJ variant="white" onClick={() => navigate(`/offer/${offer.offer_id}`)}>Ver detalles</ButtonJJ>
              </div>
            </Cardjj>
          ))}
              {offers && offers.length === 0 && (
                <div
                className="no-data-message"
                style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}
                >
             No tienes ofertas publicadas actualmente.
          </div>
        )}
        </div>
    </div>
  );
};

export default CompanyOfferPage;
