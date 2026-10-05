// src/components/ListaPlatos.jsx
export default function ListaPlatos({ platos, abrirModal }) {
    return (
      <>
        <h2 className="text-lg font-semibold mb-2">Platos disponibles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {platos.map((p, i) => (
            <div
              key={i}
              className="border-2 border-gray-400 rounded-xl p-4 bg-amber-100 shadow hover:bg-amber-300 cursor-pointer"
              onClick={() => abrirModal(p)}
            >
              <h3 className="font-bold text-lg">{p.nombre}</h3>
              <p>
                <strong>Precio:</strong> ${p.precio}
                <br />
                <strong>Stock:</strong> {p.disponible ? "✔" : "❌"}
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }
  