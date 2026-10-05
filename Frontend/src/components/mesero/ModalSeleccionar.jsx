// src/components/ModalSeleccionar.jsx
export default function ModalSeleccionar({
    plato,
    seleccionCategoria,
    seleccionarOpcion,
    mesaSeleccionada,
    setMesaSeleccionada,
    guardarPlatoMesa,
    cerrarModal,
  }) {
    const categorias = [...new Set(plato.contenido.map((c) => c.categoria))];
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-4 w-[95%] max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Personalizar: {plato.nombre}</h2>
  
          <div className="mb-4">
            <label className="block font-semibold mb-1">Seleccionar mesa:</label>
            <input
              type="text"
              value={mesaSeleccionada}
              disabled
              className="w-full border px-3 py-1 rounded bg-gray-100"
            />
          </div>
  
          {categorias.map((cat, i) => (
            <div key={i} className="mb-3">
              <label className="block font-semibold mb-1">{cat}</label>
              <div className="flex flex-wrap gap-2">
                {plato.contenido
                  .filter((c) => c.categoria === cat)
                  .map((op, idx) => (
                    <button
                      key={idx}
                      onClick={() => seleccionarOpcion(cat, op.valor)}
                      className={`px-3 py-1 rounded border ${
                        seleccionCategoria[cat] === op.valor
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-gray-200"
                      }`}
                    >
                      {op.valor}
                    </button>
                  ))}
              </div>
            </div>
          ))}
  
          <div className="mt-4">
            <h3 className="font-semibold">Resumen:</h3>
            <ul className="list-disc ml-6 text-sm">
              {Object.entries(seleccionCategoria).map(([cat, val], i) => (
                <li key={i}>
                  {cat}: <strong>{val}</strong>
                </li>
              ))}
            </ul>
          </div>
  
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={cerrarModal}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={guardarPlatoMesa}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Agregar a {mesaSeleccionada}
            </button>
          </div>
        </div>
      </div>
    );
  }
  