import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Cardjj } from '../../../../components/Card/Card';
import { ButtonJJ } from '../../../../components/Button/Button';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { AuthContext } from '../../../../context/AuthContext.js';
import Swal from 'sweetalert2';
import './adminPacksOutlet.css';

const AdminPacksOutlet = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [packs, setPacks] = useState([]);
  const [purchases, setPurchases] = useState([]);

  //mostrar todos los packs
  useEffect(() => {
    const fetchPacksData = async () => {
      try {
        const resPacks = await fetchAxios('/pack', 'GET', null);
        const listPacks =
          resPacks?.result ?? resPacks?.data?.result ?? resPacks?.data ?? [];
        setPacks(listPacks);
      } catch (error) {
        console.error('Error fetching packs:', error);
        setPacks([]);
      }
    };

    const fetchPurchasesData = async () => {
      try {
        const resPurchases = await fetchAxios('/purchase', 'GET', null, token);
        // Manejo de la respuesta por si viene anidada en 'data' o 'result'
        const listPurchases = resPurchases?.result ?? resPurchases?.data?.result ?? resPurchases?.data ?? [];
        setPurchases(listPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setPurchases([]);
      }
    };

    fetchPacksData();
    fetchPurchasesData();
  }, [token]);

  // Función para manejar el borrado lógico del pack
  const deletePack = async (packId) => {
      const result = await Swal.fire({
      title: '¿Eliminar pack?',
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      scrollbarPadding: false
    });

    if (!result.isConfirmed) return;

    try {
      await fetchAxios(`/pack/deletePack/${packId}`, 'PUT', null, token);

      setPacks((currentList) => {
        return currentList.filter((pack) => pack.pack_id !== packId);
      });

      await Swal.fire({
              title: 'Pack eliminado',
              text: 'El pack se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'rgb(26, 204, 35)'
            });
    } catch (error) {
      console.error('Failed to delete pack:', error);
    }
  };

  return (
    <div className="admin-packs-layout">
      <div className="admin-packs-header">
        <ButtonJJ
          variant="active"
          onClick={() => navigate('/adminDashboard/createPack')}
        >
          Crear Pack
        </ButtonJJ>
      </div>

      <h2 className="section-title">Packs</h2>

      <div className="packs-grid">
        {packs.map((pack) => (
          <Cardjj key={pack.pack_id} variant="card-pack">
            <h3>{pack.name}</h3>
            <p> {pack.included_offers} Ofertas</p>

            <div>
              <span>€ {pack.price}</span>
              <span>+ iva</span>
            </div>

            <p>{pack.description}</p>

            <div className="pack-actions">
              <ButtonJJ
                variant="active"
                onClick={() =>
                  navigate(`/adminDashboard/editPack/${pack.pack_id}`)
                }
              >
                Modificar
              </ButtonJJ>
              <ButtonJJ
                variant="black"
                onClick={() => deletePack(pack.pack_id)}
              >
                Eliminar
              </ButtonJJ>
            </div>
          </Cardjj>
        ))}
      </div>

      <div className="table-container-packs">
        <table>
          <thead>
            <tr>
              <th>Packs</th>
              <th>Empresa</th>
              <th>Precio</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase.purchase_id || index}>
                <td>{purchase.pack_name}</td>
                <td>{purchase.company_name}</td>
                <td>{purchase.price}€</td>
                <td>
                  {new Date(purchase.purchase_date).toLocaleDateString('es-ES')}
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr className="no-data-row">
                <td colSpan="4" className="no-data-cell">
                  <div className="no-data-message">
                    No hay registros de compras actualmente.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPacksOutlet;
