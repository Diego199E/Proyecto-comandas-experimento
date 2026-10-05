// src/components/SeccionMesas.jsx
import { X, Plus } from "lucide-react";

export default function SeccionMesas({
  mesas,
  mesaActiva,
  setMesaActiva,
  agregarMesa,
  eliminarMesa,
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Mesas</h2>
      <div className="flex gap-2 flex-wrap">
        {mesas.map((mesa, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded border cursor-pointer flex items-center ${
              mesa.nombre === mesaActiva ? "bg-[#ff8000] text-black" : "bg-white"
            }`}
            onClick={() => setMesaActiva(mesa.nombre)}
          >
            {mesa.nombre}
            {mesa.nombre !== "Mesa 1" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  eliminarMesa(mesa.nombre);
                }}
                className="ml-2 text-red-600 font-bold flex items-center"
              >
                <X size={25} strokeWidth={2.5} className="ml-1" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={agregarMesa}
          className="px-3 py-1 bg-[#F05605] text-white rounded hover:bg-amber-700 flex items-center"
        >
          <Plus size={25} className="ml-1 mr-2" />
          Mesa
        </button>
      </div>
    </div>
  );
}
