import { useEffect, useState, useRef } from 'react';
import { fetchAxios } from '../../../../helpers/axiosHelper';
import { FormJJ } from '../../../../components/Form/Form';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../../components/Button/Button';
import { useNavigate, useParams } from 'react-router';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';
import "./activatePage.css"

const ActivatePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const hasActivated = useRef(false);

  useEffect(() => {
    if (hasActivated.current) return;
    hasActivated.current = true;

    const activate = async () => {
      try {
        if (!token) {
          setError("No se ha encontrado el token de activación");
          return;
        }

        await fetchAxios(`/auth/activate/${token}`, "GET");
        setSuccess(true);
      } catch (err) {
        console.log(err.response?.data || err);

        setError(
          err.response?.data?.message || 'El enlace no es válido o ha expirado'
        );
      }
    };

    activate();
  }, [token]);

  return (
    <PageSection variant='login'>
      <PageContainer>
        <FormJJ title="Activación de cuenta" variant='glass'>
          {success ? (
            <div className='action-message'>
              <h5>¡Cuenta activada!</h5>
              <p>Tu cuenta se ha activado correctamente.</p>
              <ButtonGroupJJ>
                <ButtonJJ variant="primary" onClick={() => navigate('/login')}>
                  Ir al login
                </ButtonJJ>
              </ButtonGroupJJ>
            </div>
          ) : error ? (
            <div>
              <p className="errMsg">{error}</p>
              <ButtonGroupJJ>
                <ButtonJJ variant="primary" onClick={() => navigate('/login')}>
                  Volver al login
                </ButtonJJ>
              </ButtonGroupJJ>
            </div>
          ) : (
            <p>Activando tu cuenta...</p>
          )}
        </FormJJ>
      </PageContainer>
    </PageSection>
  );
};

export default ActivatePage;