import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import userDefault from '../../../../assets/userDefault.jpg';
import { AuthContext } from '../../../../context/AuthContext.js';
import './offerView.css';
import { PageSection } from '../../../../components/PageSection/PageSection.jsx';
import { PageContainer } from '../../../../components/PageContainer/PageContainer.jsx';
import { ButtonJJ } from '../../../../components/Button/Button.jsx';
import Swal from 'sweetalert2';

const OfferView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const { user, token } = useContext(AuthContext);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = async () => {
    try {
      await fetchAxios(`/offers/${id}/apply`, 'POST', null, token);
      setIsApplied(true);
    } catch (error) {
      console.error('Error al postularse', error);
    }
  };

  // Nueva lógica para eliminar candidatura
  const handleDeleteApplication = async () => {
    try {
      await fetchAxios(`/offers/delApplication/${id}`, 'DELETE', null, token);
      setIsApplied(false);
    } catch (error) {
      console.error('Error al eliminar la candidatura:', error);
    }
  };

  const handleDelete = async () => {
  const result = await Swal.fire({
    title: '¿Eliminar oferta?',
    text: 'Esta acción desactivará la oferta y no podrás revertirla.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    reverseButtons: true,
    scrollbarPadding: false
  });

  if (!result.isConfirmed) return;

  try {
    await fetchAxios(`/offers/${id}/deactivate`, 'PUT', null, token);

    await Swal.fire({
      title: 'Oferta eliminada',
      text: 'La oferta se ha desactivado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });

    navigate('/companyProfile/offers');
  } catch (error) {
    console.error('Error al eliminar', error);

    await Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar la oferta.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
};

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        // Esta línea lleva ${id} porque queremos los datos de UNA oferta específica, no de todas.
        let res = await fetchAxios(`/offers/${id}`, 'GET', null, null);

        // Si devuelve el objeto directo { }, usamos res.data
        setOffer(res.data);
      } catch (error) {
        console.log('Error al cargar los detalles de la oferta', error);
        setOffer(false);
      }
    };

    // 2. Comprobar si el candidato actual ya está inscrito
    const checkApplicationStatus = async () => {
      try {
        let res = await fetchAxios(`/offers/${id}/is-applied`, 'GET', null, token);

        // Asumiendo que el backend responde algo como { isApplied: true }
        if (res.data && res.data.isApplied) {
          setIsApplied(true);
        }
      } catch (error) {
        console.log('Error al verificar si ya está inscripto', error);
      }
    };

    fetchOfferDetails();

    // Solo verificamos la inscripción si hay usuario, es candidato (tipo 3) y tenemos el token
    if (user && Number(user.type) === 3 && token) {
      checkApplicationStatus();
    }
  }, [id, user, token]);

  /* if (offer === null) return <p className="loading">Cargando detalles de la oferta...</p>;
  */

  const getModality = (modalityId) => {
    const modalities = { 1: 'Remoto', 2: 'Presencial', 3: 'Híbrido' };
    return modalities[modalityId];
  };

  const renderActionButtons = () => {
    // 1. Si no hay usuario logueado -> Mensaje de registro
    if (!user) {
      return (
        <div className="register-prompt">
          <p>¿Te interesa esta oferta y aún no estás registrado?</p>
          <Link to="/registerCandidate" className="register-link">
            Regístrate aquí
          </Link>
        </div>
      );
    }

    // Convertimos a número para evitar fallos si el dato llega como string ("2" vs 2)
    const userType = Number(user.type);

    // 2. Rol Candidato (user_type === 3) -> Botón Postular
    if (userType === 3) {
      return (
        <ButtonJJ
          variant={isApplied ? 'delete' : 'active'}
          onClick={isApplied ? handleDeleteApplication : handleApply}
        >
          {isApplied ? 'Eliminar candidatura' : 'Postularme ahora'}
        </ButtonJJ>
      );
    }

    // 3. Rol Empresa (user_type === 2)
    if (userType === 2 && offer.is_active === 1) {
      // SOLO si es la empresa que CREÓ la oferta ve los botones de gestión
      if (user.user_id === offer.created_by_user_id) {
        return (
          <div className="offer-actions-company">
            <div className="offer-actions-company">
              <ButtonJJ variant="delete" onClick={handleDelete}>
                Eliminar oferta
              </ButtonJJ>
              <ButtonJJ variant="content-secondary" onClick={() => navigate(`/offers/edit/${id}`)}>
                Modificar Oferta
              </ButtonJJ>
            </div>

            <div>
              <ButtonJJ variant="content-offer" onClick={() => navigate(`/applications/${id}/candidates`)}>
                Ver candidatos
              </ButtonJJ>
            </div>
          </div>
        );
      }
      // Si es una empresa pero la oferta es de otro, no sale nada
    }

    return null;
  };

  return (
    <PageSection variant="offers">
      <PageContainer>
     { offer ?  <div className={`offer-view-container ${offer.is_active === 1 ? '' : 'offer-view-container-inactive'}`}>
          <section className="offer-header-orange">
            <div>
              <h1>{offer.title}</h1>
              <p className="offer-header-line">
                <span className={offer.is_active === 1 ? 'offer-status-active' : 'offer-status-inactive'}>
                  {offer.is_active === 1 ? 'Oferta laboral activa' : 'Oferta inactiva'}
                </span>
                <span className="offer-header-separator">·</span>
                <span>{offer.workday_type_name}</span>
                <span className="offer-header-separator">·</span>
                <span>Modalidad {getModality(offer.modality)}</span>
              </p>
            </div>
            <div className='butn'>
              <ButtonJJ variant='black' onClick={()=> navigate(-1)}>Volver</ButtonJJ>
            </div>
          </section>

          <section className="offer-company-info">
            <img
              className="company-logo"
              src={
                offer.company_icon
                  ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${offer.company_icon}`
                  : userDefault
              }
              alt="Logo de la empresa"
            />

            <div className="company-titles">
              <h2>{offer.company_title}</h2>
              <p>{offer.company_description || 'Empresa colaboradora'}</p>
            </div>

            <ButtonJJ
              variant="black"
              onClick={() => navigate(`/company/public/${offer.created_by_user_id}`)}
            >
              Ver empresa
            </ButtonJJ>
          </section>

          <section className="offer-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Ubicación</span>
              <span className="meta-value">
                {offer.city_name}, {offer.province_name}
              </span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Tipo de contrato</span>
              <span className="meta-value">{offer.offer_type_name}</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Publicado</span>
              <span className="meta-value">
                {new Date(offer.date).toLocaleDateString()}
              </span>
            </div>
          </section>

          <section className="offer-description">
            <h3>Descripción del puesto</h3>
            <p>{offer.description}</p>
          </section>

          <div className="actions-container">
            {renderActionButtons()}
          </div>
        </div> : <p className="loading">Oferta no encontrada</p> }
        
      </PageContainer>
    </PageSection>
  );
};

export default OfferView;