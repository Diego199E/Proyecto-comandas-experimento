import { useNavigate } from "react-router-dom";

export default function Bloqueado() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 p-4">
      <h1 className="text-3xl font-bold mb-4">Cuenta desactivada</h1>
      <p className="text-lg mb-6">Comunicate a soporte Whatsapp: 3125807680 - 3053763515</p>
      <button
        onClick={() => navigate("/login")}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
}
