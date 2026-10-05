import { useLogin } from "../hooks/useLogin";
import { motion } from "framer-motion";
import logo from "../assets/images/logo.jpg"
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const {
    correo,
    setCorreo,
    contraseña,
    setContraseña,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center p-4">
      <button
        onClick={() => window.location.href = "/"}
        className="fixed top-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition"
      >
        <ArrowLeft className="text-2xl mb-1" />
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2"
      >
        {/* Lado izquierdo: presentación */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 hidden md:flex flex-col justify-center items-center">
          <img
            src={logo}
            alt="Logo restaurante"
            className="w-24 h-24 mb-4 object-contain rounded-xl"
          />
          <h2 className="text-3xl font-bold">Bienvenido</h2>
          <p className="text-sm mt-2 text-center">
            Accede al sistema de comandas para gestionar tu restaurante.
          </p>
        </div>

        {/* Lado derecho: formulario */}
        <div className="p-8 bg-white">
          <h2 className="text-2xl font-bold text-orange-800 text-center mb-6">
            Iniciar Sesión
          </h2>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-stone-800">
                Correo
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@restaurante.com"
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
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-2 rounded-md transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-amber-700"
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
                  Verificando...
                </>
              ) : (
                "Entrar"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
