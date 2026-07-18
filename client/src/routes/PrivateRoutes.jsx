import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export const PrivateRoutes = ({ user, requiredType }) => {
  const navigate = useNavigate();
 //manejar la logica de Auth dependiendo del role
  //administra rutas para admin o user

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.type !== requiredType) {
      navigate("/", { replace: true });
    }
  }, [user, requiredType, navigate]);

  if (user === undefined) return <h2>Cargando...</h2>;

  return <Outlet />;
};