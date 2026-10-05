// src/components/TabsMesero.jsx
export default function TabsMesero({ vista, setVista }) {
    return (
      <div className="flex gap-4 mb-6 pt-4">
        <button
          onClick={() => setVista("comandas")}
          className={`px-4 py-2 rounded ${vista === "comandas" ? "bg-[#ff8000] font-bold" : "bg-gray-300"}`}
        >
          Tomar pedido
        </button>
        <button
          onClick={() => setVista("activas")}
          className={`px-4 py-2 rounded ${vista === "activas" ? "bg-[#ff8000] font-bold" : "bg-gray-300"}`}
        >
          Comandas activas
        </button>
      </div>
    );
  }
  