import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../../../context/AuthContext';
import { Cardjj } from '../../../../../components/Card/Card';
import { ButtonJJ } from '../../../../../components/Button/Button';
import { softDelete } from '../../../../../helpers/logicDelete';
import { fetchAxios } from '../../../../../helpers/axiosHelper';
import './candidateProfileSettings.css';


const CandidateProfileSettingsOutlets = () => {
  // Extraemos los datos del authcontext
  const { user, setUser, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
    const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  const handleTogglePrivacy = async () => {
    const newValue = user?.public_profile === 1 ? 0 : 1;

    try {
      await fetchAxios(
        '/candidate/updatePrivacy',
        'PUT',
        { public_profile: newValue },
        token
      );
      setUser((prev) => ({ ...prev, public_profile: newValue }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar cuenta?',
      text: 'Esta acción es irreversible. Tu cuenta quedará eliminada.',
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
      await softDelete(token);

      await Swal.fire({
        title: 'Cuenta eliminada',
        text: 'Tu cuenta se ha eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      localStorage.removeItem('token');

      setUser(null);
      navigate('/login');
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo eliminar la cuenta.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <>
      <div className="candidate-layout">
        <Cardjj className="candidate-header-card">
          <div>
            <h2>Ajustes</h2>
            <p>Gestiona tu cuenta y la visibilidad de tu perfil.</p>
          </div>
        </Cardjj>
        {/* TARJETA PRINCIPAL DEL USUARIO SETTINGS*/}
        <div className="candidate-columns">
          <div className="candidate-left">
            <Cardjj>
              <h3>Privacidad</h3>
              <div className="candidate-flex-column">
                <div className="candidate-flex">
                  <div>
                    <h5>¿Quieres que se vea tu perfil?</h5>
                    <p>
                      Lo podrán ver las empresas cuando tu perfil esté visible.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch ${user?.public_profile ? 'on' : 'off'}`}
                    onClick={handleTogglePrivacy}
                  />
                </div>
                <div>
                  <p>
                    Si tu perfil es público, tendrás más posibilidades de
                    encontrar trabajo. Las empresas podrán acceder a tu
                    perfil cuando hayas aplicado a sus
                    ofertas.
                  </p>
                  <p>Link público del perfil</p>
                </div>
                <Cardjj variant="sub-card">{`${import.meta.env.VITE_CLIENT_URL}/candidate/public/${user.user_id}`}</Cardjj>
                <ButtonJJ variant="white" onClick={()=> navigate(`/candidate/public/${user.user_id}`)}>Ir a perfil público</ButtonJJ>
              </div>
            </Cardjj>
          </div>
          {/* SESIÓN */}
          <div className="candidate-right">
            <Cardjj>
              <h3>Sesión</h3>
              <div className="candidate-flex-column">
                <ButtonJJ variant={'white'} onClick={handleLogout}>Cerrar sesión</ButtonJJ>
                <ButtonJJ
                  variant={'white'}
                  onClick={() => navigate('/candidateProfile/changePassword')}
                >
                  Cambiar contraseña
                </ButtonJJ>
              </div>
            </Cardjj>
            <Cardjj variant="card-delete">
              <div className="candidate-flex-column align-items-center">
                <div className="">
                  <p className="delete-count">Acción irreversible</p>
                </div>
                <div>
                  <p>
                    Esta acción es irreversible. Se eliminarán tus datos,
                    aplicaciones y documentos asociados a tu cuenta.
                  </p>
                </div>
                <div>
                  <ButtonJJ variant="delete" onClick={handleDeleteAccount}>
                    Eliminar cuenta
                  </ButtonJJ>
                </div>
              </div>
            </Cardjj>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateProfileSettingsOutlets;
