import { useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../../context/AuthContext';
import userDefault from '../../../assets/userDefault.jpg';
import { ButtonJJ } from '../../../components/Button/Button';
import { Containerjj } from '../../../components/Container/Container';
import './adminDashboard.css';
import { PageSection } from '../../../components/PageSection/PageSection';
import { PageContainer } from '../../../components/PageContainer/PageContainer';

const AdminDashboardPage = () => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const isCompanys =
    pathname.endsWith('/adminDashboard') ||
    pathname.includes('/adminDashboard/companyProfile');

  const isCandidates =
    pathname.includes('/adminDashboard/candidates') ||
    pathname.includes('/adminDashboard/candidateProfile') ||
    pathname.includes('adminDashboard/candidateApplications');

  const isOffers =
    pathname.includes('/adminDashboard/offersAdmin') ||
    pathname.includes('/adminDashboard/offerProfile') ||
    pathname.includes('/adminDashboard/offers');

  const isPacks =
    pathname.includes('/adminDashboard/packs') ||
    pathname.includes('/adminDashboard/createPack') ||
    pathname.includes('/adminDashboard/editPack');

  const isConfigOffers = pathname.includes('/adminDashboard/configOffers');
  const isChangePassword = pathname.includes('/adminDashboard/changePassword');

  return (
    <PageSection variant='admin' align="start">
      <PageContainer>
        <div className="admin-dashboard">
          <div className="profile-mobile-nav">
            <ButtonJJ
              className="mobile-nav-button"
              variant={isCompanys ? 'sidebar-admin-active' : 'sidebar-admin'}
              onClick={() => navigate('/adminDashboard')}
            >
              Empresas
            </ButtonJJ>

            <ButtonJJ
              className="mobile-nav-button"
              variant={isCandidates ? 'sidebar-admin-active' : 'sidebar-admin'}
              onClick={() => navigate('candidates')}
            >
              Candidatos
            </ButtonJJ>

            <ButtonJJ
              className="mobile-nav-button"
              variant={isOffers ? 'sidebar-admin-active' : 'sidebar-admin'}
              onClick={() => navigate('offers')}
            >
              Ofertas
            </ButtonJJ>

            <ButtonJJ
              className="mobile-nav-button"
              variant={isPacks ? 'sidebar-admin-active' : 'sidebar-admin'}
              onClick={() => navigate('packs')}
            >
              Packs
            </ButtonJJ>

            <ButtonJJ
              className="mobile-nav-button"
              variant={isConfigOffers ? 'sidebar-admin-active' : 'sidebar-admin'}
              onClick={() => navigate('configOffers')}
            >
              Configurar Ofertas
            </ButtonJJ>

            <ButtonJJ
              className="mobile-nav-button"
              variant={isChangePassword ? 'sidebar-admin-active' : 'sidebar-admin'}
              onClick={() => navigate('changePassword')}
            >
              Cambiar Contraseña
            </ButtonJJ>
          </div>

          <div className="profile-layout">
            <aside className="profile-sidebar">
              <Containerjj className="sidebar-container">
                <section className="sidebar-content">
                  <div>
                    <img
                      className="logo-profile"
                      src={
                        user?.avatar
                          ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${user.avatar}`
                          : userDefault
                      }
                      alt="logo de perfil"
                    />
                    <h4>{user?.name}</h4>
                    <span>{user?.email} </span>
                  </div>

                  <div className="sidebar-nav">
                    <ButtonJJ
                      className="sidebar-button"
                      variant={
                        isCompanys ? 'sidebar-admin-active' : 'sidebar-admin'
                      }
                      onClick={() => navigate('.')}
                    >
                      Empresas
                    </ButtonJJ>

                    <ButtonJJ
                      className="sidebar-button"
                      variant={
                        isCandidates ? 'sidebar-admin-active' : 'sidebar-admin'
                      }
                      onClick={() => navigate('candidates')}
                    >
                      Candidatos
                    </ButtonJJ>

                    <ButtonJJ
                      className="sidebar-button"
                      variant={isOffers ? 'sidebar-admin-active' : 'sidebar-admin'}
                      onClick={() => navigate('offers')}
                    >
                      Ofertas
                    </ButtonJJ>
                    
                    <ButtonJJ
                      className="sidebar-button"
                      variant={isPacks ? 'sidebar-admin-active' : 'sidebar-admin'}
                      onClick={() => navigate('packs')}
                    >
                      Packs
                    </ButtonJJ>

                    <hr className="sidebar-divider" />

                    <ButtonJJ
                      className="sidebar-button"
                      variant={
                        isConfigOffers ? 'sidebar-admin-active' : 'sidebar-admin'
                      }
                      onClick={() => navigate('configOffers')}
                    >
                      Configurar Ofertas
                    </ButtonJJ>

                    <ButtonJJ
                      className="sidebar-button"
                      variant={
                        isChangePassword ? 'sidebar-admin-active' : 'sidebar-admin'
                      }
                      onClick={() => navigate('changePassword')}
                    >
                      Cambiar Contraseña
                    </ButtonJJ>
                  </div>
                </section>
              </Containerjj>
            </aside>

            <section className="profile-main">
              <Containerjj className="main-container">
                <h2>Hola, {user?.name}</h2>
                <Outlet context={{ token }} />
              </Containerjj>
            </section>
          </div>
        </div>
      </PageContainer>
    </PageSection>
  );
};

export default AdminDashboardPage;
