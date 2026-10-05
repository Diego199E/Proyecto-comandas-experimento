export default function ProductosCrear({
    nombre,
    setNombre,
    ingredientes,
    ingredientesSeleccionados,
    setIngredientesSeleccionados,
    busquedaIngredientes,
    setBusquedaIngredientes,
    cargandoIngredientes,
    errorIngredientes,
    handleCrearProducto,
  }) {
    if (
      !setNombre ||
      !setIngredientesSeleccionados ||
      !setBusquedaIngredientes ||
      !handleCrearProducto
    ) {
      console.error("❌ Faltan props requeridas en <ProductosCrear />");
      return <p className="text-red-500">Error interno: props incompletas</p>;
    }
  
    const ingredientesFiltrados = Array.isArray(ingredientes)
      ? ingredientes.filter((i) =>
          i.nombre.toLowerCase().includes(busquedaIngredientes.toLowerCase())
        )
      : [];
  
    const handleAgregarIngrediente = (ingrediente) => {
      if (
        ingredientesSeleccionados.some((i) => i.ingrediente === ingrediente._id)
      )
        return;
  
      setIngredientesSeleccionados([
        ...ingredientesSeleccionados,
        {
          ingrediente: ingrediente._id,
          nombre: ingrediente.nombre,
          unidad: ingrediente.unidad,
          cantidadUsada: 1,
        },
      ]);
    };
  
    const actualizarCantidad = (id, nuevaCantidad) => {
      setIngredientesSeleccionados((prev) =>
        prev.map((i) =>
          i.ingrediente === id ? { ...i, cantidadUsada: nuevaCantidad } : i
        )
      );
    };
  
    const eliminarIngredienteSeleccionado = (id) => {
      setIngredientesSeleccionados((prev) =>
        prev.filter((i) => i.ingrediente !== id)
      );
    };
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>
  
        <form onSubmit={handleCrearProducto} className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="p-2 border rounded col-span-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
          >
            Guardar producto
          </button>
        </form>
  
        <div className="mb-2">
          <input
            type="text"
            placeholder="Buscar ingrediente..."
            value={busquedaIngredientes}
            onChange={(e) => setBusquedaIngredientes(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
  
        <div className="mb-4 max-h-64 overflow-auto">
          <h3 className="font-semibold mb-2">Seleccionar ingredientes:</h3>
          {cargandoIngredientes && <p>Cargando ingredientes...</p>}
          {errorIngredientes && <p className="text-red-500">❌ {errorIngredientes}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {!cargandoIngredientes && ingredientesFiltrados.length === 0 ? (
              <p>No hay ingredientes que coincidan.</p>
            ) : (
              ingredientesFiltrados.map((ing) => (
                <button
                  key={ing._id}
                  type="button"
                  onClick={() => handleAgregarIngrediente(ing)}
                  className="bg-gray-100 hover:bg-gray-200 rounded p-2 text-sm text-center border"
                >
                  {ing.nombre} ({ing.unidad})
                </button>
              ))
            )}
          </div>
        </div>
  
        {Array.isArray(ingredientesSeleccionados) &&
          ingredientesSeleccionados.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Ingredientes del producto:</h3>
              <div className="space-y-2">
                {ingredientesSeleccionados.map((i) => (
                  <div
                    key={i.ingrediente}
                    className="flex items-center gap-2 text-sm border border-gray-400 p-2 rounded"
                  >
                    <span className="font-medium">{i.nombre}</span>
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={i.cantidadUsada}
                      onChange={(e) =>
                        actualizarCantidad(i.ingrediente, e.target.value)
                      }
                      className="w-16 border p-1 rounded"
                    />
                    <span className="text-gray-800">{i.unidad}</span>
                    <button
                      type="button"
                      onClick={() =>
                        eliminarIngredienteSeleccionado(i.ingrediente)
                      }
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  }
  