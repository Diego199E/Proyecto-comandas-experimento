import { usePanelLogic } from "../hooks/panelLogic";
import PanelLayout from "../components/panelLayout";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function PanelAdmin() {
  const { usuario, logout, cargando } = usePanelLogic();
  const [vista, setVista] = useState("inicio");
  const { mensajeLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir si el token expiró
  useEffect(() => {
    if (mensajeLogout) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensajeLogout, navigate]);

  useEffect(() => {
    if (!cargando && usuario && usuario.rol !== "Admin") {
      navigate("/"); // O podrías redirigir a /mesero, /bloqueado, etc.
    }
  }, [usuario, cargando, navigate]);
  

  if (cargando || !usuario) return null;

  return (
    <div className="">
      {mensajeLogout && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {mensajeLogout}
        </div>
      )}

      <PanelLayout usuario={usuario} onLogout={logout} setVista={setVista} vista={vista}>
        <Outlet />
      </PanelLayout>
    </div>
  );
}
