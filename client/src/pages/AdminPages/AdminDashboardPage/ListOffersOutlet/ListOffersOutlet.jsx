import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {fetchAxios} from '../../../../helpers/axiosHelper.js';
import {InputJJ} from '../../../../components/Form/Input.jsx';
import './listOffers.css';
import { getModality } from '../../../../helpers/getModality.js';
import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext.js';
import imgBorrar from '../../../../assets/borrar.png';
import editIcon from '../../../../assets/editar.png';

const ListOffersOutlet = () => {
  const { token } = useContext(AuthContext);

  const [offers, setOffers] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await fetchAxios('/offers/allOffers', 'GET', null, token);
        const data = response?.data || [];

        if (data.length > 0) {
          setOffers(data);
          setShowMessage(false);
        } else {
          setOffers([]);
          setShowMessage(true);
        }
      } catch (err) {
        console.error(err);
        setOffers([]);
        setShowMessage(true);
      }
    };

    if (token) loadOffers();
  }, [token, refresh]);

  const filteredOffers = offers.filter((elem) => {
    const title = elem.title?.toLowerCase() || '';
    const company = elem.company_title?.toLowerCase() || '';
    const searchText = search.toLowerCase().trim();

    return title.includes(searchText) || company.includes(searchText);
  });

  const showNoResultsMessage =
    showMessage || (offers.length > 0 && filteredOffers.length === 0);

  const handleDelete = async(offer_id,company_id) => {
    try {
      await fetchAxios(`/offers/${offer_id}/${company_id}/deactivate`, 'PUT', null,token);
      setRefresh(!refresh)
    } catch (error) {
      console.log('Error al desactivar la oferta', error);
      
    }
  }

  const handleActivate = async(offer_id,company_id) => {
    try {
      await fetchAxios(`/offers/${offer_id}/${company_id}/activate`, 'PUT', null,token);
      setRefresh(!refresh)
    } catch (error) {
      console.log('Error al activar la oferta', error);
    }
  }

  return (
    <>
      <div className="search-bar-container">
        <InputJJ
          label="Buscar por puesto o empresa"
          name="searchOffer"
          placeholder="Buscar oferta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Puesto</th>
            <th>Empresa</th>
            <th>Ciudad</th>
            <th>Modalidad</th>
            <th>Estado</th>
            <th>Candidaturas</th>
            <th className="actions-cell">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredOffers.map((elem) => (
            <tr key={elem.offer_id}>
              <td>
                <Link to={`/offer/${elem.offer_id}`}>
                  {elem.title}
                </Link>
              </td>
              <td>{elem.company_title }</td>
              <td>{elem.city_name || 'No especificada'}</td>
              <td>{getModality(elem.modality) || 'No especificada'}</td>
              <td>
                <span
                  className={
                    elem.is_active === 0 ? 'status-disabled' : 'status-active'
                  }
                >
                  {elem.is_active === 0 ? 'Inactiva' : 'Activa'}
                </span>
              </td>
              <td>
                <Link to={`/adminDashboard/offers/${elem.created_by_user_id}/${elem.offer_id}/applications`}>
                  Ver candidaturas
                </Link>
              </td>
              <td className="actions-cell">
                  {elem.is_active ? <img 
                    src={editIcon} 
                    alt="Editar" 
                    title="Editar oferta"
                    onClick={() => navigate(`/offersAdmin/edit/${elem.offer_id}`)} 
                  /> : ""}
                {elem.is_active === 1 ? (
                  <img
                    src={imgBorrar}
                    alt="Eliminar"
                    title="Desactivar oferta"
                    onClick={() => handleDelete(elem.offer_id, elem.created_by_user_id)}
                    className="action-icon"
                  />
                ) : (
                  <span
                    title="Activar oferta"
                    onClick={() => handleActivate(elem.offer_id, elem.created_by_user_id)} 
                    className="profile-deleted-label"
                  >
                    Oferta inactiva
                  </span>
                )}
              </td>
            </tr>
          ))}

          {showNoResultsMessage && (
            <tr className="no-data-row">
              <td className="no-data-cell" colSpan="6">
                <div className="no-data-message">
                  {offers.length === 0
                    ? 'No hay ofertas registradas'
                    : 'No se encontraron ofertas con esa búsqueda'}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ListOffersOutlet;