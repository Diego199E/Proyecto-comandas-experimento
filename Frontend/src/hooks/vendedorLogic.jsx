import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export const useVendedorLogic = () => {
  const { usuario, logout, cargando } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        navigate("/login");
      } else if (!usuario.empresa?.activa || !usuario.empresa?.pagoRealizado) {
        navigate("/bloqueado"); // o muestra un mensaje si prefieres
      }
    }
  }, [usuario, cargando, navigate]);

  return { usuario, logout, cargando };
};
