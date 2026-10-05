import { useState, useEffect } from "react";
import useProductos from "../../hooks/panel/useProductos";
import useInventario from "../../hooks/panel/useInventario";
import ProductosCrear from "../../components/productos/ProductosCrear";
import ProductosLista from "../../components/productos/ProductosLista";
import ConfirmModal from "../../components/ConfirmModal";
import EditarModal from "../../components/EditarModal";

export default function Productos() {
  const {
    productos,
    cargando,
    error,
    busqueda,
    setBusqueda,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
    fabricarProducto,
  } = useProductos();

  const {
    ingredientes,
    cargando: cargandoIngredientes,
    error: errorIngredientes,
    obtenerIngredientes,
  } = useInventario();

  const [tab, setTab] = useState("lista");
  const [busquedaIngredientes, setBusquedaIngredientes] = useState("");
  const [limite, setLimite] = useState(10);

  // Estados específicos para crear productos
  const [nombre, setNombre] = useState("");
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);

  const [modalVisibleEliminar, setModalVisibleEliminar] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [camposEdicion, setCamposEdicion] = useState([]);
  const [modalVisibleEditar, setModalVisibleEditar] = useState(false);

  useEffect(() => {
    obtenerProductos();
    obtenerIngredientes();
  }, []);

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || ingredientesSeleccionados.length === 0) return;

    const nuevoProducto = {
      nombre: nombre.trim(),
      ingredientesUsados: ingredientesSeleccionados.map((i) => ({
        ingrediente: i.ingrediente,
        cantidadUsada: parseFloat(i.cantidadUsada),
      })),
    };

    await crearProducto(nuevoProducto);
    setNombre("");
    setIngredientesSeleccionados([]);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("crear")}
          className={`px-4 py-2 rounded ${tab === "crear"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Crear Producto
        </button>
        <button
          onClick={() => setTab("lista")}
          className={`px-4 py-2 rounded ${tab === "lista"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Ver Productos
        </button>
      </div>

      {/* Contenido según la pestaña */}
      {tab === "crear" && (
        <ProductosCrear
          nombre={nombre}
          setNombre={setNombre}
          ingredientes={ingredientes}
          ingredientesSeleccionados={ingredientesSeleccionados}
          setIngredientesSeleccionados={setIngredientesSeleccionados}
          busquedaIngredientes={busquedaIngredientes}
          setBusquedaIngredientes={setBusquedaIngredientes}
          cargandoIngredientes={cargandoIngredientes}
          errorIngredientes={errorIngredientes}
          handleCrearProducto={handleCrearProducto}
        />
      )}

      {tab === "lista" && (
        <ProductosLista
          productos={productos}
          cargando={cargando}
          error={error}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          limite={limite}
          setLimite={setLimite}
          onEditar={(producto) => {
            const campos = [
              { label: "Nombre del producto", valor: producto.nombre },
              ...producto.ingredientesUsados.map((i) => ({
                label: `Cantidad de ${i.ingrediente.nombre}`,
                valor: i.cantidadUsada,
                tipo: "number",
              })),
            ];
            setProductoSeleccionado(producto);
            setCamposEdicion(campos);
            setModalVisibleEditar(true);
          }}
          onFabricar={async (id, cantidad) => {
            try {
              await fabricarProducto(id, cantidad);
              await obtenerProductos();
            } catch (err) {
              alert("❌ " + err.message);
            }
          }}
          onEliminar={(id) => {
            setIdAEliminar(id);
            setModalVisibleEliminar(true);
          }}
        />
      )}

      {/* Modales */}
      <EditarModal
        visible={modalVisibleEditar}
        titulo="Editar producto"
        campos={camposEdicion}
        onClose={() => setModalVisibleEditar(false)}
        onConfirm={async (valores) => {
          try {
            const nombre = valores[0];
            const cantidades = valores.slice(1).map((v) => parseFloat(v));

            const actualizado = {
              nombre,
              ingredientesUsados: productoSeleccionado.ingredientesUsados.map((i, idx) => ({
                ingrediente: i.ingrediente._id,
                cantidadUsada: cantidades[idx],
              })),
            };

            await actualizarProducto(productoSeleccionado._id, actualizado);
            setModalVisibleEditar(false);
          } catch (error) {
            console.error("Error actualizando producto:", error.message);
          }
        }}
      />

      <ConfirmModal
        visible={modalVisibleEliminar}
        onClose={() => setModalVisibleEliminar(false)}
        onConfirm={async () => {
          await eliminarProducto(idAEliminar);
          setModalVisibleEliminar(false);
        }}
        mensaje="¿Eliminar este producto permanentemente?"
      />
    </div>
  );
}
