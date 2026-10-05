// src/pages/Vendedor.jsx
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useVendedorLogic } from "../hooks/vendedorLogic";


const Vendedor = () => {
  const { usuario, logout } = useVendedorLogic(); // ya no usamos AuthContext directamente
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const comandas = () => {
    navigate("/mesero");
  }
  const cocina = () => {
    navigate("/cocina");
  }

  if (!usuario) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Bienvenid@, {usuario.nombre}</h1>
      <p className="mb-6">Rol: {usuario.rol} | Empresa: {usuario.empresa?.nombre}</p>


    <div>
    <button
        onClick={comandas}
        className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600 transition my-4 mx-4"
      >
        Crear comandas
      </button>

      <button
        onClick={cocina}
        className="bg-cyan-500 text-white px-6 py-2 rounded hover:bg-cyan-600 transition my-4 mx-4"
      >
        Ir a la cocina
      </button>
    </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Vendedor;
