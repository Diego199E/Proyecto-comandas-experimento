import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Esta ruta no existe</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
      >
        Volver
      </button>
    </div>
  );
}
