import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { generarComandaTexto } from "../../utils/generarComandaTexto";

const API = import.meta.env.VITE_API_URL;

export default function Comandas() {
  const { token, usuario } = useContext(AuthContext);
  const [comandas, setComandas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [propinas, setPropinas] = useState({});
  const [mostrarTodas, setMostrarTodas] = useState(false);

  useEffect(() => {
    const obtenerComandas = async () => {
      try {
        const res = await fetch(`${API}/api/comandas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const ordenadas = data.sort((a, b) => new Date(b.hora) - new Date(a.hora));
        setComandas(ordenadas);
      } catch (err) {
        console.error("Error al obtener comandas:", err);
      } finally {
        setCargando(false);
      }
    };
    obtenerComandas();
  }, [token, usuario]);

  // Inicialización limpia: usaPropina nace estrictamente en FALSE (Ley 1935 de 2018)
  useEffect(() => {
    if (!cargando && comandas.length > 0) {
      const iniciales = {};
      comandas.forEach((c) => {
        iniciales[c._id] = { porcentaje: 10, usaPropina: false };
      });
      setPropinas(iniciales);
    }
  }, [cargando, comandas]);

  const eliminarComanda = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta comanda?")) return;
    try {
      const res = await fetch(`${API}/api/comandas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje);
      setComandas((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar comanda:", err);
      alert("No se pudo eliminar la comanda");
    }
  };

  // SOLUCIÓN AL ESTADO FANTASMA: No destruyas el nodo, muta sus propiedades de forma segura
  const togglePropina = (id) => {
    setPropinas((prev) => {
      const yaActiva = prev[id]?.usaPropina || false;
      return {
        ...prev,
        [id]: {
          porcentaje: prev[id]?.porcentaje || 10,
          usaPropina: !yaActiva,
        },
      };
    });
  };

  const cambiarPorcentaje = (id, valor) => {
    setPropinas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        porcentaje: Number(valor),
        usaPropina: true,
      },
    }));
  };

  // AJUSTE FISCAL (Estatuto del Consumidor): Cálculo basado en el 8% de Impuesto al Consumo (INC)
  const calcularTotales = (platillos, propinaData) => {
    const totalMesa = platillos.reduce((acc, p) => acc + (p.precio || 0), 0);
    const subtotalINC = Math.round(totalMesa / 1.08);
    const impConsumo = totalMesa - subtotalINC;
    
    // Si usaPropina es false, el valor es 0 de forma estricta
    const porcentaje = propinaData?.usaPropina ? (propinaData.porcentaje || 0) : 0;
    const valorPropina = Math.round(totalMesa * (porcentaje / 100));
    const totalFinal = totalMesa + valorPropina;

    return { total: totalMesa, subtotal: subtotalINC, iva: impConsumo, valorPropina, totalFinal };
  };

  const comandasMostradas = mostrarTodas ? comandas : comandas.slice(0, 10);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Comandas</h2>
        <button
          onClick={async () => {
            const confirmar = confirm("¿Estás seguro de eliminar TODAS las comandas?");
            if (!confirmar) return;
            try {
              const res = await fetch(`${API}/api/comandas`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.mensaje);
              alert("✅ Comandas eliminadas correctamente");
              setComandas([]);
            } catch (err) {
              console.error("❌ Error al eliminar todas las comandas:", err);
              alert("No se pudieron eliminar las comandas");
            }
          }}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 text-sm"
        >
          Borrar todas
        </button>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : comandas.length === 0 ? (
        <p>No hay comandas activas.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {comandasMostradas.map((c) => {
            const propinaData = propinas[c._id] || { usaPropina: false, porcentaje: 10 };
            
            // Pasamos los datos al motor unificado de cálculo
            const { total, subtotal, iva, valorPropina, totalFinal } = calcularTotales(c.platillos, propinaData);

            return (
              <div key={c._id} className="bg-white rounded-lg shadow p-4 border border-gray-300">
                <h3 className="text-lg font-bold mb-2">🪑 {c.mesa}</h3>
                
                <div className="mb-2 text-sm">
                  {Array.isArray(c.platillos) &&
                    c.platillos.map((p, i) => {
                      const productosPlano = Array.isArray(p.productos)
                        ? p.productos
                            .map((prod) => {
                              const partes = prod.split(": ");
                              return partes.length === 2 ? partes[1] : prod;
                            })
                            .join(" - ")
                        : "Sin productos";
                      return (
                        <div key={i} className="mb-1">
                          <strong>{p.nombre}:</strong> {productosPlano}
                        </div>
                      );
                    })}
                </div>

                <div className="text-sm text-gray-800 mt-4 space-y-1">
                  <p>Subtotal Gravado: <span className="font-medium">${subtotal.toLocaleString("es-CO")}</span></p>
                  <p>Impuesto Consumo (8%): <span className="font-medium">${iva.toLocaleString("es-CO")}</span></p>
                  <p>Total sin propina: <span className="font-bold text-green-700">${total.toLocaleString("es-CO")}</span></p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm">
                      <input
                        type="checkbox"
                        checked={propinaData.usaPropina}
                        onChange={() => togglePropina(c._id)}
                        className="mr-1"
                      />
                      Aplicar propina
                    </label>
                    {propinaData.usaPropina && (
                      <>
                        <input
                          type="number"
                          value={propinaData.porcentaje}
                          onChange={(e) => cambiarPorcentaje(c._id, e.target.value)}
                          className="border rounded px-1 py-0.5 w-16 text-sm"
                          min={0}
                          max={100}
                        />
                        <span className="text-sm">%</span>
                      </>
                    )}
                  </div>

                  {propinaData.usaPropina && (
                    <>
                      <p className="text-green-700">
                        Propina ({propinaData.porcentaje}%):{" "}
                        <span className="font-medium">+ ${valorPropina.toLocaleString("es-CO")}</span>
                      </p>
                      <p className="text-green-900 font-bold">
                        Total final: ${totalFinal.toLocaleString("es-CO")}
                      </p>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  🕒{" "}
                  {new Date(c.hora).toLocaleString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>

                {/* SOLUCIÓN AL ENVÍO DE DATOS: Pasamos el porcentaje real basado estrictamente en el interruptor checkbox */}
                <button
                  onClick={() =>
                    generarComandaTexto({
                      ...c,
                      usuario: usuario, // Envía el objeto de sesión o string limpio de la base de datos
                      propina: propinaData.usaPropina ? propinaData.porcentaje : 0, // Inyección matemática exacta
                    })
                  }
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full text-sm"
                >
                  Descargar comanda TXT
                </button>

                <button
                  onClick={() => eliminarComanda(c._id)}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full text-sm"
                >
                  🗑 Eliminar
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!mostrarTodas && comandas.length > 10 && (
        <div className="mt-4 text-center">
          <button onClick={() => setMostrarTodas(true)} className="text-blue-600 underline text-sm">
            Mostrar todas ({comandas.length})
          </button>
        </div>
      )}
    </div>
  );
}
