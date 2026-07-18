import { useContext, useState } from 'react';
import { updateJobApi, deleteJobApi } from '../../../../helpers/JobHelper.js';
import editIcon from '../../../../assets/editar.png';
import deleteIcon from '../../../../assets/borrar.png';
import saveIcon from '../../../../assets/guardar-el-archivo.png';
import cancelIcon from '../../../../assets/cancelar.png';
import { AuthContext } from '../../../../context/AuthContext.js';

const JobOutlet = () => {
  const { jobs, setJobs, token } = useContext(AuthContext);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const hasData = jobs && jobs.length > 0;

  const startEdit = (elem) => {
    setEditingId(elem.job_id);
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
  const deleteJob = async (id) => {
    try {
      // Pasamos el id y el token al helper que nos mandaste
      await deleteJobApi(id, token);
      

      setJobs(jobs.filter((item) => item.job_id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // editar tipo de contrato
  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateJobApi(id, editName, token);
      
      setJobs(jobs.map((item) => item.job_id === id ? { ...item, name: editName } : item));
      cancelEdit();
    } catch (error) {
      console.log(error);
    }
  };

  if (!hasData) {
    return (
      /* Si NO hay elementos en la lista, mostramos el mensaje de aviso */
      <div className="no-data-message">
        No hay Areas de trabajo registradas
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Areas</th>
          <th className="actions-cell">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* Si hay elementos en el array, los pintamos con el map */}
        {jobs.map((elem) => (
          <tr key={elem.job_id}>
            {/* mostrar areas */}
            {editingId !== elem.job_id ? (
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
                    onClick={() => deleteJob(elem.job_id)} 
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
                    onClick={() => saveEdit(elem.job_id)} 
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

export default JobOutlet;
