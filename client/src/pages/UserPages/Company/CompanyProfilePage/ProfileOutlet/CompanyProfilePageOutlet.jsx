import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../../../../context/AuthContext';
import { Cardjj } from '../../../../../components/Card/Card';
import { ButtonJJ } from '../../../../../components/Button/Button';
import userDefault from '../../../../../assets/userDefault.jpg';
import './companyProfilePageOutlet.css';

const CompanyProfilePageOutlet = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="company-profile-layout">
      <Cardjj className="company-profile-header-card">
        <div className="company-profile-header">
          <div>
            <h2>Perfil de empresa</h2>
            <p>
              Edita los datos corporativos y guarda los cambios desde una sola
              pantalla.
            </p>
          </div>

          <div className="company-profile-header-actions">
            <ButtonJJ
              variant="white"
              onClick={() => navigate('/edit-company')}
            >
              Editar
            </ButtonJJ>
          </div>
        </div>
      </Cardjj>

      <div className="company-profile-top-grid">
        <Cardjj className="company-logo-card">
          <div className="company-logo-wrapper">
            <img
              className="company-main-logo"
              src={
                user?.avatar
                  ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${user.avatar}`
                  : userDefault
              }
              alt="Logo de la empresa"
            />
          </div>
        </Cardjj>

        <Cardjj className="company-description-card">
          <h3>Descripción de la empresa</h3>

          <div className="company-description-box">
            <p>
              {user?.company_description ||
                'Sin descripción disponible por el momento.'}
            </p>
          </div>
        </Cardjj>
      </div>

      <div className="company-data-grid">
        <Cardjj className="company-data-card">
          <h3>CIF</h3>
          <Cardjj variant='sub_card'><span>{user?.dni_cif}</span> </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Email de contacto</h3>
          <Cardjj variant='sub_card'><span>{user?.email}</span> </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Teléfono</h3>
          <Cardjj variant='sub_card'><span>{user?.phone_number}</span> </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Razón social</h3>
          <Cardjj variant='sub_card'><span>{user?.company_title }</span> </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Persona de contacto</h3>
          <Cardjj variant='sub_card'
            >{user?.name} {user?.lastname}
            
          </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Ciudad</h3>
          <Cardjj variant='sub_card'><span>{user?.city || 'No especificado'}</span> </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Dirección</h3>
          <Cardjj variant='sub_card'><span>{user?.address || 'No especificado'}</span> </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Código postal</h3>
          <Cardjj variant='sub_card'><span>{user?.zip_code || 'No especificado'}</span> </Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>URL página web</h3>
          <Cardjj variant='sub_card'><span>{user?.linkedin || 'No especificado'}</span> </Cardjj>
        </Cardjj>
      </div>
    </div>
  );
};

export default CompanyProfilePageOutlet;
