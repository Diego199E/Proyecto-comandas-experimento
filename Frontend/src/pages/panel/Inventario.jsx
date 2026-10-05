import { useContext, useState } from "react";
import useInventario from "../../hooks/panel/useInventario";
import ConfirmModal from "../../components/ConfirmModal";
import EditarModal from "../../components/EditarModal";
import { AuthContext } from "../../context/authContext";

export default function Inventario() {
  const {
    ingredientes,
    cargando,
    error,
    busqueda,
    setBusqueda,
    crearIngrediente,
    eliminarIngrediente,
    cambiarDisponibilidad,
    obtenerIngredientes,
  } = useInventario();

  const { token } = useContext(AuthContext);

  // Formularios y estados
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("unidades");

  const [modalVisible, setModalVisible] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);

  const [ingredienteEditando, setIngredienteEditando] = useState(null);

  // Agrega un nuevo ingrediente
  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nombre || !cantidad) return;

    await crearIngrediente({
      nombre,
      cantidad: parseFloat(cantidad),
      unidad,
    });

    setNombre("");
    setCantidad("");
    setUnidad("unidades");
  };

  // Guardar cambios del modal de edición
  const handleGuardarCambios = async ([nuevoNombre, nuevaCantidad, nuevaUnidad]) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ingredientes/${ingredienteEditando._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          cantidad: parseFloat(nuevaCantidad),
          unidad: nuevaUnidad,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al editar ingrediente");

      await obtenerIngredientes();
      setIngredienteEditando(null);
    } catch (err) {
      alert("❌ Error al editar ingrediente");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inventario</h2>

      {/* Formulario de creación */}
      <form
        onSubmit={handleAgregar}
        className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Unidad (ej: kg)"
          value={unidad}
          onChange={(e) => setUnidad(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
        >
          Agregar
        </button>
      </form>

      {/* Filtro de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar ingrediente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Mensajes de estado */}
      {cargando && <p className="text-gray-500">Cargando ingredientes...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!cargando && ingredientes.length === 0 && (
        <p className="text-gray-500">No hay ingredientes registrados.</p>
      )}

      {/* Vista estilo inventario */}
      {!cargando && ingredientes.length > 0 && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ingredientes.map((i) => (
              <div
                key={i._id}
                onClick={() => setSeleccionado(i)}
                className={`cursor-pointer p-2 rounded-lg text-center shadow border hover:shadow-md hover:scale-105 transition ${
                  i.disponible ? "bg-green-100" : "bg-gray-200 opacity-75"
                }`}
              >
                <p className="font-semibold text-lg truncate">{i.nombre}</p>
                <p className="text-xs text-gray-600">
                  {i.cantidad} {i.unidad}
                </p>
              </div>
            ))}
          </div>

          {/* Panel flotante de acciones */}
          {seleccionado && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={() => setSeleccionado(null)}
              ></div>

              <div className="relative bg-white border shadow-xl rounded-xl p-4 max-w-xs w-[90%] z-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-bold">{seleccionado.nombre}</h4>
                  <button
                    onClick={() => setSeleccionado(null)}
                    className="text-gray-500 hover:text-black text-sm"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Cantidad:</strong> {seleccionado.cantidad} {seleccionado.unidad}
                </p>
                <p className="text-sm mb-4 flex items-center gap-1">
                  <strong>Estado:</strong>{" "}
                  {seleccionado.disponible ? (
                    <span className="text-green-700">✔ Disponible</span>
                  ) : (
                    <span className="text-gray-500">❌ No disponible</span>
                  )}
                </p>

                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <button
                    onClick={() => {
                      cambiarDisponibilidad(seleccionado._id, !seleccionado.disponible);
                      setSeleccionado(null);
                    }}
                    className={`flex-1 text-sm rounded px-3 py-2 font-medium ${
                      seleccionado.disponible
                        ? "bg-gray-400 text-white hover:bg-gray-500"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {seleccionado.disponible ? "❌ No disponible" : "✔ Marcar disponible"}
                  </button>

                  <button
                    onClick={() => {
                      setIngredienteEditando(seleccionado);
                      setSeleccionado(null);
                    }}
                    className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700"
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => {
                      setIdAEliminar(seleccionado._id);
                      setSeleccionado(null);
                      setModalVisible(true);
                    }}
                    className="flex-1 bg-red-600 text-white text-sm px-3 py-2 rounded hover:bg-red-700"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => eliminarIngrediente(idAEliminar)}
        mensaje="¿Seguro que deseas eliminar este ingrediente del inventario?"
      />

      {/* Modal de edición reutilizable */}
      <EditarModal
        visible={!!ingredienteEditando}
        titulo="Editar Ingrediente"
        campos={[
          { label: "Nombre", valor: ingredienteEditando?.nombre || "" },
          { label: "Cantidad", valor: ingredienteEditando?.cantidad || 0, tipo: "number" },
          { label: "Unidad", valor: ingredienteEditando?.unidad || "" },
        ]}
        onClose={() => setIngredienteEditando(null)}
        onConfirm={handleGuardarCambios}
      />
    </div>
  );
}
