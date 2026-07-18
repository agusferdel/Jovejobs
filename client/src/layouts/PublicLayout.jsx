import { Outlet } from 'react-router';
import { Footer } from '../components/footer/Footer';
//../components/footer/Footer
import { NavBarPublic } from '../components/navBarPublic/NavBarPublic';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavBarPriv } from '../components/navBarPriv/NavBarPriv';

export const PublicLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <header>
        {user ? <NavBarPriv /> : <NavBarPublic />}
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};