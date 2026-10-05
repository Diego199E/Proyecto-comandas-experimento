// src/pages/Mesero.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMesero } from "../../hooks/mesero/useMesero";
import { useMeseroActivas } from "../../hooks/mesero/useMeseroActivas";
import ModalSeleccionar from "../../components/mesero/ModalSeleccionar";
import ModalEditarPlato from "../../components/mesero/ModalEditarPlato";
import TabsMesero from "../../components/mesero/TabsMesero";
import SeccionMesas from "../../components/mesero/SeccionMesas";
import ListaPlatos from "../../components/mesero/ListaPlatos";
import ResumenMesa from "../../components/mesero/ResumenMesa";
import ComandaCard from "../../components/mesero/ComandaCard";

export default function Mesero() {
  const {
    usuario,
    logout,
    platos,
    abrirModal,
    cerrarModal,
    modalAbierto,
    platoSeleccionado,
    seleccionCategoria,
    seleccionarOpcion,
    mesas,
    mesaActiva,
    setMesaActiva,
    agregarMesa,
    eliminarMesa,
    guardarPlatoMesa,
    enviarComanda,
    eliminarPlatoDeMesa,
  } = useMesero();

  const [vista, setVista] = useState("comandas");
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [platoAEditar, setPlatoAEditar] = useState(null);
  const [comandaEditando, setComandaEditando] = useState(null);
  const [enProceso, setEnProceso] = useState([]); // IDs de comandas procesándose

  const {
    comandasActivas,
    completarComanda,
    eliminarComanda,
    editarComanda,
  } = useMeseroActivas(vista);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Bienvenid@, {usuario?.nombre}</h1>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>

      <TabsMesero vista={vista} setVista={setVista} />

      {vista === "comandas" && (
        <>
          <SeccionMesas
            mesas={mesas}
            mesaActiva={mesaActiva}
            setMesaActiva={setMesaActiva}
            agregarMesa={agregarMesa}
            eliminarMesa={eliminarMesa}
          />

          <ListaPlatos platos={platos} abrirModal={abrirModal} />

          {modalAbierto && platoSeleccionado && (
            <ModalSeleccionar
              plato={platoSeleccionado}
              seleccionCategoria={seleccionCategoria}
              seleccionarOpcion={seleccionarOpcion}
              mesaSeleccionada={mesaActiva}
              setMesaSeleccionada={setMesaActiva}
              guardarPlatoMesa={guardarPlatoMesa}
              cerrarModal={cerrarModal}
            />
          )}

          <ResumenMesa
            mesaActiva={mesaActiva}
            mesas={mesas}
            platos={platos}
            abrirModal={abrirModal}
            eliminarPlatoDeMesa={eliminarPlatoDeMesa}
            enviarComanda={enviarComanda}
          />
        </>
      )}

      {vista === "activas" && (
        <AnimatePresence mode="wait">
          {comandasActivas.length === 0 ? (
            <motion.p
              key="vacio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-600 mt-4"
            >
              No hay comandas activas.
            </motion.p>
          ) : (
            <motion.div
              key="lista"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {comandasActivas.map((c) => (
                <ComandaCard
                  key={c._id}
                  comanda={c}
                  cargando={enProceso.includes(c._id)} // activa sombreado
                  onCompletar={async () => {
                    setEnProceso((prev) => [...prev, c._id]);
                    try {
                      await completarComanda(c._id);
                    } catch (err) {
                      alert("❌ Error al completar comanda");
                      console.error(err);
                    } finally {
                      setEnProceso((prev) => prev.filter((id) => id !== c._id));
                    }
                  }}
                  onEliminar={() => eliminarComanda(c._id)}
                  onEditar={(comanda, platoSeleccionado) => {
                    setComandaEditando(comanda);
                    const platoOriginal = platos.find(
                      (p) => p.nombre === platoSeleccionado.nombre
                    );
                    if (!platoOriginal) {
                      alert("❌ Plato original no encontrado");
                      return;
                    }

                    setPlatoAEditar({
                      ...platoSeleccionado,
                      contenido: platoOriginal.contenido || [],
                      precio: platoOriginal.precio,
                    });

                    setModalEditarAbierto(true);
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {modalEditarAbierto && platoAEditar && comandaEditando && (
        <ModalEditarPlato
          plato={platoAEditar}
          cerrarModal={() => setModalEditarAbierto(false)}
          actualizarPlatoEditado={(nuevoPlato) => {
            const nuevosPlatillos = comandaEditando.platillos.map((p) =>
              p._id === nuevoPlato._id ? nuevoPlato : p
            );
            const comandaActualizada = {
              ...comandaEditando,
              platillos: nuevosPlatillos,
            };
            editarComanda(comandaActualizada);
            setModalEditarAbierto(false);
          }}
        />
      )}
    </div>
  );
}

