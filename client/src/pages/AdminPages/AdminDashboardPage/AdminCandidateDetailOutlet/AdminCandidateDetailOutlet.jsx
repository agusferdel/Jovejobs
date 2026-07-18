import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {fetchAxios} from '../../../../helpers/axiosHelper';
import userDefault from '../../../../assets/userDefault.jpg';
import {sortByDateDesc} from '../../../../helpers/sortByDateDesc';
import {formatMonthYear} from '../../../../helpers/formatMonthYear';
import {Cardjj} from '../../../../components/Card/Card';
import '../../../UserPages/Candidate/CandidateProfilePage/candidateProfilePage.css'
import '../../../../pages/UserPages/Candidate/CandidateProfilePage/InfoCandidate/infoCandidate.css';
import { ButtonJJ } from '../../../../components/Button/Button';
import { AuthContext } from '../../../../context/AuthContext';

const AdminCandidateDetailOutlet = () => {
  const { token } = useContext(AuthContext);
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [experience, setExperience] = useState([]);
  const [study, setStudy] = useState([]);
  const [language, setLanguage] = useState([]);
  const [candidateNotFound, setCandidateNotFound] = useState(false);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const res = await fetchAxios(`/candidate/adminGetCandidate/${candidateId}`,'GET',null,token);


         if (!res || !res.data || !res.data.user) {
          setCandidateNotFound(true);
          return;
        }

        setCandidate(res.data?.user || null);
        setExperience(res.data?.experience || []);
        setStudy(res.data?.study || []);
        setLanguage(res.data?.language || []);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 404 || error.status === 404) {
          setCandidateNotFound(true);
        }
      }
    };

    if (candidateId && token) fetchCandidateData();
  }, [candidateId, token]);

  

  const orderedExperience = sortByDateDesc(experience, 'start_month_year');
  const orderedStudy = sortByDateDesc(study, 'start_month_year');

  const handleViewCv = () => {
    if (!candidate?.cv) return;

    const cvUrl = `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${candidate.cv}`;
    window.open(cvUrl, '_blank', 'noopener,noreferrer');
  }; 

    if (candidateNotFound) {
    return <p className="loading">Candidato no encontrado</p>;
  }

  return (
    <div className="candidate-layout">
      <Cardjj className="candidate-header-card">
        <div className="candidate-flex">
          <div>
            <h2>Perfil del candidato</h2>
            <p>Visualizando el perfil del candidato seleccionado en modo administrador.</p>
          </div>

          <p className={candidate?.public_profile ? 'status-public' : 'status-off'}>
            Estado: {candidate?.public_profile ? 'Público' : 'Privado'}
          </p>
        </div>
      </Cardjj>

      <Cardjj className="candidate-card">
        <img
          className="profile-img"
          src={
            candidate?.avatar
              ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${candidate.avatar}`
              : userDefault
          }
          alt="Foto de perfil"
        />

        <div className="candidate-info">
          <h3>
            {candidate?.name} {candidate?.lastname}
          </h3>
          <span>{candidate?.is_searching ? 'En busca de empleo' : 'No disponible'}</span>
          <span>Teléfono: {candidate?.phone_number}</span>
          <span>Email: {candidate?.email}</span>
          <span>Ciudad: {candidate?.city || 'No especificada'}</span>
        </div>
        <ButtonJJ variant="content-primary" onClick={() => navigate(-1)}>
            Volver
          </ButtonJJ>
      </Cardjj>

      <div className="candidate-columns">
        <div className="candidate-left">
          <Cardjj>
            <h3>Acerca de mí</h3>
            <p>{candidate?.about_me || 'Sin descripción disponible.'}</p>
          </Cardjj>

          <Cardjj>
            <div className="cardjj-top">
              <h3>Experiencia</h3>
            </div>

            <div>
              {orderedExperience.length === 0 ? (
                <span>No especificada</span>
              ) : (
                orderedExperience.map((exp) => (
                  <div key={exp.experience_id}>
                    <Cardjj variant="subcard" className="candidate-profile">
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
                <span>No especificada</span>
              ) : (
                orderedStudy.map((st) => (
                  <div key={st.study_id}>
                    <Cardjj variant="subcard" className="candidate-profile">
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
            <p className={candidate?.is_searching ? 'status-on' : 'status-off'}>
              Estado: {candidate?.is_searching ? 'En busca de empleo' : 'No disponible'}
            </p>
          </Cardjj>

          <Cardjj>
            <div className="cardjj-top">
              <h3>CV y LinkedIn</h3>
              <span className={candidate?.cv ? 'status-on' : 'status-off'}>
                {candidate?.cv ? 'CV añadido' : 'CV no añadido'}
              </span>
            </div>

            <div className="candidate-flex-column">
              <div className="candidate-flex">
                <span>Curriculum Vitae</span>
                <ButtonJJ onClick={handleViewCv} disabled={!candidate?.cv}>
                  Ver CV
                </ButtonJJ>
              </div>

              <hr />

              <span>LinkedIn</span>
              <Cardjj variant="sub-card">
                {candidate?.linkedin ? (
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">
                    {candidate.linkedin}
                  </a>
                ) : (
                  <span>No especificado</span>
                )}
              </Cardjj>
            </div>
          </Cardjj>

          <Cardjj>
            <h3>Preferencias</h3>
            <div className="candidate-flex">
              <p className="cl-light">Modalidad</p>
              <p className="fw-bold">{candidate?.modality_label || 'No especificada'}</p>
            </div>
            <div className="candidate-flex">
              <p className="cl-light">Ubicación</p>
              <p className="fw-bold">{candidate?.location_pref || 'No especificada'}</p>
            </div>
          </Cardjj>

          <Cardjj>
            <div className="cardjj-top">
              <h3>Idiomas</h3>
            </div>

            <div>
              {language.length === 0 ? (
                <span>No especificados</span>
              ) : (
                language.map((lang) => (
                  <div key={lang.language_id}>
                    <Cardjj variant="subcard">
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
    </div>
  );
};

export default AdminCandidateDetailOutlet;