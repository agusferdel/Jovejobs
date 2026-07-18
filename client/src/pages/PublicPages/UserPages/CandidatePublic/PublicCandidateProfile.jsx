import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import userDefault from '../../../../assets/userDefault.jpg';
import { sortByDateDesc } from '../../../../helpers/sortByDateDesc';
import { formatMonthYear } from '../../../../helpers/formatMonthYear';
import {fetchAxios} from '../../../../helpers/axiosHelper';
import {Cardjj} from '../../../../components/Card/Card';
import {ButtonJJ} from '../../../../components/Button/Button';
import './publicCandidateProfile.css';
import { Containerjj } from '../../../../components/Container/Container';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';
import { getModality } from '../../../../helpers/getModality';

const PublicCandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [experience, setExperience] = useState([]);
  const [study, setStudy] = useState([]);
  const [language, setLanguage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherError, setOtherError] = useState('');

  useEffect(() => {
    const getPublicCandidateProfile = async () => {
      try {
        setLoading(true);
        setOtherError('');

        const res = await fetchAxios(`/candidate/public/${id}`, 'GET');
    
        setUser(res.data.user || null);
        setExperience(res.data.experience || []);
        setStudy(res.data.study || []);
        setLanguage(res.data.language || []);
      } catch (error) {
        console.log(error);
        if (error.response?.status === 404) {
          setOtherError('El perfil no existe o ya no está disponible.');
        } else {
          setOtherError('No se ha podido cargar el perfil. Inténtalo de nuevo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) getPublicCandidateProfile();
  }, [id]);

  const orderedExperience = sortByDateDesc(experience || [], 'start_month_year');
  const orderedStudy = sortByDateDesc(study || [], 'start_month_year');

  const handleViewCv = () => {
    if (!user?.cv) return;

    const cvUrl = `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${user.cv}`;
    window.open(cvUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <PageSection variant='candidate'>
        <PageContainer>
          <div className="candidate-layout">
            <Cardjj className="candidate-header-card">
              <h2>Cargando perfil...</h2>
              <p>Estamos recuperando la información pública del candidato.</p>
            </Cardjj>
          </div>
        </PageContainer>
      </PageSection>
    );
  }

  if (otherError) {
    return (
      <PageSection variant='candidate'>
        <PageContainer>
          <div className="candidate-layout">
            <Cardjj className="candidate-header-card">
              <h2>Perfil no disponible</h2>
              <p>{otherError}</p>
            </Cardjj>

            <div className="candidate-add">
              <ButtonJJ variant='content-primary' onClick={() => navigate(-1)}>
                Volver
              </ButtonJJ>
            </div>
          </div>
        </PageContainer>
      </PageSection>
    );
  }

  return (
    <PageSection variant='candidate'>
      <PageContainer>
        <div className="candidate-layout">
          <Containerjj variant={'public-container'} >
            <Cardjj className="candidate-card">
              <img
                className="profile-img"
                src={
                  user?.avatar
                    ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${user.avatar}`
                    : userDefault
                }
                alt="Foto de perfil"
              />
              <div className="candidate-info">
                <h3>
                  Nombre: {user?.name} {user?.lastname}
                </h3>
                <span>{user?.is_searching ? 'En busca de empleo' : 'No disponible'}</span>
                <span>Teléfono: {user?.phone_number || 'No especificado'}</span>
                <span>Email: {user?.email}</span>
              </div>
              <div className="candidate-card-action">
              <ButtonJJ variant="content-primary" onClick={() => navigate(-1)}>
                Volver
              </ButtonJJ>
            </div>
            </Cardjj>
            <div className="candidate-columns">
              <div className="candidate-left">
                <Cardjj>
                  <h3>Acerca de mí</h3>
                  <p>{user?.about_me || 'Sin descripción disponible.'}</p>
                </Cardjj>
                <Cardjj>
                  <div className="cardjj-top">
                    <h3>Experiencia</h3>
                  </div>
                  <div>
                    {orderedExperience.length === 0 ? (
                      <span>No especificado</span>
                    ) : (
                      orderedExperience.map((exp) => (
                        <div key={exp.experience_id}>
                          <Cardjj variant="sub_card" className="candidate-profile">
                            <div className="candidate-info">
                              <h4>{exp.title}</h4>
                              <span className="cl-lighter">{exp.experience_company}</span>
                              <span className="cl-lighter">
                                {formatMonthYear(exp.start_month_year)} -{' '}
                                {exp.end_month_year
                                  ? formatMonthYear(exp.end_month_year)
                                  : 'Actualidad'}
                              </span>
                              <p className="cl-light">{exp.description}</p>
                            </div>
                          </Cardjj>
                        </div>
                      ))
                    )}
                  </div>
                </Cardjj>
                <Cardjj>
                  <div className="cardjj-top">
                    <h3>Educación</h3>
                  </div>
                  <div>
                    {orderedStudy.length === 0 ? (
                      <span>No especificado</span>
                    ) : (
                      orderedStudy.map((st) => (
                        <div key={st.study_id}>
                          <Cardjj variant="sub_card" className="candidate-profile">
                            <div className="candidate-info">
                              <h4>{st.studies}</h4>
                              <span className="cl-lighter">{st.studies_center}</span>
                              <span className="cl-lighter">
                                {formatMonthYear(st.start_month_year)} -{' '}
                                {st.end_month_year
                                  ? formatMonthYear(st.end_month_year)
                                  : 'Actualidad'}
                              </span>
                              <p className="cl-light">{st.description}</p>
                            </div>
                          </Cardjj>
                        </div>
                      ))
                    )}
                  </div>
                </Cardjj>
              </div>
              <div className="candidate-right">
                <Cardjj>
                  <div className="candidate-flex">
                    <h3>¿Está buscando empleo?</h3>
          
                  </div>
                  <p className={user?.is_searching ? 'status-on' : 'status-off'}>
                    Estado: {user?.is_searching ? 'En busca de empleo' : 'No disponible'}
                  </p>
                  <p>
                    Información orientativa sobre la disponibilidad actual del candidato.
                  </p>
                </Cardjj>
                <Cardjj>
                  <div className="cardjj-top">
                    <h3>CV y LinkedIn</h3>
                    <span
                      className={`state-profile ${user?.cv ? 'status-on' : 'status-off'}`}
                    >
                      {user?.cv ? 'CV añadido' : 'CV no añadido'}
                    </span>
                  </div>
                  <div className="candidate-flex-column">
                    <div className="candidate-flex">
                      <span>Curriculum Vitae</span>
                    </div>
                    <div className="candidate-flex">
                      <ButtonJJ
                        variant={user?.cv ? 'content-primary' : 'disabled'}
                        onClick={handleViewCv}
                        disabled={!user?.cv}
                      >
                        Ver CV
                      </ButtonJJ>
                    </div>
                  </div>
                  <hr />
                  <div className="candidate-flex-column">
                    <span>LinkedIn</span>
                    <Cardjj variant="sub-card">
                      {user?.linkedin ? (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                          {user.linkedin}
                        </a>
                      ) : (
                        'No especificado'
                      )}
                    </Cardjj>
                  </div>
                </Cardjj>
                <Cardjj>
                  <h3>Preferencias</h3>
                  <div className="candidate-flex">
                    <p className="cl-light">Modalidad</p>
                    <p className="fw-bold">{getModality(user?.modality) || 'No especificada'}</p>
                  </div>
                  <div className="candidate-flex">
                    <p className="cl-light">Ubicación</p>
                    <p className="fw-bold">{user?.location_pref?.charAt(0).toUpperCase() + user?.location_pref?.slice(1) || 'No especificada'}</p>
                  </div>
                </Cardjj>
                <Cardjj>
                  <div className="cardjj-top">
                    <h3>Idiomas</h3>
                  </div>
                  <div>
                    {language.length === 0 ? (
                      <span>No especificado</span>
                    ) : (
                      language.map((lang) => (
                        <div key={lang.language_id}>
                          <Cardjj variant="sub_card">
                            <div className="candidate-profile">
                              <p className="fw-bold">
                                {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
                              </p>
                              <p className="language-level">{lang.level}</p>
                            </div>
                            <p>{lang.description}</p>
                          </Cardjj>
                        </div>
                      ))
                    )}
                  </div>
                </Cardjj>
              </div>
            </div>
            
          </Containerjj>
        </div>
      </PageContainer>
    </PageSection>
  );
};

export default PublicCandidateProfile;