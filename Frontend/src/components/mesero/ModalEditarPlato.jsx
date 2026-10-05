import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalEditarPlato({
  plato,
  cerrarModal,
  actualizarPlatoEditado,
}) {
  const [selecciones, setSelecciones] = useState({});
  const [mesaSeleccionada, setMesaSeleccionada] = useState(plato.mesa);

  // 🧠 Agrupar contenido por categoría
  const agruparContenido = (contenido) => {
    const agrupado = {};
    contenido.forEach((item) => {
      if (!agrupado[item.categoria]) {
        agrupado[item.categoria] = [];
      }
      agrupado[item.categoria].push(item.valor);
    });
    return agrupado;
  };

  // ✅ Precargar selecciones basadas en contenido original
  useEffect(() => {
    const prevSelecciones = {};

    plato.productos.forEach((valorSeleccionado) => {
      const itemOriginal = (plato.contenido || []).find(
        (item) => item.valor === valorSeleccionado
      );

      if (itemOriginal) {
        prevSelecciones[itemOriginal.categoria] = itemOriginal.valor;
      }
    });

    setSelecciones(prevSelecciones);
  }, [plato]);

  // ✅ Seleccionar o deseleccionar opción
  const seleccionarOpcion = (categoria, valor) => {
    setSelecciones((prev) => {
      if (prev[categoria] === valor) {
        const nuevo = { ...prev };
        delete nuevo[categoria];
        return nuevo;
      } else {
        return { ...prev, [categoria]: valor };
      }
    });
  };

  // ✅ Guardar los cambios
  const guardarCambios = () => {
    const nuevosProductos = Object.entries(selecciones).map(
      ([cat, val]) => `${val}`
    );

    const nuevoPlato = {
      ...plato,
      productos: nuevosProductos,
      mesa: mesaSeleccionada,
    };

    actualizarPlatoEditado(nuevoPlato);
    cerrarModal();
  };

  const contenidoAgrupado = agruparContenido(plato.contenido || []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative">
        {/* Botón cerrar */}
        <button
          onClick={cerrarModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Editar {plato.nombre}</h2>

        {/* Opciones agrupadas por categoría */}
        {Object.entries(contenidoAgrupado).map(([categoria, opciones], i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold mb-2">{categoria}</h3>
            <div className="flex flex-wrap gap-2">
              {opciones.map((op, idx) => (
                <button
                  key={idx}
                  onClick={() => seleccionarOpcion(categoria, op)}
                  className={`px-3 py-1 rounded border ${
                    selecciones[categoria] === op
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={cerrarModal}
            className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={guardarCambios}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
