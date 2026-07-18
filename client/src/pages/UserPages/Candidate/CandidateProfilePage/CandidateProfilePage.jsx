import { useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../../../context/AuthContext';

import userDefault from '../../../../assets/userDefault.jpg';
import './candidateProfilePage.css';
import { Containerjj } from '../../../../components/Container/Container';
import { ButtonJJ } from '../../../../components/Button/Button';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';

const CandidateProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const isProfile =
    pathname.endsWith('/candidateProfile') ||
    pathname.endsWith('/candidateProfile/');

  const isApplications = pathname.includes('/candidateProfile/applications');
  const isSettings = pathname.includes('/candidateProfile/settings');

  return (
    <PageSection variant="candidate" align="start">
      <PageContainer>
        <div className="profile-candidate">
          <div className="profile-mobile-nav">
            <ButtonJJ
              onClick={() => navigate('.')}
              variant={isProfile ? 'content-primary' : 'white'}
              className="mobile-nav-button"
            >
              Perfil
            </ButtonJJ>

            <ButtonJJ
              onClick={() => navigate('applications')}
              variant={isApplications ? 'content-primary' : 'white'}
              className="mobile-nav-button"
            >
              Candidaturas
            </ButtonJJ>

            <ButtonJJ
              onClick={() => navigate('settings')}
              variant={isSettings ? 'content-primary' : 'white'}
              className="mobile-nav-button"
            >
              Ajustes
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
                      alt="Foto de perfil"
                    />
                  </div>

                  <h4>{user?.name}</h4>

                  <div className="sidebar-nav">
                    <ButtonJJ
                      onClick={() => navigate('.')}
                      variant={isProfile ? 'content-primary' : 'white'}
                      className="sidebar-button"
                    >
                      Perfil
                    </ButtonJJ>

                    <ButtonJJ
                      onClick={() => navigate('applications')}
                      variant={isApplications ? 'content-primary' : 'white'}
                      className="sidebar-button"
                    >
                      Candidaturas
                    </ButtonJJ>

                    <ButtonJJ
                      onClick={() => navigate('settings')}
                      variant={isSettings ? 'content-primary' : 'white'}
                      className="sidebar-button"
                    >
                      Ajustes
                    </ButtonJJ>
                  </div>
                </section>
              </Containerjj>
            </aside>

            <section className="profile-main">
              <Containerjj className="main-container">
                <Outlet />
              </Containerjj>
            </section>
          </div>
        </div>
      </PageContainer>
    </PageSection>
  );
};

export default CandidateProfilePage;
