import useProductos from "../../hooks/panel/useProductos";
import { useState } from "react";

export default function PlatosAgregar({
  form,
  setForm,
  categoria,
  setCategoria,
  valor,
  setValor,
  categoriasUnicas,
  agregarContenido,
  marcarContenidoParaEliminar,
  handleSubmit,
  editandoId,
}) {
  const { productos } = useProductos();
  const [filtroProducto, setFiltroProducto] = useState("");


  const handleProductoClick = (nombreProducto) => {
    if (!categoria.trim()) return;

    setValor(nombreProducto);
    setFiltroProducto(""); // limpia la búsqueda

    agregarContenido({
      categoria: categoria.trim(),
      valor: nombreProducto,
      seleccionable: true,
    });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Nombre del plato */}
      <input
        type="text"
        placeholder="Nombre del plato"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        className="w-full border px-4 py-2 rounded"
        required
      />

      {/* Precio y disponibilidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Precio"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          className="border px-4 py-2 rounded w-full"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.disponible}
            onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
            className="w-4 h-4"
          />
          <span>Disponible</span>
        </label>
      </div>

      {/* Contenido del plato */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Contenido del plato</h3>

        {/* Campo para categoría */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <input
            list="categorias"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Categoría (ej. Bebida, Entrada...)"
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            className="border px-2 py-1 rounded w-full"
          />
          <datalist id="categorias">
            {categoriasUnicas.map((cat, i) => (
              <option key={i} value={cat} />
            ))}
          </datalist>
        </div>

        {/* Buscador de productos y lista filtrada */}
        {productos.length > 0 && (
          <>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
              className="w-full mb-2 p-2 border border-gray-300 rounded text-sm"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {productos
                .filter((p) =>
                  p.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
                )
                .map((producto) => (
                  <button
                    key={producto._id}
                    type="button"
                    onClick={() => handleProductoClick(producto.nombre)}
                    className="bg-white border border-gray-300 hover:bg-blue-100 p-2 rounded shadow text-left text-sm"
                  >
                    {producto.nombre}
                  </button>
                ))}
            </div>
          </>
        )}


        {/* Contenido agregado visualmente */}
        {form.contenido.length > 0 && (
          <ul className="list-disc ml-5 text-sm">
            {form.contenido.map((c, i) => (
              <li key={i} className="flex justify-between items-center py-1 border-b border-gray-300">
                <span>
                  <strong>{c.categoria}:</strong> {c.valor}
                </span>
                <button
                  type="button"
                  onClick={() => marcarContenidoParaEliminar(i)}
                  className="text-red-500 hover:underline ml-2"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón para guardar o agregar */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
      >
        {editandoId ? "Guardar cambios" : "Agregar plato"}
      </button>
    </form>
  );
}
