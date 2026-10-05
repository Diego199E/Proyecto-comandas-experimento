import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

export default function Resumen() {
  const { token } = useContext(AuthContext);
  const [comandas, setComandas] = useState([]);
  const [resumen, setResumen] = useState([]);

  useEffect(() => {
    const obtenerComandas = async () => {
      try {
        const res = await fetch(`${API}/api/comandas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("✅ Comandas recibidas:", data);
        setComandas(data);
      } catch (err) {
        console.error("Error al obtener comandas:", err);
      }
    };

    obtenerComandas();
  }, [token]);

  useEffect(() => {
    const conteo = {};

    // 🔴 Filtrar solo comandas completadas
    const completadas = comandas.filter((c) => c.estado);

    completadas.forEach((comanda) => {
      comanda.platillos.forEach((plato) => {
        if (!conteo[plato.nombre]) {
          conteo[plato.nombre] = { cantidad: 0, total: 0 };
        }
        conteo[plato.nombre].cantidad += 1;
        conteo[plato.nombre].total += plato.precio || 0;
      });
    });

    const dataResumen = Object.entries(conteo).map(([nombre, valores]) => ({
      nombre,
      cantidad: valores.cantidad,
      total: valores.total,
    }));

    setResumen(dataResumen);
  }, [comandas]);

  const totalGlobal = resumen.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Resumen de Ventas por Plato (Solo Completadas)
      </h2>

      {/* Tabla normal responsive */}
      <div className="mb-6 overflow-x-auto rounded border border-gray-300">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-orange-200">
            <tr>
              <th className="p-2 text-left border">Plato</th>
              <th className="p-2 text-left border">Cantidad Vendida</th>
              <th className="p-2 text-left border">Total Vendido</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map((plato) => (
              <tr key={plato.nombre} className="hover:bg-orange-50">
                <td className="p-2 border">{plato.nombre}</td>
                <td className="p-2 border">{plato.cantidad}</td>
                <td className="p-2 border">
                  ${plato.total.toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100">
              <td className="p-2 border text-right" colSpan={2}>
                Total General:
              </td>
              <td className="p-2 border">
                ${totalGlobal.toLocaleString("es-CO")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Gráfico de barras responsive */}
      <div className="w-full h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={resumen}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="cantidad"
              fill="#a13a34"
              name="Cantidad Vendida"
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
