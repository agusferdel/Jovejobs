import { Link, useNavigate } from 'react-router';
import { ButtonJJ } from '../Button/Button';
import logo from '../../assets/logo.svg';
import menuBars from '../../assets/menu_bars.svg';
import menuX from '../../assets/menu_x.svg';

import './navbarPublic.css';
import { useState } from 'react';

export const NavBarPublic = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const navLinks = [
    { to: '/homeCandidate', label: 'Candidatos' },
    { to: '/homeCompany', label: 'Empresas' },
    { to: '/offers', label: 'Ofertas' },
    { to: '/rates', label: 'Planes' },
  ];

  const actionButtons = [
    { to: '/login', label: 'Mi cuenta', variant: 'secondary' },
    { to: '/selector', label: 'Registrarse', variant: 'primary' },
  ];

  return (
    <header className='navbar-public'>
      <div className='np-container'>
        <Link to='/' className='jj-logo' onClick={closeMenu}>
          <img src={logo} alt='' />
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

        <div className='jj-btns'>
          {actionButtons.map((button) => (
            <ButtonJJ
              key={button.to}
              onClick={() => {
                closeMenu();
                navigate(button.to);
              }}
              variant={button.variant}
            >
              {button.label}
            </ButtonJJ>
          ))}
        </div>

        <button
          className='jj-toggle'
          type='button'
          onClick={() => setOpen(!open)}
        >
          <img src={open ? menuX : menuBars} alt='' />
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

          <div className='jj-mobile-btns'>
            {actionButtons.map((button) => (
              <ButtonJJ
                key={button.to}
                onClick={() => {
                  closeMenu();
                  navigate(button.to);
                }}
                variant={button.variant}
              >
                {button.label}
              </ButtonJJ>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};