import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Cardjj } from '../../../../components/Card/Card.jsx';
import userDefault from '../../../../assets/userDefault.jpg';
import '../../../UserPages/Company/CompanyProfilePage/ProfileOutlet/companyProfilePageOutlet.css';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { AuthContext } from '../../../../context/AuthContext.js';

const AdminCompanyDetailOutlet = () => {
  const { token } = useContext(AuthContext);
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId || !token) return;
      try {
        const res = await fetchAxios(`/company/adminGetCompany/${companyId}`, 'GET', null, token);
         setCompany(res.data?.result[0]) 
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanyData();
  }, [companyId, token]);

  return (
    <div className="company-profile-layout">
      <Cardjj className="company-profile-header-card">
        <div className="company-profile-header">
          <div>
            <h2>Ficha de Empresa: {company?.company_title} </h2>
            <p>
              Visualizando los datos corporativos de la empresa seleccionada en
              modo administrador.
            </p>
          </div>
        </div>
      </Cardjj>

      <div className="company-profile-top-grid">
        <Cardjj className="company-logo-card">
          <div className="company-logo-wrapper">
            <img
              className="company-main-logo"
              src={
                company?.avatar
                  ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${company.avatar}`
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
              {company?.company_description ||
                'Sin descripción disponible por el momento.'}
            </p>
          </div>
        </Cardjj>
      </div>

      <div className="company-data-grid">
        <Cardjj className="company-data-card">
          <h3>CIF</h3>
          <Cardjj variant='sub_card'><span>{company?.dni_cif } </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Email de contacto</h3>
          <Cardjj variant='sub_card'><span>{company?.email} </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Teléfono</h3>
          <Cardjj variant='sub_card'><span>{company?.phone_number} </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Razón social</h3>
          <Cardjj variant='sub_card'><span>{company?.company_title } </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Persona de contacto</h3>
          <Cardjj variant='sub_card'><span>{`${company?.name } ${company?.lastname}`.trim()} </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Ciudad</h3>
          <Cardjj variant='sub_card'><span>{company?.city} </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Dirección</h3>
          <Cardjj variant='sub_card'><span>{company?.address || 'No especificado'} </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>Código postal</h3>
          <Cardjj variant='sub_card'><span>{company?.zip_code || 'No especificado'} </span></Cardjj>
        </Cardjj>

        <Cardjj className="company-data-card">
          <h3>URL página web</h3>
          <Cardjj variant='sub_card'><span>{company?.linkedin || 'No especificado'} </span></Cardjj>
        </Cardjj>
      </div>
    </div>
  );
};

export default AdminCompanyDetailOutlet;
