export default function PlatosVer({ platos, handleEditar, handleEliminar }) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border min-w-[700px]">
          <thead>
            <tr className="bg-gradient-to-br from-[#fff0e6] via-[#ffe0cc] to-[#ffd1b3] text-center">
              <th className="p-1 border">Nombre</th>
              <th className="p-1 border">Precio</th>
              <th className="border">Disponible</th>
              <th className="p-2 border">Contenido</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platos.map((p) => (
              <tr className="text-center" key={p._id}>
                <td className="p-2 border font-medium">{p.nombre}</td>
                <td className="p-2 border">${p.precio}</td>
                <td className="p-2 border">
                  {p.disponible ? (
                    <span className="text-green-600 font-bold">✅</span>
                  ) : (
                    <span className="text-red-600 font-bold">❌</span>
                  )}
                </td>
                <td className="border">
                  <div className="overflow-x-auto">
                    <table className="min-w-[500px] w-full text-xs border-collapse text-center">
                      <thead>
                        <tr>
                          {[...new Set(p.contenido.map((c) => c.categoria))].map((categoria, i) => (
                            <th key={i} className="border px-2 py-1 bg-gradient-to-br from-amber-200 to-orange-200">
                              {categoria}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {[...new Set(p.contenido.map((c) => c.categoria))].map((categoria, i) => {
                            const valores = p.contenido
                              .filter((c) => c.categoria === categoria)
                              .map((c, j) => <li key={j}>{c.valor}</li>);
                            return (
                              <td key={i} className="border align-top text-center p-1">
                                <ul className="list-disc list-inside text-xs">{valores}</ul>
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td className="border text-center flex flex-col items-center p-2">
                  <button
                    onClick={() => handleEditar(p)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 w-full sm:w-auto"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full sm:w-auto"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  