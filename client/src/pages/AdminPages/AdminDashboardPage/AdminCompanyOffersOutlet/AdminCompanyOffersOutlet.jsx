import { useContext, useEffect, useState } from 'react';
import { Cardjj } from '../../../../components/Card/Card';
import { ButtonJJ } from '../../../../components/Button/Button';
import { fetchAxios } from '../../../../helpers/axiosHelper';
import { useNavigate, useParams } from 'react-router';
import '../../../UserPages/Company/CompanyProfilePage/CompanyOffer/companyOfferPage.css';
import { AuthContext } from '../../../../context/AuthContext';

const getModality = (modalityId) => {
  if (modalityId === 1) return 'Remoto';
  if (modalityId === 2) return 'Presencial';
  if (modalityId === 3) return 'Híbrido';
  return 'No especificado';
};

const AdminCompanyOffersOutlet = () => {
  const { token } = useContext(AuthContext);
  const params = useParams();
  const companyId = params.companyId;

  const [offers, setOffers] = useState([]);
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOffers = await fetchAxios(
          `/offers/offersCompany/${companyId}`,
          'GET',
          null,
          token
        );
        const listOffers =
          resOffers?.result ??
          resOffers?.data?.result ??
          resOffers?.data ??
          resOffers ??
          [];
        setOffers(listOffers);
      } catch (error) {
        console.error(error);
        setOffers([]);
      }

      try {
        const resUser = await fetchAxios(
          `/company/adminGetCompany/${companyId}`,
          'GET',
          null,
          token
        );
        const datosUser =
          resUser?.result ?? resUser?.data?.result ?? resUser?.data ?? resUser;
        setUserData(datosUser);
      } catch (error) {
        console.error(error);
        setUserData([]);
      }
    };
    fetchData();
  }, [companyId, token]);

  // funcion para cambiar estado de la oferta de activo a inactivo o viceversa
  const changeOfferStatus = async (offerId, currentStatus) => {
    const isActive = currentStatus === 1;
    const endpointAction = isActive ? 'deactivate' : 'activate';
    const nextStatus = isActive ? 0 : 1;

    try {
      await fetchAxios(
        `/offers/${offerId}/${companyId}/${endpointAction}`,
        'PUT',
        null,
        token
      );

      setOffers((currentList) => {
        return currentList.map((offer) => {
          if (offer.offer_id !== offerId) return offer;

          return {
            ...offer,
            is_active: nextStatus,
          };
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="company-offers-layout">
      <Cardjj className="company-offers-info-card">
        <h2>Ofertas de la Empresa</h2>
        {userData[0] ? (
          <>
            <h3>{userData[0].company_title}</h3>
            <p>
              <strong>Contacto:</strong> {userData[0].name}{' '}
              {userData[0].lastname}
            </p>
            <p>
              <strong>Email:</strong> {userData[0].email}
            </p>
            <p>
              <strong>Teléfono:</strong> {userData[0].phone_number}
            </p>
          </>
        ) : (
          <p>Cargando datos de la empresa...</p>
        )}
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
                  {offer.is_active === 0 && (
                    <span className="badge-inactive"> (Inactiva)</span>
                  )}
                  {offer.is_active === 1 && (
                    <span className="badge-active"> (Activa)</span>
                  )}
                </h3>
                <p>
                  {offer.city_name} · {getModality(offer.modality)} ·{' '}
                  {offer.offer_type_name}
                </p>
              </div>

              <div className="company-offer-item-actions">
                <ButtonJJ
                  variant={offer.is_active === 1 ? 'delete' : 'active'}
                  onClick={() =>
                    changeOfferStatus(offer.offer_id, offer.is_active)
                  }
                >
                  {offer.is_active === 1 ? 'Desactivar' : 'Activar'}
                </ButtonJJ>
                <ButtonJJ variant="black"
                onClick={() => navigate (`/offersAdmin/edit/${offer.offer_id}`)}
                >Editar
                  
                </ButtonJJ>
                <ButtonJJ
                  variant="white"
                  onClick={() => navigate(`/offer/${offer.offer_id}`)}
                >
                  Ver detalles
                </ButtonJJ>
              </div>
            </Cardjj>
          ))}

        {offers && offers.length === 0 && (
          <div
            className="no-data-message"
            style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}
          >
            Esta empresa no tiene ofertas publicadas actualmente.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanyOffersOutlet;
