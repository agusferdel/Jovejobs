import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { updateOfferTypeApi, deleteOfferTypeApi } from '../../../../helpers/OfferTypeHelper.js';

// ENGLISH IMPORT NAMES FOR YOUR DOWNLOADED ICONS
import editIcon from '../../../../assets/editar.png';
import deleteIcon from '../../../../assets/borrar.png';
import saveIcon from '../../../../assets/guardar-el-archivo.png';
import cancelIcon from '../../../../assets/cancelar.png';

const OfferTypeOutlet = () => {
  const { offerTypes, setOfferTypes, token } = useOutletContext();

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const hasData = offerTypes && offerTypes.length > 0;

  const startEdit = (elem) => {
    setEditingId(elem.offer_type_id);
    setEditName(elem.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleEditChange = (e) => {
    setEditName(e.target.value);
  };

  // eliminar tipo de contrato
  const deleteOfferType = async (id) => {
    try {
      await deleteOfferTypeApi(id, token);
      setOfferTypes(offerTypes.filter((item) => item.offer_type_id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // editar tipo de contrato
  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateOfferTypeApi(id, editName, token);
      setOfferTypes(offerTypes.map((item) => item.offer_type_id === id ? { ...item, name: editName } : item));
      cancelEdit();
    } catch (error) {
      console.log(error);
    }
  };

  if (!hasData) {
    return (
      /* Si NO hay elementos en la lista, mostramos el mensaje de aviso */
      <div className="no-data-message">
        No hay tipos de contrato registrados.
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Tipo de contrato</th>
          <th className="actions-cell">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* Si hay elementos en el array, los pintamos con el map */}
        {offerTypes.map((elem) => (
          <tr key={elem.offer_type_id}>
            {/* mostrar tipo de contrato */}
            {editingId !== elem.offer_type_id ? (
              <>
                <td>{elem.name}</td>
                <td className="actions-cell">
                  <img 
                    src={editIcon} 
                    alt="Editar" 
                    onClick={() => startEdit(elem)} 
                  />
                  <img 
                    src={deleteIcon} 
                    alt="Borrar" 
                    onClick={() => deleteOfferType(elem.offer_type_id)} 
                  />
                </td>
              </>
            ) : (
              <>
                {/* mostrar input edición de tipo de contrato según id */}
                <td>
                  <input
                    type="text"
                    value={editName}
                    onChange={handleEditChange}
                  />
                </td>
                <td className="actions-cell">
                  <img 
                    src={saveIcon} 
                    alt="Guardar" 
                    onClick={() => saveEdit(elem.offer_type_id)} 
                  />
                  <img 
                    src={cancelIcon} 
                    alt="Cancelar" 
                    onClick={cancelEdit} 
                  />
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OfferTypeOutlet;
