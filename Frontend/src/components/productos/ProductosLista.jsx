export default function ProductosLista({
    productos,
    cargando,
    error,
    busqueda,
    setBusqueda,
    limite,
    setLimite,
    onEditar,
    onEliminar,
  }) {
    const productosFiltrados = productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    const productosAMostrar = productosFiltrados.slice(0, limite);
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Productos</h2>
  
        {/* Búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
  
        {/* Lista de productos */}
        {!cargando && productosFiltrados.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {productosAMostrar.map((p) => (
              <div
                key={p._id}
                className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">{p.nombre}</h4>
  
                  {p.cantidadDisponible > 0 && (
                    <p className="text-sm text-green-600 mb-2">
                      Disponibles: <span className="font-bold">{p.cantidadDisponible ?? 0}</span>
                    </p>
                  )}
  
                  <div className="text-sm text-gray-700 space-y-1">
                    {p.ingredientesUsados.map((i, idx) => (
                      <div key={idx} className="flex justify-between border-b py-1">
                        <span>{i.ingrediente?.nombre || "Ingrediente eliminado"}</span>
                        <span className="font-medium">
                          {i.cantidadUsada} {i.ingrediente?.unidad || "unidades"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
  
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onEditar(p)}
                    className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
  
  
                  <button
                    onClick={() => onEliminar(p._id)}
                    className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
  
            {productosFiltrados.length > limite && (
              <div className="mt-4 text-center col-span-full">
                <button
                  onClick={() => setLimite((prev) => prev + 10)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                >
                  Ver más
                </button>
              </div>
            )}
          </div>
        )}
  
        {cargando && <p className="text-gray-500">Cargando productos...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}
        {!cargando && productos.length === 0 && (
          <p className="text-gray-500">No hay productos registrados.</p>
        )}
      </div>
    );
  }
  