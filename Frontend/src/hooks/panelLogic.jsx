// src/hooks/panelLogic.js
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export const usePanelLogic = () => {
  const { usuario, logout, cargando } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        navigate("/login");
      } else if (!usuario.empresa?.pagoRealizado || !usuario.empresa?.activa) {
        // Si la empresa está inactiva o no ha pagado
        navigate("/bloqueado");
      }
    }
  }, [usuario, cargando, navigate]);

  return { usuario, logout, cargando };
};
