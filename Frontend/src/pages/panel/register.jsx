import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { AuthContext } from "../../context/authContext";

const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const { usuario, token } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          correo,
          contraseña,
          empresa: usuario.empresa,
          rol: "Vendedor",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.mensaje || "Error al registrarse");
      } else {
        alert("✅ Usuario registrado con éxito");
        navigate("/panel/usuarios");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2"
      >
        {/* Lado izquierdo */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 hidden md:flex flex-col justify-center items-center">
          <FaUserPlus className="text-7xl mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold">Nuevo Usuario</h2>
          <p className="text-sm mt-2 text-center">
            Registra un nuevo mesero o administrador para tu restaurante.
          </p>
        </div>

        {/* Lado derecho */}
        <div className="p-8 bg-white">
          <h2 className="text-2xl font-bold text-orange-800 text-center mb-6">
            Registrar Usuario
          </h2>

          {mensaje && (
            <p className="text-red-600 text-sm text-center mb-4">{mensaje}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-stone-800">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-stone-800">
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-stone-800">
                Correo
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-stone-800">
                Contraseña
              </label>
              <input
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-2 rounded-md transition ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-amber-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Registrando...
                </>
              ) : (
                "Registrar"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
