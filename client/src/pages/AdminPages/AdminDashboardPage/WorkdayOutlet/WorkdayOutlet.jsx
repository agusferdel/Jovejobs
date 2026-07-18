import { useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  updateWorkdayApi,
  deleteWorkdayApi,
} from '../../../../helpers/workdayHelper.js';

import editIcon from '../../../../assets/editar.png';
import deleteIcon from '../../../../assets/borrar.png';
import saveIcon from '../../../../assets/guardar-el-archivo.png';
import cancelIcon from '../../../../assets/cancelar.png';

const WorkdayOutlet = () => {
  const { workdayTypes, setWorkdayTypes, token } = useOutletContext();

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [showMessage] = useState(workdayTypes && workdayTypes.length === 0);

  const startEdit = (elem) => {
    setEditingId(elem.workday_type_id);
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
  const deleteWorkday = async (id) => {
    try {
      await deleteWorkdayApi(id, token);
      setWorkdayTypes(
        workdayTypes.filter((item) => item.workday_type_id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // editar tipo de contrato
  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateWorkdayApi(id, editName, token);
      setWorkdayTypes(
        workdayTypes.map((item) =>
          item.workday_type_id === id ? { ...item, name: editName } : item
        )
      );
      cancelEdit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Si no hay datos en el array */}
      {showMessage && (
        <div className="no-data-message">
          No hay tipos de jornadas registradas
        </div>
      )}

      {/* si hay datos */}
      {!showMessage && (
        <table>
          <thead>
            <tr>
              <th>Jornadas</th>
              <th className="actions-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {workdayTypes.map((elem) => (
              <tr key={elem.workday_type_id}>
                {editingId !== elem.workday_type_id ? (
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
                        alt="Eliminar"
                        onClick={() => deleteWorkday(elem.workday_type_id)}
                      />
                    </td>
                  </>
                ) : (
                  <>
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
                        onClick={() => saveEdit(elem.workday_type_id)}
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
      )}
    </>
  );
};

export default WorkdayOutlet;
