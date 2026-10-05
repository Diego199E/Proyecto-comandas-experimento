import { useState } from "react";

export default function Inicio() {
  const [tutorialActivo, setTutorialActivo] = useState(null);

  const tutoriales = [
    { id: 1, titulo: "Panel administrativo", contenido: "Aquí va el video o imagen del tutorial de platos." },
    { id: 2, titulo: "Gestión de platos", contenido: "Aquí va el tutorial para tomar comandas." },
    { id: 3, titulo: "Toma de comandas", contenido: "Aquí se explica cómo funciona la vista del mesero." },
    { id: 4, titulo: "Vista del mesero", contenido: "Aquí se enseña cómo usar el panel administrativo." },
  ];

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-4">
        ¡Bienvenido!
      </h1>
      <p className="text-lg text-center mb-8">Aquí puedes gestionar tu negocio</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-8">
        {tutoriales.map((tut) => (
          <button
            key={tut.id}
            onClick={() => setTutorialActivo(tut.id)}
            className="bg-white hover:bg-orange-100 border border-orange-500 text-orange-700 font-semibold py-3 px-4 rounded shadow text-center"
          >
            {tut.titulo}
          </button>
        ))}
      </div>

      {/* Sección del tutorial mostrado */}
      {tutorialActivo && (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl w-full border border-orange-300">
          <h2 className="text-xl font-bold mb-2 text-center text-orange-700">
            {tutoriales.find((t) => t.id === tutorialActivo)?.titulo}
          </h2>
          <div className="text-gray-700 text-center">
            {tutoriales.find((t) => t.id === tutorialActivo)?.contenido}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setTutorialActivo(null)}
              className="text-sm text-blue-700 hover:underline"
            >
              🔙 Volver a los botones
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
