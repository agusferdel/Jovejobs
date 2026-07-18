import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../../../context/AuthContext';
import Swal from 'sweetalert2';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { fetchAxios } from '../../../../helpers/axiosHelper';

import { updateCompanyOffers } from '../../../../services/pack.service.js';

import './PackOptionsPage.css';
import { ButtonJJ } from '../../../../components/Button/Button.jsx';
import logo from '../../../../assets/logo.svg';

const PackOptionsPage = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [packs, setPacks] = useState([]);

  useEffect(() => {
    const fetchPacksData = async () => {
      try {
        const res = await fetchAxios('/pack', 'GET', null, token);
        setPacks(res.data.result);
      } catch (error) {
        console.error('Error al traer los packs desde /pack:', error);
      }
    };

    fetchPacksData();
  }, [token]);

  const refreshUserData = async () => {
    try {
      const res = await fetchAxios('/auth/userById', 'GET', null, token);
      setUser(res.data.user);
    } catch (error) {
      console.error('Error al refrescar datos tras la compra:', error);
    }
  };

  const handlePackAction = async (pack) => {
  if (!user) {
    navigate('/registerCompany');
    return;
  }

  if (user.type === 3) {
    const result = await Swal.fire({
      title: 'Acceso restringido',
      text: 'Para adquirir o comenzar un pack debes estar registrado como empresa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ir al perfil',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#fc3fd9',
      cancelButtonColor: '#6c757d',
      scrollbarPadding: false
    });

    if (result.isConfirmed) {
      navigate('/candidateProfile');
    }
    return;
  }

  if (user.type !== 2) {
    return;
  }

  try {
    await updateCompanyOffers(pack, token);
    await refreshUserData();

    await Swal.fire({
      title: '¡Compra completada!',
      text: `Se han añadido ${pack.included_offers} ofertas a tu cuenta correctamente.`,
      icon: 'success',
      confirmButtonText: 'Ver mis ofertas',
      confirmButtonColor: '#6c2dea',
     
      scrollbarPadding: false
    });

    navigate('/companyProfile/offers');
  } catch (error) {
    console.error('Error en la transacción:', error);
    
    await Swal.fire({
      title: 'Hubo un problema',
      text: error.message || 'No se pudo procesar la transacción.',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d33',
    });
  }
};




  const getCardClass = (index) => {
    const remainder = index % 3;
    if (remainder === 0) return 'pack-card-light';
    if (remainder === 1) return 'pack-card-dark';
    return 'pack-card-yellow';
  };

  const getButtonClass = (index) => {
    const remainder = index % 3;
    if ( remainder ===2) return 'white';
    return 'black';
  };

  return (
    <PageSection variant="packs">
      <PageContainer>
        <div className="pack-page-wrapper">
          <h2 className="pack-page-title">
            Elige el plan de  <img src={logo}/>  adecuado para ti
          </h2>

          <div className="pack-cards-container">
            {packs.map((pack, index) => (
              <div
                key={pack.pack_id}
                className={`pack-card ${getCardClass(index)}`}
              >
                <h2>{pack.name}</h2>
                <p className="pack-subtitle">
                  Bono {pack.included_offers}{' '}
                  {pack.included_offers === 1 ? 'Oferta' : 'Ofertas'}
                </p>

                <div className="pack-price">
                  <span className="price-amount">
                    €{pack.price}
                  </span>
                </div>

                <p className="pack-tax">+IVA</p>
                <p className="pack-desc">{pack.description}</p>

                <ButtonJJ
                  variant={getButtonClass(index)}
                   onClick={() => handlePackAction(pack)}
                >
                  {user && user.type === 2 ? 'Comprar' : 'Comenzar'}
                </ButtonJJ>
                <div className="pack-features-list">
                  <span>✓ Nº de ofertas: {pack.included_offers}</span>
                  <span>✓ Redacción Oferta</span>
                  <span>✓ Publicación de Oferta</span>
                  <span>✓ Entrevista a Candidatos</span>
                  <span>✓ Seguimiento de Candidatos</span>
                </div>
              </div>
            ))}
         <p>Los precios indicados no incluyen IVA. Cada plan tiene una validez de 12 meses desde la fecha de compra y permite publicar las ofertas indicadas durante ese periodo. No se aplican tarifas adicionales ni comisiones sobre las contrataciones. JoveJobs se reserva el derecho de actualizar o modificar las tarifas, siempre informando previamente a los usuarios. En los bonos de ofertas puedes elegir libremente entre ofertas de prácticas o de empleo junior, combinándolas como prefieras.</p> 
         </div>
          
        </div>
      </PageContainer>
    </PageSection>
  );
};

export default PackOptionsPage;
