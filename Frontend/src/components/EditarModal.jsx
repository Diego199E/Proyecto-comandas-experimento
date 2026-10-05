import { useEffect, useState } from "react";

/**
 * Modal genérico de edición reutilizable para ingredientes, productos, menú, etc.
 * 
 * @param {boolean} visible - Si el modal debe mostrarse
 * @param {string} titulo - Título del modal
 * @param {Array} campos - Lista de campos a editar, con estructura { label, valor, tipo?, onChange? }
 * @param {Function} onClose - Función que cierra el modal
 * @param {Function} onConfirm - Función que recibe los nuevos valores al presionar "Guardar"
 */
export default function EditarModal({ visible, titulo, campos = [], onClose, onConfirm }) {
  const [valores, setValores] = useState([]);

  useEffect(() => {
    // Siempre establecer valores definidos (vacío si es null o undefined)
    setValores(campos.map((c) => c.valor ?? ""));
  }, [campos]);


  // Actualiza el valor de un campo editado
  const handleChange = (index, nuevoValor) => {
    const copia = [...valores];
    copia[index] = nuevoValor;
    setValores(copia);
  };

  // Si no está visible, no renderizar nada
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro semitransparente */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      ></div>

      {/* Contenido del modal */}
      <div className="relative bg-white border shadow-xl rounded-xl p-4 max-w-xs w-[90%] z-50">
        {/* Encabezado con botón cerrar */}
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-base font-bold">{titulo}</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-sm"
          >
            ✕
          </button>
        </div>

        {/* Render de campos */}
        {campos.map((campo, idx) => (
          <div key={idx} className="mb-3">
            <label className="block text-sm mb-1 font-medium">{campo.label}</label>
            <input
              type={campo.tipo || "text"}
              value={valores[idx] ?? ""}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />

          </div>
        ))}

        {/* Botones de acción */}
        <div className="flex justify-between gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-black text-sm px-3 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(valores)}
            className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
