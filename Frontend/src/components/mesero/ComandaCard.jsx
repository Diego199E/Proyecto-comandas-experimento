import { motion } from "framer-motion";
import { X, Pencil } from "lucide-react";

export default function ComandaCard({ comanda, onCompletar, onEliminar, onEditar, cargando = false }) {
  const total = comanda.platillos.reduce((acc, p) => acc + (p.precio || 0), 0);
  const usaIva = comanda.usaIva !== false;
  const subtotal = usaIva ? total / 1.19 : total;
  const iva = usaIva ? total - subtotal : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`w-full rounded-xl p-2 flex flex-col gap-3 relative shadow-md transition-all duration-300 
      ${cargando ? "bg-white/80 text-white opacity-80 pointer-events-none blur-[1px]" : "bg-white"}
    `}
    
    >
      {/* Botones de acción en esquina superior derecha */}
      <div className="absolute top-2 right-2 flex gap-2">
        {onEliminar && (
          <button
            onClick={() => {
              if (confirm("¿Estás seguro de que deseas eliminar esta comanda?")) {
                onEliminar(comanda._id);
              }
            }}
            title="Eliminar comanda"
            className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center pr-12">
        <h3 className="text-lg font-bold">🪑 {comanda.mesa}</h3>
        <p className="text-sm text-gray-600">
          ⏰ {new Date(comanda.hora).toLocaleString([], {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>

      <p className="text-sm text-gray-700">
        👤 Mesero:{" "}
        <span className="font-medium">
          {comanda.usuario?.nombre || "Sin mesero"}
        </span>
      </p>

      <div className={`grid gap-3 ${comanda.platillos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {comanda.platillos.map((p, i) => (
          <motion.div key={i} className="relative bg-gray-100 p-2 rounded-lg shadow-sm text-xl">
            <button
              onClick={() => onEditar(comanda, p)}
              className="absolute top-1 right-1 p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
              title="Editar plato"
            >
              <Pencil size={16} />
            </button>

            <div className="font-semibold">{p.nombre}</div>
            <ul className="ml-2 text-gray-700">
              {p.productos.map((prod, idx) => (
                <li key={idx}>- {prod}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <button
          onClick={onCompletar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full text-sm"
        >
          ✅ Marcar como servida
        </button>
      </div>
    </motion.div>
  );
}
