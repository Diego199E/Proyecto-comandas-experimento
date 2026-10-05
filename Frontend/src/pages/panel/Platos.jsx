import { usePlatos } from "../../hooks/usePlatos";
import PlatosVer from "../../components/Menu/PlatosVer";
import PlatosAgregar from "../../components/Menu/PlatosAgregar";

export default function Menu() {
  const {
    platos,
    cargando,
    mensaje,
    form,
    categoria,
    valor,
    vista,
    categoriasUnicas,
    editandoId,
    setCategoria,
    setValor,
    setForm,
    setVista,
    agregarContenido,
    marcarContenidoParaEliminar,
    handleEditar,
    handleEliminar,
    handleSubmit,
  } = usePlatos();

  if (cargando) return <p className="p-4">Cargando platos...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-xl">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Gestión de Platos - Menú</h2>
        <div className="flex flex-col md:flex-row md:justify-end gap-2 border-l-2 border-gray-400 pl-4">
          <button
            onClick={() => setVista("ver")}
            className={`px-4 py-2 rounded w-full md:w-auto ${vista === "ver" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Ver platos
          </button>
          <button
            onClick={() => setVista("agregar")}
            className={`px-4 py-2 rounded w-full md:w-auto ${vista === "agregar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Agregar plato
          </button>
        </div>
      </div>

      <hr className="my-4 border-t border-gray-800" />
      {mensaje && <p className="mb-4 text-blue-600">{mensaje}</p>}

      {vista === "agregar" && (
        <PlatosAgregar
          form={form}
          setForm={setForm}
          categoria={categoria}
          setCategoria={setCategoria}
          valor={valor}
          setValor={setValor}
          categoriasUnicas={categoriasUnicas}
          agregarContenido={agregarContenido}
          marcarContenidoParaEliminar={marcarContenidoParaEliminar}
          handleSubmit={handleSubmit}
          editandoId={editandoId}
        />
      )}

      {vista === "ver" && (
        <PlatosVer platos={platos} handleEditar={handleEditar} handleEliminar={handleEliminar} />
      )}
    </div>
  );
}
