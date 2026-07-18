import userDefault from '../../../../../assets/userDefault.jpg';
import Swal from 'sweetalert2';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { useNavigate } from 'react-router';
import { sortByDateDesc } from '../../../../../helpers/sortByDateDesc';
import { fetchAxios } from '../../../../../helpers/axiosHelper';
import { Cardjj } from '../../../../../components/Card/Card';
import './infoCandidate.css';
import { ButtonJJ } from '../../../../../components/Button/Button';
import { formatMonthYear } from '../../../../../helpers/formatMonthYear';
import { getModality } from '../../../../../helpers/getModality';

const InfoCandidateOutlet = () => {
  // Extraemos los datos del authcontext
  const { token, user, setUser, experience, setExperience, study, setStudy, language, setLanguage } =
    useContext(AuthContext);

  const [editExp, setEditExp] = useState(false);
  const [editStudy, setEditStudy] = useState(false);
  const [editLanguage, setEditLanguage] = useState(false);
  
  const navigate = useNavigate();

  const orderedExperience = sortByDateDesc(experience || [], 'start_month_year');
  const orderedStudy = sortByDateDesc(study || [], 'start_month_year');
  
  const deleteItem = async (type, id) => {
    try {
      let basePath = '';
      let setter = null;
      let listPath = '';

      if (type === 'experience') {
        basePath = '/experience';
        listPath = '/experience/myExperience';
        setter = setExperience;
      } else if (type === 'study') {
        basePath = '/studies';
        listPath = '/studies/myStudies';
        setter = setStudy;
      } else if (type === 'language') {
        basePath = '/languages';
        listPath = '/languages/myLanguages';
        setter = setLanguage;
      } else {
        return;
      }

      await fetchAxios(`${basePath}/del${type}/${id}`, 'DELETE', null, token);

      const resList = await fetchAxios(listPath, 'GET', null, token);
      const result = resList.data?.result || [];
      setter(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleSearching = async () => {
    const newValue = user?.is_searching === 1 ? 0 : 1;
    try {
      await fetchAxios('/candidate/updateSearching', 'PUT', { is_searching: newValue }, token);
      setUser((prev) => ({ ...prev, is_searching: newValue }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewCv = () => {
    if (!user?.cv) return;

    const cvUrl = `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${user.cv}`;
    window.open(cvUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDelCv = async (file) => {
    const result = await Swal.fire({
      title: '¿Quieres borrar tu CV?',
      text: 'Esta acción eliminará el archivo subido actualmente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      scrollbarPadding: false
    });

    if (!result.isConfirmed) return;

    try {
      await fetchAxios('/candidate/delCv', 'PUT', { file }, token);

      setUser((prev) => ({
        ...prev,
        cv: null,
      }));

      await Swal.fire({
        title: 'CV borrado',
        text: 'Tu CV se ha eliminado correctamente.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      await Swal.fire({
        title: 'Error',
        text: 'No se pudo borrar el CV.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="candidate-layout">
      <Cardjj className="candidate-header-card">
        <div className="candidate-flex">
          <div>
            <h2>Mi perfil</h2>
            <p>
              Completa tu perfil para mejorar tu visibilidad y facilitar que
              las empresas te encuentren.
            </p>
          </div>
          <p
            onClick={() => navigate('/candidateProfile/settings')}
            className={`state-profile ${user?.public_profile ? 'status-public' : 'status-off'}`}
          >
            Estado: {user?.public_profile ? 'Público' : 'Privado'}
          </p>
        </div>
      </Cardjj>

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
          <span>Ciudad: {user?.city || 'No especificada'}</span>
        </div>
        <div className="candidate-actions">
          <ButtonJJ onClick={() => navigate('/edit-candidate')} variant={'content-primary'}>
            Editar perfil
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
              <ButtonJJ variant={editExp ? 'black' : 'white'} onClick={() => setEditExp(!editExp)}>
                {editExp ? 'Cerrar' : 'Editar'}
              </ButtonJJ>
            </div>
            <div>
              {orderedExperience.length === 0 ? (
                <span>No especificado</span>
              ) : (
                orderedExperience.map((exp) => (
                  <div key={exp.experience_id}>
                    <Cardjj variant={'sub_card'} className="candidate-profile">
                      <div className="candidate-info">
                        <h4>{exp.title}</h4>
                        <span className="cl-lighter">{exp.experience_company}</span>
                        <span className="cl-lighter">
                          {formatMonthYear(exp.start_month_year)} - {exp.end_month_year ? formatMonthYear(exp.end_month_year) : 'Actualidad'}
                        </span>
                        <p className="cl-light">{exp.description}</p>
                      </div>

                      {editExp && (
                        <div className="candidate-actions-column">
                          <ButtonJJ
                            onClick={() => navigate(`/editExperience/${exp.experience_id}`)}
                            variant={'white'}
                          >
                            Editar
                          </ButtonJJ>
                          <ButtonJJ
                            onClick={() => deleteItem('experience', exp.experience_id)}
                            variant={'delete'}
                          >
                            Borrar
                          </ButtonJJ>
                        </div>
                      )}
                    </Cardjj>
                  </div>
                ))
              )}
            </div>

            {editExp && (
              <div className="candidate-add">
                <ButtonJJ
                  onClick={() => navigate('/newExperience')}
                  variant={'white'}
                >
                  +
                </ButtonJJ>
              </div>
            )}
          </Cardjj>

          <Cardjj>
            <div className="cardjj-top">
              <h3>Educación</h3>
              <ButtonJJ variant={editStudy ? 'black' : 'white'} onClick={() => setEditStudy(!editStudy)}>
                {editStudy ? 'Cerrar' : 'Editar'}
              </ButtonJJ>
            </div>
            <div>
              {orderedStudy.length === 0 ? (
                <span>No especificado</span>
              ) : (
                orderedStudy.map((st) => (
                  <div key={st.study_id}>
                    <Cardjj variant={'sub_card'} className="candidate-profile">
                      <div className="candidate-info">
                        <h4>{st.studies}</h4>
                        <span className="cl-lighter">{st.studies_center}</span>
                        <span className="cl-lighter">
                          {formatMonthYear(st.start_month_year)} - {st.end_month_year ? formatMonthYear(st.end_month_year) : 'Actualidad'}
                        </span>
                        <p className="cl-light">{st.description}</p>
                      </div>

                      {editStudy && (
                        <div className="candidate-actions-column">
                          <ButtonJJ
                            onClick={() => navigate(`/editStudy/${st.study_id}`)}
                            variant={'white'}
                          >
                            Editar
                          </ButtonJJ>
                          <ButtonJJ
                            onClick={() => deleteItem('study', st.study_id)}
                            variant={'delete'}
                          >
                            Borrar
                          </ButtonJJ>
                        </div>
                      )}
                    </Cardjj>
                  </div>
                ))
              )}
            </div>

            {editStudy && (
              <div className="candidate-add">
                <ButtonJJ onClick={() => navigate('/newStudy')} variant={'white'}>
                  +
                </ButtonJJ>
              </div>
            )}
          </Cardjj>
        </div>

        <div className="candidate-right">
          <Cardjj>
            <div className="candidate-flex">
              <h3>¿Estás buscando empleo?</h3>
              <button
                type='button'
                className={`toggle-switch ${user?.is_searching ? 'on' : 'off'}`}
                onClick={handleToggleSearching}
              />
            </div>
            
            <p className={user?.is_searching ? 'status-on' : 'status-off'}>
              Estado: {user?.is_searching ? 'En busca de empleo' : 'No disponible'}
            </p>
            <p>
              Si no indicas que buscas empleo activamente tu usuario no
              saldrá en la búsqueda de las empresas.
            </p>
          </Cardjj>

          <Cardjj>
            <div className="cardjj-top">
              <h3>CV y LinkedIn</h3>
              <span
                className={`state-profile ${user?.cv ? 'status-on' : 'status-off'}`}
                onClick={() => navigate('/edit-candidate')}
              >
                {user?.cv ? 'CV añadido' : 'CV no añadido'}
              </span>
            </div>
            <div className='candidate-flex-column'>
              <div className="candidate-flex">
                <span>Curriculum Vitae</span>
              </div>
              <div className='candidate-flex'>
                <ButtonJJ
                  variant={user?.cv ? 'content-primary' : 'disabled'}
                  onClick={handleViewCv}
                  disabled={!user?.cv}
                >
                  Ver CV
                </ButtonJJ>
                {user?.cv && (
                  <ButtonJJ
                    variant='delete'
                    onClick={() => handleDelCv(user?.cv)}
                  >
                    Borrar CV
                  </ButtonJJ>
                )}
              </div>
            </div>
            <hr />
            <div className="candidate-flex-column">
              <span>Linkedin</span>
              <Cardjj variant={'sub_card'}>
                {user?.linkedin ? (
                  <a
                    href={user?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user?.linkedin}
                  </a>
                ) : (
                  <span>No especificado</span>
                )}
              </Cardjj>
            </div>
          </Cardjj>

          <Cardjj>
            <h3>Preferencias</h3>
            <div className='candidate-flex'>
              <p className='cl-light'>Modalidad </p>
              <p className='fw-bold text-end'>{getModality(user?.modality) || 'No especificada'}</p>
            </div>
            <div className='candidate-flex'>
              <p className='cl-light'>Ubicación</p>
              <p className="fw-bold text-end">
                {user?.location_pref?.charAt(0).toUpperCase() + user?.location_pref?.slice(1) || 'No especificada'}
              </p>
            </div>
          </Cardjj>

          <Cardjj>
            <div className="cardjj-top">
              <h3>Idiomas</h3>
              <ButtonJJ variant={editLanguage ? 'black' : 'white'} onClick={() => setEditLanguage(!editLanguage)}>
                {editLanguage ? 'Cerrar' : 'Editar'}
              </ButtonJJ>
            </div>
            <div>
              {language.length === 0 ? (
                <span>No especificado</span>
              ) : (
                language.map((lang) => (
                  <div key={lang.language_id}>
                    <Cardjj variant={'sub_card'}>
                      <div className="candidate-profile">
                        <div className="candidate-info">
                          <p className='fw-bold'>
                            {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
                          </p>
                          <p>{lang.description}</p>
                        </div>
                        <p className='language-level'>{lang.level}</p>
                      </div>

                      {editLanguage && (
                        <div className="candidate-actions language-actions">
                          <ButtonJJ
                            onClick={() => navigate(`/editLanguage/${lang.language_id}`)}
                            variant={'white'}
                          >
                            Editar
                          </ButtonJJ>
                          <ButtonJJ
                            onClick={() => deleteItem('language', lang.language_id)}
                            variant={'delete'}
                          >
                            Borrar
                          </ButtonJJ>
                        </div>
                      )}
                    </Cardjj>
                  </div>
                ))
              )}

              {editLanguage && (
                <div className="candidate-add">
                  <ButtonJJ
                    onClick={() => navigate('/newLanguage')}
                    variant={'white'}
                  >
                    +
                  </ButtonJJ>
                </div>
              )}
            </div>
          </Cardjj>
        </div>
      </div>
    </div>
  );
};

export default InfoCandidateOutlet;