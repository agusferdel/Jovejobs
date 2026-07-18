import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import logo from '../../assets/logo.svg';
import { ButtonJJ } from '../Button/Button';
import menuBars from '../../assets/menu_bars.svg';
import menuX from '../../assets/menu_x.svg';

import './navbarPriv.css';
import { AuthContext } from '../../context/AuthContext';

export const NavBarPriv = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenu = () => setOpen(false);

  const navLinks =
    user?.type === 1
      ? [
          { to: '/adminDashboard', label: 'Admin' },
          { to: '/offers', label: 'Ofertas' },
          { to: '/rates', label: 'Planes' },
        ]
      : user?.type === 2
      ? [
          { to: '/companyProfile', label: 'Perfil' },
          { to: '/offers', label: 'Ofertas' },
          { to: '/rates', label: 'Planes' },
        ]
      : user?.type === 3
      ? [
          { to: '/candidateProfile', label: 'Perfil' },
          { to: '/offers', label: 'Ofertas' },
        ]
      : [];

  return (
    <header className='navbar-priv'>
      <div className='np-container'>
        <Link to='/' className='jj-logo' onClick={closeMenu}>
          <img src={logo} alt='logo empresa' />
          <div className='jj-role-label'>
            <span className='jj-role-slash'>/</span>
            {user?.type === 3 && <h4 className='jj-role-name jj-role-candidate'>candidato</h4>}
            {user?.type === 2 && <h4 className='jj-role-name jj-role-company'>Empresa</h4>}
            {user?.type === 1 && <h4 className='jj-role-name jj-role-admin'>Admin</h4>}
          </div>
        </Link>

        <nav className='jj-nav'>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className='jj-link'
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='jj-btnLogout'>
          <ButtonJJ onClick={handleLogout} variant='secondary'>
            Cerrar sesión
          </ButtonJJ>
        </div>

        <button
          className='jj-toggle'
          type='button'
          onClick={() => setOpen(!open)}
        >
          <img src={open ? menuX : menuBars} alt='Abrir o cerrar menú' />
        </button>
      </div>

      {open && (
        <div className='jj-mobile-menu'>
          <nav className='jj-mobile-nav'>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='jj-mobile-link'
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className='jj-mobile-btnLogout'>
            <ButtonJJ onClick={handleLogout} variant='secondary'>
              Logout
            </ButtonJJ>
          </div>
        </div>
      )}
    </header>
  );
};