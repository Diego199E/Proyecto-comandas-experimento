// src/components/ResumenMesa.jsx

import { ScrollText } from "lucide-react";

/**
 * Muestra un resumen de los platos seleccionados en la mesa activa,
 * con opciones para editar, eliminar y enviar la comanda.
 *
 * @param {Object} props
 * @param {string} props.mesaActiva - Nombre de la mesa activa.
 * @param {Array} props.mesas - Lista de todas las mesas con sus platos.
 * @param {Array} props.platos - Lista de platos disponibles (para buscar detalles).
 * @param {Function} props.abrirModal - Función para abrir el modal de edición.
 * @param {Function} props.eliminarPlatoDeMesa - Función para eliminar un plato.
 * @param {Function} props.enviarComanda - Función para enviar la comanda.
 */
export default function ResumenMesa({
  mesaActiva,
  mesas,
  platos,
  abrirModal,
  eliminarPlatoDeMesa,
  enviarComanda,
}) {
  const mesa = mesas.find((m) => m.nombre === mesaActiva);

  if (!mesa) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <ScrollText size={25} className="mr-2 bg-white rounded-md" />
        Resumen de {mesaActiva}
      </h3>

      <div className="space-y-4">
        {mesa.platos.map((p, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl shadow p-4 text-sm md:text-base flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
          >
            <div>
              <p className="font-semibold">🍽️ Plato {i + 1}:</p>
              <p>
                <strong>{p.nombre}</strong> –{" "}
                {Object.entries(p.opciones)
                  .map(([cat, val]) => `${cat,val}`)
                  .join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="text-white hover:bg-emerald-800 text-sm px-4 py-2 bg-emerald-600 rounded"
                onClick={() =>
                  abrirModal(platos.find((pl) => pl.nombre === p.nombre), i)
                }
              >
                ✏️ Editar
              </button>
              <button
                className="text-white hover:bg-red-800 text-sm px-4 py-2 bg-red-600 rounded"
                onClick={() => eliminarPlatoDeMesa(mesaActiva, i)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mesa.platos.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg shadow"
            onClick={() => enviarComanda(mesaActiva)}
          >
            📤 Enviar Comanda
          </button>
        </div>
      )}
    </div>
  );
}
