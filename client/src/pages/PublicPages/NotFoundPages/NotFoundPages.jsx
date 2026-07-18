import { useNavigate } from 'react-router';
import './notFoundPages.css';
import { ButtonJJ } from '../../../components/Button/Button';

const NotFoundPages = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-content">
      <span className="notfound-code">404</span>
      <h1 className="notfound-title">Página no encontrada</h1>
      <p className="notfound-text">
        La URL que buscas no existe o ha sido movida.
      </p>
      <ButtonJJ
        variant='primary'
        onClick={() => navigate('/')}>
          Volver al inicio
      </ButtonJJ>
    </div>
  );
};

export default NotFoundPages;