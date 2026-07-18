import { Outlet } from 'react-router';
import { Footer } from '../components/footer/Footer';
// import { NavBarPublic } from '../components/navBarPublic/NavBarPublic';
import { NavBarPriv } from '../components/navBarPriv/NavBarPriv';

export const CandidateLayout = () => {
  return (
    <>
      <header>
        <NavBarPriv />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
