import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export const PublicRoutes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const guestOnlyRoutes = [
    '/login',
    '/register',
    '/registerCandidate',
    '/registerCompany',
    '/recoverPassword',
  ];

  const isGuestOnly =
    guestOnlyRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/resetPassword/');

  useEffect(() => {
    if (!user || !isGuestOnly) return;

    if (user.type === 3) navigate('/candidateProfile', { replace: true });
    if (user.type === 2) navigate('/companyProfile', { replace: true });
    if (user.type === 1) navigate('/adminDashboard', { replace: true });
  }, [user, isGuestOnly, navigate]);

  return <Outlet />;
};