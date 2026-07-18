import { Link } from 'react-router';
import './footer.css';

import logo from '../../assets/logo.svg';
import linkedinIcon from '../../assets/ico_linkedin.svg';
import instagramIcon from '../../assets/ico_instagram.svg';
import tiktokIcon from '../../assets/ico_tiktok.svg';
import emailIcon from '../../assets/ico_email.svg';
import phoneIcon from '../../assets/ico_phone.svg';

export const Footer = () => {
  return (
    <footer className="footerjj">
      <div className="footer_container">

        <div className="footer_top">
          <div className="footer_logo">
            <Link to="/"><img src={logo} alt="JoveJobs" /></Link>
          </div>
          
          <div className="footer_nav-group">
            <nav className="footer_nav">
              <h4>Candidatos</h4>
              <ul>
                <li><Link to="/homeCandidate">Cómo funciona</Link></li>
                <li><Link to="/registerCandidate">Registro de Candidato</Link></li>
                <li><Link to="/offers">Ofertas</Link></li>
              </ul>
            </nav>
            <nav className="footer_nav">
              <h4>Empresas</h4>
              <ul>
                <li><Link to="/homeCompany">Cómo funciona</Link></li>
                <li><Link to="/registerCompany">Registro de Empresa</Link></li>
                <li><Link to="/rates">Planes</Link></li>
              </ul>
            </nav>
            <nav className="footer_nav">
              <h4>JoveJobs</h4>
              <ul>
                <li><Link to="/">Acerca</Link></li>
                <li><Link to="/">Trabaja con nosotros</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="footer_bottom">
          <div className="footer_contact">
            <a href="mailto:proyectojovejobs@gmail.com">
              <img src={emailIcon} alt="" width="14" height="14" />
              proyectojovejobs@gmail.com
            </a>
            <a href="tel:+34624059381">
              <img src={phoneIcon} alt="" width="14" height="14" />
              +34 624 059 381
            </a>
          </div>

          <div className="footer-social-legal">
            <div className="footer_social">
              <a href="https://www.instagram.com/jovejobs/" target="_blank" rel="noreferrer">
                <img src={instagramIcon} alt="Instagram" width="20" height="20" />
              </a>
              <a href="https://www.linkedin.com/company/jovejobs/" target="_blank" rel="noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" width="20" height="20" />
              </a>
              <a href="https://www.tiktok.com/@jovejobs" target="_blank" rel="noreferrer">
                <img src={tiktokIcon} alt="TikTok" width="20" height="20" />
              </a>
            </div>
            <div className="footer_legal">
              <div className="footer_legal-links">
                <a href="#">Política de privacidad</a>
                <a href="#">Accesibilidad</a>
                <a href="#">Términos de servicio</a>
              </div>
              <p className="footer_copyright">&copy; 2026 JoveJobs. Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
