import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { restoreUser, softDelete } from '../../../../helpers/logicDelete.js';
import {
  disabledUser,
  enabledUser,
} from '../../../../helpers/disabledHelper.js';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { InputJJ } from '../../../../components/Form/Input.jsx';
import './listCandidates.css';
import imgBloquear from '../../../../assets/bloquear.png';
import imgBorrar from '../../../../assets/borrar.png';
import imgDesbloquear from '../../../../assets/desbloquear-candado.png';
import { AuthContext } from '../../../../context/AuthContext.js';

const ListCandidateOutlet = () => {
  const { token } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const response = await fetchAxios(
          '/candidate/allCandidates',
          'GET',
          null,
          token
        );

        const data = response?.data?.result || [];

        if (data.length > 0) {
          setCandidates(data);
          setShowMessage(false);
        } else {
          setCandidates([]);
          setShowMessage(true);
        }
      } catch (err) {
        console.error(err);
        setCandidates([]);
        setShowMessage(true);
      }
    };

    if (token) loadCandidates();
  }, [token, refresh]);

  const handleDelete = async (candidateId) => {
    try {
      await softDelete(token, candidateId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al borrar el candidato:', err);
    }
  };

  const handleRestoreUser = async (candidateId) => {
    try {
      await restoreUser(token, candidateId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al restaurar el candidato:', err);
    }
  };

  const handleDisabledUser = async (candidateId) => {
    try {
      await disabledUser(token, candidateId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al deshabilitar el candidato:', err);
    }
  };

  const handleEnabledUser = async (candidateId) => {
    try {
      await enabledUser(token, candidateId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al habilitar el candidato:', err);
    }
  };

  const filteredCandidates = candidates.filter((elem) => {
    const fullName =
      `${elem.name || ''} ${elem.lastname || ''}`.toLowerCase();

    return fullName.includes(search.toLowerCase().trim());
  });

  const showNoResultsMessage =
    showMessage || (candidates.length > 0 && filteredCandidates.length === 0);

  return (
    <>
      <div className="search-bar-container">
        <InputJJ
          label="Buscar por Nombre"
          name="searchCandidate"
          placeholder="Buscar candidato por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Ciudad</th>
            <th>Modalidad</th>
            <th>Estado</th>
            <th>Candidaturas</th>
            <th className="actions-cell">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredCandidates.map((elem) => (
            <tr key={elem.user_id}>
              <td>
                {elem.name}{' '}
                <Link to={`/adminDashboard/candidateProfile/${elem.user_id}`}>
                  Ver Perfil
                </Link>
              </td>
              <td>{elem.lastname}</td>
              <td>{elem.phone_number || 'Sin teléfono'}</td>
              <td>{elem.email}</td>
              <td>{elem.city || 'No especificada'}</td>
              <td>{elem.modality_label || 'No especificada'}</td>
              <td>
                <span
                  className={
                    elem.is_disabled === 1 ? 'status-disabled' : 'status-active'
                  }
                >
                  {elem.is_disabled === 1 ? 'Deshabilitado' : 'Activo'}
                </span>
              </td>
              <td>
                {elem.applications_count || 0}{' '}
                <Link
                  to={`/adminDashboard/candidateApplications/${elem.user_id}`}
                >
                  Ver candidaturas
                </Link>
              </td>
              <td className="actions-cell">
                {elem.is_disabled === 1 ? (
                  <img
                    src={imgDesbloquear}
                    title="Habilitar candidato"
                    onClick={() => handleEnabledUser(elem.user_id)}
                    className="action-icon"
                  />
                ) : (
                  <img
                    src={imgBloquear}
                    title="Deshabilitar candidato"
                    onClick={() => handleDisabledUser(elem.user_id)}
                    className="action-icon"
                  />
                )}

                {elem.is_deleted === 0 ? (
                  <img
                    src={imgBorrar}
                    alt="Eliminar"
                    title="Eliminar Perfil"
                    onClick={() => handleDelete(elem.user_id)}
                    className="action-icon"
                  />
                ) : (
                  <span
                    title="Restaurar cuenta"
                    onClick={() => handleRestoreUser(elem.user_id)}
                    className="profile-deleted-label"
                  >
                    Cuenta eliminada
                  </span>
                )}
              </td>
            </tr>
          ))}

          {showNoResultsMessage && (
            <tr className="no-data-row">
              <td className="no-data-cell" colSpan="9">
                <div className="no-data-message">
                  {candidates.length === 0
                    ? 'No hay candidatos registrados'
                    : 'No se encontraron candidatos con ese nombre'}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ListCandidateOutlet;