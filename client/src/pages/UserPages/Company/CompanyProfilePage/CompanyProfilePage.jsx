import { useContext, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../../../context/AuthContext';

import userDefault from '../../../../assets/userDefault.jpg';
import './companyProfilePage.css';
import { Containerjj } from '../../../../components/Container/Container';
import { ButtonJJ } from '../../../../components/Button/Button';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';

const CompanyProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const isProfile =
    pathname.endsWith('/companyProfile') ||
    pathname.endsWith('/companyProfile/');

  const isOffers = pathname.includes('/companyProfile/offers');
  const isSettings = pathname.includes('/companyProfile/settings');
  const isSearch = pathname.includes('/companyProfile/search');
  

  return (
        <PageSection variant="company" align="start">
          <PageContainer>
            <div className="profile-company">
              <div className="company-mobile-nav">
                <ButtonJJ
                  onClick={() => navigate('.')}
                  variant={isProfile ? 'content-company' : 'white'}
                  className="mobile-nav-button"
                >
                  Perfil
                </ButtonJJ>
                <ButtonJJ
                  onClick={() => navigate('offers')}
                  variant={isOffers ? 'content-company' : 'white'}
                  className="mobile-nav-button"
                >
                  Ofertas
                </ButtonJJ>
                <ButtonJJ
                  onClick={() => navigate('settings')}
                  variant={isSettings ? 'content-company' : 'white'}
                  className="mobile-nav-button"
                >
                  Ajustes
                </ButtonJJ>

                <ButtonJJ
                  onClick={() => navigate('search')}
                  variant={isSearch ? 'content-company' : 'white'}
                  className="mobile-nav-button"
                >
                  Búsqueda
                </ButtonJJ>
              </div>
              <hr />
                <div className='btn-Offer company-mobile-nav'>
                  <ButtonJJ
                    onClick={() => navigate('/registerOffer')}
                    variant={user?.offers_left <= 0 ? 'disabled' : 'content-tertiary'}
                    className="sidebar-button"
                    disabled={user?.offers_left <= 0}
                  >
                    {user?.offers_left <= 0 ? 'No tiene ofertas disponibles' : 'Crear nueva oferta'}
                  </ButtonJJ>
                </div>

              <div className="company-layout-page">
                <aside className="company-sidebar">
                  <Containerjj className="company-sidebar-container">
                    <section className="company-sidebar-content">
                      <div className='company-flex gap-3'>
                        <img
                          className="company-logo-profile"
                          src={
                            user?.avatar
                              ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${user.avatar}`
                              : userDefault
                          }
                          alt="Logo de empresa"
                        />
                        <h4>{user?.company_title || 'Empresa'}</h4>
                      </div>

                      <div className="company-sidebar-nav">
                        <ButtonJJ
                          onClick={() => navigate('.')}
                          variant={isProfile ? 'content-company' : 'white'}
                          className="sidebar-button"
                        >
                          Perfil
                        </ButtonJJ>

                        <ButtonJJ
                          onClick={() => navigate('offers')}
                          variant={isOffers ? 'content-company' : 'white'}
                          className="sidebar-button"
                        >
                          Ofertas
                        </ButtonJJ>

                        <ButtonJJ
                          onClick={() => navigate('settings')}
                          variant={isSettings ? 'content-company' : 'white'}
                          className="sidebar-button"
                        >
                          Ajustes
                        </ButtonJJ>

                        <ButtonJJ
                          onClick={() => navigate('search')}
                          variant={isSearch ? 'content-company' : 'white'}
                          className="sidebar-button"
                        >
                          Búsqueda
                        </ButtonJJ>
                        <hr />
                        <ButtonJJ
                          onClick={() => navigate('/registerOffer')}
                          variant={user.offers_left < 1 ? 'disabled' : 'content-tertiary'}
                          className="sidebar-button"
                          disabled={user.offers_left < 1}
                        >
                          Crear nueva oferta
                        </ButtonJJ>
                      </div>
                    </section>
                  </Containerjj>
                </aside>

                <section className="company-main">
                  <Containerjj className="company-main-container">
                    <Outlet />
                  </Containerjj>
                </section>
              </div>
            </div>
    </PageContainer>
</PageSection>
  );
};

export default CompanyProfilePage;
