import { Cardjj } from '../../../../../components/Card/Card';
import { ButtonJJ } from '../../../../../components/Button/Button';
import './companySettingPage.css';
import { useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { softDelete } from '../../../../../helpers/logicDelete';

const CompanySettingPage = () => {
  const { logout, setUser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    <div className="company-settings-layout">
      <Cardjj className="company-settings-header-card">
        <div className="company-settings-header">
          <h2>Ajustes</h2>
          <p>Gestiona tu cuenta y las notificaciones.</p>
        </div>
      </Cardjj>

      <div className="company-settings-grid">
        <div className="company-settings-side">
          <Cardjj className="company-settings-session-card">
            <h3>Sesión</h3>

            <div className="company-settings-buttons">
              <ButtonJJ variant="white" onClick={handleLogout}>
                Cerrar sesión
              </ButtonJJ>
              <ButtonJJ
                variant="white"
                onClick={() => navigate('/companyProfile/changePassword')}
              >
                Cambiar contraseña
              </ButtonJJ>
            </div>
          </Cardjj>

          <Cardjj className="company-settings-delete-card">
            <div className="company-settings-buttons">
              <ButtonJJ variant="delete" onClick={handleDeleteAccount}>
                Eliminar cuenta
              </ButtonJJ>
            </div>
          </Cardjj>
        </div>
      </div>
    </div>
  );
};

export default CompanySettingPage;
