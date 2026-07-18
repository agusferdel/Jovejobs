import { useContext, useEffect, useState } from 'react';
import { Link} from 'react-router';
import { restoreUser, softDelete } from '../../../../helpers/logicDelete.js';
import {
  disabledUser,
  enabledUser,
} from '../../../../helpers/disabledHelper.js';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { InputJJ } from '../../../../components/Form/Input.jsx';
import './listCompanies.css';
import imgBloquear from '../../../../assets/bloquear.png';
import imgBorrar from '../../../../assets/borrar.png';
import imgDesbloquear from '../../../../assets/desbloquear-candado.png';
import { AuthContext } from '../../../../context/AuthContext.js';

const ListCompanyOutlet = () => {
  const { token } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetchAxios(
          '/company/allCompanies',
          'GET',
          null,
          token
        );
        const data = response?.data?.result || [];

        if (data.length > 0) {
          setCompanies(data);
          setShowMessage(false);
        } else {
          setCompanies([]);
          setShowMessage(true);
        }
      } catch (err) {
        console.error(err);
        setShowMessage(true);
      }
    };

    if (token) loadCompanies();
  }, [token, refresh]);

  //borrado logico de una empresa
  const handleDelete = async (companyId) => {
    try {
      await softDelete(token, companyId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al borrar la empresa:', err);
    }
  };
  //restaurar empresa eliminada
  const handleRestoreUser = async (companyId) => {
    try {
      await restoreUser(token, companyId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al restaurar la empresa:', err);
    }
  };

  const handleDisabledUser = async (companyId) => {
    try {
      await disabledUser(token, companyId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al deshabilitar la empresa:', err);
    }
  };

  const handleEnabledUser = async (companyId) => {
    try {
      await enabledUser(token, companyId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al habilitar la empresa:', err);
    }
  };

  const filteredCompanies = companies.filter((elem) =>
    elem?.company_title?.toLowerCase().includes(search.toLowerCase().trim())
  );

  const showNoResultsMessage =
    showMessage || (companies.length > 0 && filteredCompanies.length === 0);

  return (
    <>
      <div className="search-bar-container">
        <InputJJ
          label="Buscar por Nombre"
          name="searchCompany"
          placeholder="Buscar empresa por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Persona de contacto</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Provincia</th>
            <th>Estado</th>
            <th>Ofertas</th>
            <th className="actions-cell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.map((elem) => (
            <tr key={elem.user_id}>
              <td>
                <Link to={`/adminDashboard/companyProfile/${elem.user_id}`}>
                  {elem.company_title}{' '}
                </Link>
              </td>
              <td>
                {elem.name} {elem.lastname}
              </td>
              <td>{elem.email}</td>
              <td>{elem.phone_number}</td>
              <td>{elem.city || 'No especificada'}</td>
              <td>{elem.province || 'No especificada'}</td>
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
                <Link to={`offersCompany/${elem.user_id}`}>ver ofertas</Link>
              </td>
              <td className="actions-cell">
                {elem.is_disabled === 1 ? (
                  <img
                    src={imgDesbloquear}
                    title="Habilitar Empresa"
                    onClick={() => handleEnabledUser(elem.user_id)}
                    className="action-icon"
                  />
                ) : (
                  <img
                    src={imgBloquear}
                    title="Deshabilitar Empresa"
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
              <td className="no-data-cell">
                <div className="no-data-message">
                  {companies.length === 0
                    ? 'No hay Empresas registradas'
                    : 'No se encontraron empresas con ese nombre'}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ListCompanyOutlet;
